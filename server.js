//Packages declaration
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jsdom = require("jsdom");
const dom = new jsdom.JSDOM("");
const jquery = require("jquery")(dom.window);
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

//Database
const db = mysql.createConnection({
	host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: 'mpdb',
    clearExpired: true,
    checkExpirationInterval: 60000 //1 minute in ms
});

db.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
        return;
	}
    console.log('Connected as ID ' + db.threadId);
});

//Session
const sessionStore = new MySQLStore({
    expiration: 3600000, //1 hour in ms
    createDatabaseTable: true,
    schema: {
		tableName: 'sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data'
		}
	}
},db);

//App
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(session({
    secret : process.env.SESH_SECRET, //key that will sign cookie
    resave: false, //false = do not create new session for every req
    saveUninitialized: false, //false = don't save if session has not been modified
    store: sessionStore //where the session will be stored
}));
app.use(function(req,res,next){ //allow views to access session
    res.locals.session = req.session;
    next();
});
app.use(express.json());
app.use(fileUpload());

//Today's Date Stamp
const ts_today = new Date();
const date_today = ts_today.getDate();
const month_today = ts_today.getMonth() + 1;
const year_today = ts_today.getFullYear();
const today = year_today + "-" + month_today + "-" + date_today;
console.log("Accessed on " + today);

//Random Key Generator (for image uploads)
function picKey() {
    var key = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var chars_length = chars.length;
    for ( var i = 0; i < 10; i++ ) {
        key += chars.charAt(Math.floor(Math.random() * chars_length));
    }
    return key;
}

//URL Routing

/* GET index.ejs */
app.get("/", function(req, res){
    let select_posts = "SELECT p.postID, p.username, p.title, p.photo, u.profilepic FROM user_posts p JOIN users u ON p.username = u.username WHERE p.username = u.username ORDER BY p.postID DESC;";
    let query = db.query(select_posts, (err, rows) => {
        if (err) throw err;
        res.render("index", {
            pagetitle : "Home",
            posts : rows
        });
    });
});

/* POST index.ejs - for after login */
app.post("/", function(req, res){
    let check = "SELECT * FROM users WHERE username = '" + req.body.username + "'";
    var query = db.query(check, (err, results) => {
        if(err) throw err;
        if(results.length == 1){ //username exist
            if(bcrypt.compareSync(req.body.pwd, results[0].Password)){ //password matches
                req.session.username = results[0].Username; //create session
                req.session.displayname = results[0].DisplayName;
                req.session.isAuth = true;
                res.redirect("/");
            }else{
                res.redirect("/login?error=" + encodeURIComponent('wrongcreds'));
            }
        }else{
            res.redirect("/login?error=" + encodeURIComponent('wrongcreds'));
        }
    });
});

/* about.ejs */
app.get("/about", function(req, res){
    res.render("about", {pagetitle : "About Us"});
});

/* search.ejs */
app.get("/search", function(req, res){
    let search = "SELECT p.postID, p.username, p.title, p.photo, u.profilepic FROM user_posts p JOIN users u ON p.username = u.username WHERE p.username = u.username AND p.username LIKE '%" + req.query.q + "%' OR p.title LIKE '%" + req.query.q + "%' OR p.tags LIKE '%" + req.query.q + "%' ORDER BY p.postID DESC";
    let query = db.query(search, (err, rows) => {
        if (err) throw err;
        res.render("search", {
            pagetitle : "Search result for \"" + req.query.q + "\"",
            input : req.query.q,
            posts : rows
        });
    });
});

/* GET login.ejs */
app.get("/login", function(req, res){
    res.render("login", {pagetitle : "Login"});
});

/* POST login.ejs - for after register */
app.post("/login", function(req, res){
    let check = "SELECT * FROM users WHERE username = '" + req.body.username + "' OR email = '" + req.body.email + "'";
    var query1 = db.query(check, (err, results) => {
        if(err) throw err;
        if(results.length == 0){ //no duplicates
            let hash = bcrypt.hashSync(req.body.pwd, 10); //encrypt password
            let pfp = '/images/icons/icon.jpg' //default profile picture
            let data = {Username: req.body.username, Password: hash, Email: req.body.email, ProfilePic: pfp, DisplayName: req.body.username, Bio: null};
            let insertuser = "INSERT INTO users SET ?";
            let query2 = db.query(insertuser, data,(err) => {
                if(err) throw err;
                res.redirect("/login?reg=" + encodeURIComponent('success'));
            });
        }else{
            res.redirect("/register?error=" + encodeURIComponent('usedcreds'));
        }
    });
});

