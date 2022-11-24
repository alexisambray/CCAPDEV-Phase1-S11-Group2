//Packages declaration
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const md5 = require("md5");
const jsdom = require("jsdom");
const dom = new jsdom.JSDOM("");
const jquery = require("jquery")(dom.window);
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);

//Database
const db = mysql.createConnection({
    //Note: modify this part to match your local settings!
	host: 'localhost',
    user: 'root',
    password: 'ccapdev123',
    database: 'mpdb'
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
    expiration: 10800000,
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
    secret : 'visitourmpgrp2', //key that will sign cookie
    resave: false, //false = do not create new session for every req
    saveUninitialized: false, //false = don't save if session has not been modified
    store: sessionStore //where the session will be stored
}));
app.use(function(req,res,next){ //allow views to access session
    res.locals.session = req.session;
    next();
});
app.use(express.json());

//URL Routing

/* GET index.ejs */
app.get("/", function(req, res){
    let select_posts = "SELECT p.postID, p.username, p.title, p.photo, u.profilepic FROM user_posts p JOIN users u ON p.username = u.username WHERE p.username = u.username;";
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
    let hash = md5(req.body.pwd); //encrypt password
    let check = "SELECT * FROM users WHERE username = '" + req.body.username + "' AND password = '" + hash + "'";
    console.log(req.body.username + " " + hash);
    var query1 = db.query(check, (err, results) => {
        if(err) throw err;
        if(results.length == 1){ //username and password exist and match
            req.session.username = results[0].Username; //create session
            req.session.displayname = results[0].DisplayName;
            req.session.isAuth = true;
            res.redirect("/");
        }else{
            res.redirect("/login?error=" + encodeURIComponent('wrongcreds'));
        }
    });
});

/* about.ejs */
app.get("/about", function(req, res){
    res.locals.username = "placeholder";
    res.render("about", {pagetitle : "About Us"});
});

/* search.ejs */
app.get("/search/", function(req, res){
    res.locals.username = "placeholder";
    res.render("search", {pagetitle : "Search result for '" + res.locals.q + "'"});
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
            let hash = md5(req.body.pwd); //encrypt password
            let pfp = '/images/icon.jpg' //default profile picture
            let data = {Username: req.body.username, Password: hash, Email: req.body.email, ProfilePic: pfp, DisplayName: req.body.username, Bio: null};
            let insertuser = "INSERT INTO users SET ?";
            let query2 = db.query(insertuser, data,(err, results) => {
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

    let get_userposts = "SELECT p.postID, p.username, p.title, p.photo, p.likecount, p.bookmarkcount, p.commentcount FROM user_posts p WHERE p.username = '" + req.params.username + "'";
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
    //call js here
    res.send(req.body);
    /*res.redirect("/profile/" + req.params.username);*/
});

/* edit-profile.ejs */
app.get("/profile/edit/:username", function(req, res){
    let get_userprofile = "SELECT u.* FROM users u WHERE u.username = '" + req.params.username + "'";
    let query1 = db.query(get_userprofile, (err, result) => {
        if (err) throw err;
        res.render("edit-profile", {
            pagetitle : "Edit Profile",
            user : result[0]
        });
    });
});

/* bookmarks.ejs */
app.get("/bookmarks", function(req, res){
    let get_userposts = "SELECT p.postID, p.username, p.title, p.photo, u.profilepic FROM user_posts p JOIN users u ON p.username = u.username JOIN user_bookmarks b on p.postID = b.postID WHERE b.username = '" + req.session.username + "' AND b.postID = p.postID;";
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
    var upost;
    let query1 = db.query(get_post, (err, result) => {
        if (err) throw err;
        upost = result[0];
    });

    let get_comments = "SELECT c.*, u.profilepic FROM comments c JOIN users u ON c.username = u.username WHERE c.postID = '" + req.params.postID + "';";
    let query2 = db.query(get_comments, (err, rows) => {
        if (err) throw err;
        res.render("view-post", {
            pagetitle : req.params.title + " by " + req.params.username,
            comments : rows,
            post : upost
        });
    });
});

/* POST view-post.ejs - for after edit-post */
app.post("/post/:username/:postID-:title", function(req, res){
    //call js here
    res.redirect("/post/" + req.params.username + "/" + req.params.postID + "-" + req.params.title);
});

/* create-post.ejs */
app.get("/create-post", function(req, res){
    res.locals.pagetitle = "Create Post";
    res.render("create-post");
});

/* edit-post.ejs */
app.get("/post/edit/:username/:postID-:title", function(req, res){
    let get_post = "SELECT p.*, u.profilepic FROM user_posts p JOIN users u ON p.username = u.username WHERE p.postID = '" + req.params.postID + "';";
    let query1 = db.query(get_post, (err, result) => {
        if (err) throw err;
        res.render("edit-post", {
            pagetitle : "Edit Post",
            post : result[0]
        });
    });
});

//Listener
app.listen(3000, function() {
    console.log("Server started on port 3000");
});