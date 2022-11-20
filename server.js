//Packages express and body-parser declaration
const express = require("express");
const bodyParser = require("body-parser");

//App
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

//URL Routing

/* index.ejs */
app.get("/", function(req, res){
    res.render("index");
});

/* login.ejs */

/* register.ejs */

/* profile.ejs */

/* edit-profile.ejs */

/* bookmarks.ejs */

/* view-post.ejs */

/* create-post.ejs */

/* edit-post.ejs */

//Listener
app.listen(3000, function() {
    console.log("Server started on port 3000.");
});