/* register.ejs */
app.get("/register", function(req, res){
    res.render("register", {pagetitle : "Register"});
});

/* for logout */
app.get("/logout", function(req, res){
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/");
    });
});

/* GET profile.ejs */
app.get("/profile/:username", function(req, res){
    let get_userprofile = "SELECT u.username, u.profilepic, u.displayname, u.bio FROM users u WHERE u.username = '" + req.params.username + "'";
    var user;
    let query1 = db.query(get_userprofile, (err, result) => {
        if (err) throw err;
        user = result[0];
    }); 

    let get_userposts = "SELECT p.postID, p.username, p.title, p.photo, p.likecount, p.bookmarkcount, p.commentcount FROM user_posts p WHERE p.username = '" + req.params.username + "' ORDER BY p.postID DESC";
    let query2 = db.query(get_userposts, (err, rows) => {
        if (err) throw err;
        res.render("profile", {
            pagetitle : req.params.username,
            myposts : rows,
            user : user
        });
    }); 
});

/* POST profile.ejs - for after edit-profile */
app.post("/profile/:username", function(req, res){
    //sql statements
    let get_user = "SELECT * FROM users WHERE username = '" + req.session.username + "'";

    //check if no file
    if (!req.files || Object.keys(req.files).length === 0){
    }else{
        //grab file
        let photo = req.files.profilepic;

        //check if valid extension
        const extensionName = path.extname(photo.name).toLowerCase(); // fetch the file extension
        const allowedExtension = ['.png','.jpg','.jpeg'];
        if(!allowedExtension.includes(extensionName)){ //invalid file
            return res.status(422).redirect("/profile/" + req.session.username + "?error=" + encodeURIComponent('invalid-icon'));
        }

        //delete old icon
        let querygi = db.query(get_user, (err, result) => {
            if (err) throw err;
            if (result[0].ProfilePic != "/images/icons/icon.jpg"){
                fs.unlink(__dirname + "/public/" + result[0].ProfilePic, (err) => { if (err) throw err; }); //delete profile picture file
            }
        });

        //rename file
        let fname = req.session.username + extensionName;
        let fpath = __dirname + "/public/images/icons/" + fname;
        
        //move file to desired position
        photo.mv(fpath, function(err){ if (err) return res.status(500).send(err); });
        
        //update profile picture
        let update_icon = "UPDATE users SET ProfilePic = '/images/icons/" + fname + "' WHERE Username = '" + req.session.username + "'";
        let queryui = db.query(update_icon, (err) => { if (err) throw err; });
    }

    //check if password null
    if (req.body.pwd.length == 0){
    }else{
        let hash = bcrypt.hashSync(req.body.pwd, 10); //encrypt password
        let update_pwd = "UPDATE users SET Password = '" + hash + "' WHERE Username = '" + req.session.username + "'";
        let queryup = db.query(update_pwd, (err) => { if (err) throw err; });
    }

    //check if email matches
    let querygu = db.query(get_user, (err, result) => { 
        if (err) throw err; 
        if(result[0].Email == req.body.email){
        }else{
            //check if email exists
            let get_email = "SELECT * FROM users WHERE email = '" + result[0].Email + "'";
            let queryge = db.query(get_email, (err, email) => { 
                if (err) throw err; 
                if(email[0].length != 0){
                    console.log("email exists")
                    return res.redirect("/profile/" + req.session.username + "?error=" + encodeURIComponent('email-already-used'));
                }
                console.log("email does not exist")
                let update_email = "UPDATE users SET Email = '" + req.body.email + "' WHERE Username = '" + req.session.username + "'";
                let queryue = db.query(update_email, (err) => { if (err) throw err; });
            });
        }
    });

    //update other information
    let data = {DisplayName: req.body.displayname, Bio: req.body.bio};
    let update_profile = "UPDATE users SET ? WHERE Username = '" + req.session.username + "'";
    let queryu = db.query(update_profile, data,(err) => {
        if (err) throw err;
        req.session.displayname = req.body.displayname; //change displayname in session
        res.redirect("/profile/" + req.session.username);
    });
});

