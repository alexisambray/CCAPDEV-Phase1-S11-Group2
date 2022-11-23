//Packages express and body-parser declaration
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

//App
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

//Database
const db = mysql.createConnection({
    //Note: modify this part to match your local settings!
	host: 'localhost',
    user: 'root',
    password: 'ccapdev123',
    database: 'mpdb',

    multipleStatements: true
});

db.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
        return;
	}
    console.log('Connected as ID ' + db.threadId);
});

//URL Routing

/* GET index.ejs */
app.get("/", function(req, res){
    res.locals.username = "placeholder";

    //sql
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
    //call js here
    res.locals.pagetitle = "Home";
    res.locals.username = "placeholder";
    res.render("index");
});

/* about.ejs */
app.get("/about", function(req, res){
    res.locals.pagetitle = "About Us";
    res.locals.username = "placeholder";
    res.render("about");
});

/* search.ejs */
app.get("/search/", function(req, res){
    res.locals.pagetitle = "Search result for " + res.locals.q;
    res.locals.username = "placeholder";
    res.locals.input = req.params.input;
    res.render("search");
});

/* GET login.ejs */
app.get("/login", function(req, res){
    res.locals.pagetitle = "Login";
    res.render("login");
});

/* POST login.ejs - for after register */
app.post("/login", function(req, res){
    //call js here
    res.locals.pagetitle = "Login";
    res.render("login");
});

/* register.ejs */
app.get("/register", function(req, res){
    res.locals.pagetitle = "Register";
    res.render("register");
});

/* for logout */
app.get("/logout", function(req, res){
    //call js here
    res.locals.pagetitle = "Home";
    res.locals.username = "placeholder";
    res.render("/");
});

/* GET profile.ejs */
app.get("/profile/:username", function(req, res){
    //sql
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
    res.locals.pagetitle = req.params.username;
    res.locals.username = req.params.username;
    res.render("profile");
});

/* edit-profile.ejs */
app.get("/profile/edit/:username", function(req, res){
    res.locals.pagetitle = "Edit Profile";
    res.locals.username = req.params.username;
    res.render("edit-profile");
});

/* bookmarks.ejs */
app.get("/bookmarks/:username", function(req, res){
    let get_userprofile = "SELECT u.displayname FROM users u WHERE u.username = '" + req.params.username + "'";
    var dname;
    let query1 = db.query(get_userprofile, (err, result) => {
        if (err) throw err;
        dname = result[0];
    }); 

    let get_userposts = "SELECT p.postID, p.username, p.title, p.photo, u.profilepic FROM user_posts p JOIN users u ON p.username = u.username JOIN user_bookmarks b on p.postID = b.postID WHERE b.username = '" + req.params.username + "' AND b.postID = p.postID;";
    let query2 = db.query(get_userposts, (err, rows) => {
        if (err) throw err;
        res.render("bookmarks", {
            pagetitle : "My Bookmarks",
            bookmarked : rows,
            dname : dname
        });
    }); 
});

/* GET view-post.ejs */
app.get("/post/:username/:postID-:title", function(req, res){
    res.locals.pagetitle = req.params.title + " by " + req.params.username;
    res.locals.username = req.params.username;
    res.locals.postID = req.params.postID;
    res.locals.title = req.params.title;
    res.render("view-post");
});

/* POST view-post.ejs - for after edit-post */
app.post("/post/:username/:postID-:title", function(req, res){
    res.locals.pagetitle = req.params.title + " by " + req.params.username;
    res.locals.username = req.params.username;
    res.locals.postID = req.params.postID;
    res.locals.title = req.params.title;
    //call js here
    res.render("view-post");
});

/* create-post.ejs */
app.get("/create-post", function(req, res){
    res.locals.pagetitle = "Create Post";
    res.render("create-post");
});

/* edit-post.ejs */
app.get("/post/edit/:username/:postID-:title", function(req, res){
    res.locals.pagetitle = "Edit Post";
    res.locals.username = req.params.username;
    res.locals.postID = req.params.postID;
    res.locals.title = req.params.title;
    res.render("edit-post");
});

//Listener
app.listen(3000, function() {
    console.log("Server started on port 3000");
});