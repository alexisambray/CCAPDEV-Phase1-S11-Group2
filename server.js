//Packages express and body-parser declaration
const express = require("express");
const bodyParser = require("body-parser");

//App
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

//URL Routing

/* GET index.ejs */
app.get("/", function(req, res){
    res.render("index");
});

/* POST index.ejs */
// for after login
app.post("/", function(req, res){
    res.render("index");
});

/* GET login.ejs */
app.get("/login", function(req, res){
    res.render("login");
});

/* POST login.ejs */
// for after register
app.post("/login", function(req, res){
    res.render("login");
});

/* register.ejs */
app.get("/register", function(req, res){
    res.render("register");
});

/* profile.ejs */
app.get("/profile/:username", function(req, res){
    res.render("profile");
});

/* edit-profile.ejs */

/* bookmarks.ejs */

/* view-post.ejs */

/* create-post.ejs */

/* edit-post.ejs */

//Listener
app.listen(3000, function() {
    console.log("Server started on port 3000.");
});