/* edit-profile.ejs */
app.get("/profile/edit/:username", function(req, res){
    if(!req.session.isAuth){
        return res.redirect("/");
    }

    let get_userprofile = "SELECT * FROM users WHERE username = '" + req.params.username + "'";
    let query = db.query(get_userprofile, (err, result) => {
        if (err) throw err;
        res.render("edit-profile", {
            pagetitle : "Edit Profile",
            user : result[0]
        });
    });
});

/* for delete-profile */
app.get("/profile/delete/:username", function(req, res){
    if(!req.session.isAuth){
        return res.redirect("/");
    }

    console.log("Deleting user: " + req.params.username);

    //sql statements
    let get_comments = "SELECT * FROM comments WHERE username = '" + req.params.username + "'";
    let del_comments = "DELETE FROM comments WHERE username = '" + req.params.username + "'";
    let get_likes = "SELECT * FROM likes WHERE username = '" + req.params.username + "'";
    let del_likes = "DELETE FROM likes WHERE username = '" + req.params.username + "'";
    let get_bookmarks = "SELECT * FROM user_bookmarks WHERE username = '" + req.params.username + "'";
    let del_bookmarks = "DELETE FROM user_bookmarks WHERE username = '" + req.params.username + "'";
    let get_posts = "SELECT * FROM user_posts WHERE username = '" + req.params.username + "'";
    let del_posts = "DELETE FROM user_posts WHERE username = '" + req.params.username + "'";
    let get_profile = "SELECT * FROM users WHERE username = '" + req.params.username + "'";
    let del_profile = "DELETE FROM users WHERE username = '" + req.params.username + "'";

    //delete all comments made by user
    let queryc1 = db.query(get_comments, (err, rows) => {
        if (err) throw err;
        rows.forEach(function(row){
            //update post statistics of affected posts
            let update_comments = "UPDATE `user_posts` SET CommentCount = CommentCount-1 WHERE PostID = " + row.PostID;
            let queryc2 = db.query(update_comments, (err) => { if (err) throw err; });
        });
        let queryc3 = db.query(del_comments, (err) => {
            if (err) throw err;
            console.log("Step 1 complete: Comments deleted");
        });
    });

    //delete all likes made by user
    let queryl1 = db.query(get_likes, (err, rows) => {
        if (err) throw err;
        rows.forEach(function(row){
            //update post statistics of affected posts
            let update_likes = "UPDATE `user_posts` SET LikeCount = LikeCount-1 WHERE PostID = " + row.PostID;
            let queryl2 = db.query(update_likes, (err) => { if (err) throw err; });
        });
        let queryl3 = db.query(del_likes, (err) => {
            if (err) throw err;
            console.log("Step 2 complete: Likes deleted");
        });
    });

    //delete all bookmarks made by user
    let queryb1 = db.query(get_bookmarks, (err, rows) => {
        if (err) throw err;
        rows.forEach(function(row){
            //update post statistics of affected posts
            let update_bookmarks = "UPDATE `user_posts` SET BookmarkCount = BookmarkCount-1 WHERE PostID = " + row.PostID;
            let queryl2 = db.query(update_bookmarks, (err) => { if (err) throw err; });
        });
        let queryb3 = db.query(del_bookmarks, (err) => {
            if (err) throw err;
            console.log("Step 3 complete: Bookmarks deleted");
        });
    });

    //delete all posts made by user
    let queryp1 = db.query(get_posts, (err, rows) => {
        if (err) throw err;
        rows.forEach(function(row){
            //delete all comments, likes, and bookmarks made on the post
            let del_pcomments = "DELETE FROM comments WHERE PostID = " + row.PostID;
            let del_plikes = "DELETE FROM likes WHERE PostID = " + row.PostID;
            let del_pbookmarks = "DELETE FROM user_bookmarks WHERE PostID = " + row.PostID;
            let queryp2 = db.query(del_pcomments, (err) => { if (err) throw err; });
            let queryp3 = db.query(del_plikes, (err) => { if (err) throw err; });
            let queryp4 = db.query(del_pbookmarks, (err) => { if (err) throw err; });
            fs.unlink(__dirname + "/public/" + row.Photo, (err) => { if (err) throw err; }); //delete photo file
        });
        let queryp5 = db.query(del_posts, (err) => {
            if (err) throw err;
            console.log("Step 4 complete: Posts deleted");

            //delete user
            let queryu1 = db.query(get_profile, (err, result) => {
                if (err) throw err;
                if (result[0].ProfilePic != "/images/icons/icon.jpg"){
                    fs.unlink(__dirname + "/public/" + result[0].ProfilePic, (err) => { if (err) throw err; }); //delete profile picture file
                }
                let queryu2 = db.query(del_profile, (err) => {
                    if (err) throw err;
                    console.log("Step 5 complete: User deleted");
                    res.redirect("/logout"); //logout user since their account no longer exists
                });
            });
        });
    });
});

