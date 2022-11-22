//Packages express and body-parser declaration
const express = require("express");
const bodyParser = require("body-parser");

//App
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

//Variables
var username = 'username123';
var title = 'Maldives';

//URL Routing

/* GET index.ejs */
app.get("/", function(req, res){
    res.locals.pagetitle = "Home";
    res.locals.username = username;
    res.render("index");
});

/* POST index.ejs - for after login */
app.post("/", function(req, res){
    //call js here
});

/* GET login.ejs */
app.get("/login", function(req, res){
    res.locals.pagetitle = "Login";
    res.render("login");
});

/* POST login.ejs - for after register */
app.post("/login", function(req, res){
    //call js here
});

/* register.ejs */
app.get("/register", function(req, res){
    res.locals.pagetitle = "Register";
    res.render("register");
});

/* for logout */
app.get("/logout", function(req, res){
    //call js here
});

/* GET profile.ejs */
app.get("/profile/:username", function(req, res){
    res.locals.pagetitle = username;
    res.locals.username = username;
    res.render("profile");
});

/* POST profile.ejs - for after edit-profile */
app.post("/profile/:username", function(req, res){
    //call js here
});

/* edit-profile.ejs */
app.get("/profile/edit/:username", function(req, res){
    res.locals.pagetitle = "Edit Profile";
    res.locals.username = username;
    res.render("edit-profile");
});

/* bookmarks.ejs */
app.get("/bookmarks/:username", function(req, res){
    res.locals.pagetitle = "My Bookmarks";
    res.render("bookmarks");
});

/* view-post.ejs */
app.get("/post/:username/:postID-:title", function(req, res){
    res.locals.pagetitle = title + " by " + username;
    res.locals.username = username;
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
    res.locals.username = username;
    res.render("edit-post");
});

//Listener
app.listen(3000, function() {
    console.log("Server started on port 3000.");
});