/* bookmarks.ejs */
app.get("/bookmarks", function(req, res){
    if(!req.session.isAuth){
        return res.redirect("/");
    }

    let get_userposts = "SELECT p.postID, p.username, p.title, p.photo, u.profilepic FROM user_posts p JOIN users u ON p.username = u.username JOIN user_bookmarks b on p.postID = b.postID WHERE b.username = '" + req.session.username + "' AND b.postID = p.postID ORDER BY p.postID DESC;";
    let query = db.query(get_userposts, (err, rows) => {
        if (err) throw err;
        res.render("bookmarks", {
            pagetitle : "My Bookmarks",
            bookmarked : rows
        });
    }); 
});

/* GET view-post.ejs */
app.get("/post/:username/:postID-:title", function(req, res){
    let get_post = "SELECT p.*, u.profilepic FROM user_posts p JOIN users u ON p.username = u.username WHERE p.postID = '" + req.params.postID + "';";
    var upost, like, bookmark;
    let query1 = db.query(get_post, (err, result) => {
        if (err) throw err;
        upost = result[0];
    });

    if(req.session.isAuth){
        //check if post is liked
        let check_likes = "SELECT * FROM likes WHERE username = '" + req.session.username + "' AND postID = " + req.params.postID;
        let queryl = db.query(check_likes, (err, result) => {
            if (err) throw err;
            if(result.length == 1){ //liked
                like = "<i class='bi bi-heart-fill'></i>";
            }else{
                like = "<i class='bi bi-heart'></i>";
            }
        });

        //check if post is bookmarked
        let check_bookmarks = "SELECT * FROM user_bookmarks WHERE username = '" + req.session.username + "' AND postID = " + req.params.postID;
        let queryb = db.query(check_bookmarks, (err, result) => {
            if (err) throw err;
            if(result.length == 1){ //bookmarked
                bookmark = "<i class='bi bi-bookmark-fill'></i>";
            }else{
                bookmark = "<i class='bi bi-bookmark'></i>";
            }
        });
    }
    
    let get_comments = "SELECT c.*, u.profilepic FROM comments c JOIN users u ON c.username = u.username WHERE c.postID = '" + req.params.postID + "' ORDER BY c.commentID DESC;";
    let query2 = db.query(get_comments, (err, rows) => {
        if (err) throw err;
        res.render("view-post", {
            pagetitle : req.params.title + " by " + req.params.username,
            comments : rows,
            post : upost,
            likeBtn : like,
            bookmarkBtn : bookmark
        });
    });
});

/* POST view-post.ejs - for after edit-post */
app.post("/post/:username/:postID-:title", function(req, res){
    //check if title is whitespace only
    if (req.body.location.trim().length == 0){
        return res.redirect("/post/" + req.params.username + "/" + req.params.postID + "-" + req.params.title + "?error=" + encodeURIComponent('title-is-null'));
    }
    
    let data = {Caption: req.body.caption, Tags: req.body.tags, Title: req.body.location};
    let update_post = "UPDATE user_posts SET ? WHERE postID = " + req.params.postID;
    let query = db.query(update_post, data,(err) => {
        if(err) throw err;
        res.redirect("/post/" + req.params.username + "/" + req.params.postID + "-" + req.params.title);
    });
});

/* GET create-post.ejs */
app.get("/create-post", function(req, res){
    if(!req.session.isAuth){
        return res.redirect("/");
    }

    let get_userprofile = "SELECT u.username, u.profilepic, u.displayname, u.bio FROM users u WHERE u.username = '" + req.session.username + "'";
    var user;
    let query1 = db.query(get_userprofile, (err, result) => {
        if (err) throw err;
        user = result[0];
        res.render("create-post", {
            pagetitle : "Create Post",
            user : user
        });
    }); 
});

/* POST create-post.ejs - for after create-post */
app.post("/create-post", function(req, res){
    //variables for form data
    var caption = req.body.caption;
    var tags = req.body.tags;
    var title = req.body.location;

    //check if no file
    if (!req.files || Object.keys(req.files).length === 0){
        return res.redirect("/create-post?error=" + encodeURIComponent('null'));
    }
    
    //grab file
    let photo = req.files.photo;

    //check if valid extension
    const extensionName = path.extname(photo.name).toLowerCase(); // fetch the file extension
    const allowedExtension = ['.png','.jpg','.jpeg'];
    if(!allowedExtension.includes(extensionName)){ //invalid file
        return res.status(422).redirect("/create-post?error=" + encodeURIComponent('invalid'));
    }

    //rename file
    let fname = req.session.username + "-" + title + "-" + picKey() + extensionName;
    let fpath = __dirname + "/public/images/posts/" + fname;
    
    //move file to desired position
    photo.mv(fpath, function(err){ if (err) return res.status(500).send(err); });

    //add to database
    var file = "/images/posts/" + fname;
    let data = {Title: title, Username: req.session.username, Photo: file, Date: today, Tags: tags, Caption: caption};
    let upload = "INSERT INTO user_posts SET ?";
    let query = db.query(upload, data,(err) => {
        if(err) throw err;
        console.log("Post upload successful");
        res.redirect("/profile/" + req.session.username);  
    });
});

/* edit-post.ejs */
app.get("/post/edit/:username/:postID-:title", function(req, res){
    if(!req.session.isAuth){
        return res.redirect("/");
    }

    let get_post = "SELECT p.*, u.profilepic FROM user_posts p JOIN users u ON p.username = u.username WHERE p.postID = '" + req.params.postID + "';";
    let query1 = db.query(get_post, (err, result) => {
        if (err) throw err;
        res.render("edit-post", {
            pagetitle : "Edit Post",
            post : result[0]
        });
    });
});

/* for delete-post */
app.get("/post/delete/:username/:postID-:title", function(req, res){
    if(!req.session.isAuth){
        return res.redirect("/");
    }
    
    console.log("Deleting post: " + req.params.postID + "-" + req.params.username);

    //sql statements
    let del_comments = "DELETE FROM comments WHERE postID = " + req.params.postID;
    let del_likes = "DELETE FROM likes WHERE postID = " + req.params.postID;
    let del_bookmarks = "DELETE FROM user_bookmarks WHERE postID = " + req.params.postID;
    let get_post = "SELECT * FROM user_posts WHERE postID = " + req.params.postID;
    let del_post = "DELETE FROM user_posts WHERE postID = " + req.params.postID;

    //delete comments associated with post
    let queryc = db.query(del_comments, (err) => {
        if (err) throw err;
        console.log("Step 1 complete: Comments deleted");
    });

    //delete likes associated with post
    let queryl = db.query(del_likes, (err) => {
        if (err) throw err;
        console.log("Step 2 complete: Likes deleted");
    });

    //delete bookmarks associated with post
    let queryb = db.query(del_bookmarks, (err) => {
        if (err) throw err;
        console.log("Step 3 complete: Bookmarks deleted");
    });

    //delete post
    let queryp1 = db.query(get_post, (err, result) => {
        if (err) throw err;
        fs.unlink(__dirname + "/public/" + result[0].Photo, (err) => { //delete photo file
            if (err) throw err;
            console.log("Step 4 complete: Photo deleted");
        });
        let query2 = db.query(del_post, (err) => {
            if (err) throw err;
            console.log("Step 5 complete: Post deleted");
            res.redirect("/profile/" + req.params.username);
        });
    });
});

/* for add-comment */
app.post("/post/comment/:username/:postID-:title", function(req,res){
    let data = {PostID: req.params.postID, Username: req.session.username, Comment: req.body.comment, Date: today};
    let add_comment = "INSERT INTO `comments` SET ?";
    let query1 = db.query(add_comment, data,(err) => {
        if(err) throw err;
        let inc_commentcount = "UPDATE `user_posts` SET CommentCount = CommentCount+1 WHERE PostID = '" + req.params.postID + "'";
        let query2 = db.query(inc_commentcount, (err, result) => { //increment comment count
            if (err) throw err;
            res.redirect("/post/" + req.params.username + "/" + req.params.postID + "-" + req.params.title);
        });
    });
});

/* for delete-comment */
app.get("/post/:username/:postID-:title/comment/:commentID/delete", function(req,res){
    if(!req.session.isAuth){
        return res.redirect("/");
    }

    let del_comment = "DELETE FROM `comments` WHERE CommentID = " + req.params.commentID;
    let query1 = db.query(del_comment,(err) => {
        if(err) throw err;
        let dec_commentcount = "UPDATE `user_posts` SET CommentCount = CommentCount-1 WHERE PostID = '" + req.params.postID + "'";
        let query2 = db.query(dec_commentcount, (err) => { //decrement comment count
            if (err) throw err;
            res.redirect("/post/" + req.params.username + "/" + req.params.postID + "-" + req.params.title);
        });
    });
});

/* for likes */
app.get("/post/like/:username/:postID-:title", function(req,res){
    if(!req.session.isAuth){
        return res.redirect("/");
    }

    //check if post is liked
    let check_likes = "SELECT * FROM likes WHERE username = '" + req.session.username + "' AND postID = " + req.params.postID;
    let query = db.query(check_likes, (err, result) => {
        if (err) throw err;
        if(result.length == 0){ //not liked
            //like post
            let like = "INSERT INTO likes SET username = '" + req.session.username + "', postID = " + req.params.postID;
            let queryl = db.query(like, (err) => { 
                if (err) throw err; 
                //increment like count
                let inc_lcount = "UPDATE `user_posts` SET LikeCount = LikeCount+1 WHERE PostID = " + req.params.postID;
                let queryil = db.query(inc_lcount, (err) => { if (err) throw err; });
            });
        }else{ //liked
            //unlike post
            let del_like = "DELETE FROM likes WHERE username = '" + req.session.username + "' AND postID = " + req.params.postID;
            let queryul = db.query(del_like, (err) => { 
                if (err) throw err; 
                //decrement like count
                let dec_lcount = "UPDATE `user_posts` SET LikeCount = LikeCount-1 WHERE PostID = " + req.params.postID;
                let querydl = db.query(dec_lcount, (err) => { if (err) throw err; });
            });
        }
        res.redirect("/post/" + req.params.username + "/" + req.params.postID + "-" + req.params.title);
    });
});

/* for bookmarks */
app.get("/post/bookmark/:username/:postID-:title", function(req,res){
    if(!req.session.isAuth){
        return res.redirect("/");
    }
    
    //check if post is bookmarked
    let check_bookmarks = "SELECT * FROM user_bookmarks WHERE username = '" + req.session.username + "' AND postID = " + req.params.postID;
    let query = db.query(check_bookmarks, (err, result) => {
        if (err) throw err;
        if(result.length == 0){ //not bookmarked
            //bookmark post
            let bookmark = "INSERT INTO user_bookmarks SET username = '" + req.session.username + "', postID = " + req.params.postID;
            let queryb = db.query(bookmark, (err) => { 
                if (err) throw err; 
                //increment bookmark count
                let inc_bcount = "UPDATE `user_posts` SET BookmarkCount = BookmarkCount+1 WHERE PostID = " + req.params.postID;
                let queryib = db.query(inc_bcount, (err) => { if (err) throw err; });
            });
        }else{ //bookmarked
            //unbookmark post
            let del_bookmark = "DELETE FROM user_bookmarks WHERE username = '" + req.session.username + "' AND postID = " + req.params.postID;
            let queryub = db.query(del_bookmark, (err) => { 
                if (err) throw err; 
                //decrement bookmark count
                let dec_bcount = "UPDATE `user_posts` SET BookmarkCount = BookmarkCount-1 WHERE PostID = " + req.params.postID;
                let querydb = db.query(dec_bcount, (err) => { if (err) throw err; });
            });
        }
        res.redirect("/post/" + req.params.username + "/" + req.params.postID + "-" + req.params.title);
    });
});

//Listener
app.listen(process.env.PORT || 3000, '0.0.0.0', err => {
    if (err) throw err
    console.log("Server started on port " + process.env.PORT );
});