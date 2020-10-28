// Requiring necessary npm packages
// in this case it is express and express-sessions
//express: is a webbased server framework which enables us to better pass informations through api requests
var express = require("express");
//express-session: assigned a unique session and allows the storing of user data
var session = require("express-session");
// Requiring passport as we've configured it
// grabs passport info from another file and runs the code
var passport = require("./config/passport");

// Setting up port and requiring models for syncing
//The process object is a global that provides information about, 
//and control over, the current Node.js process.
//in this case it will use the environment variable PORT or port 8080
//this is for if we deploy this application on something like heroku
var PORT = process.env.PORT || 8080;
// requres and grabs the models files which is index.js and user.js files
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
// allows objects to be encoded into the url 
app.use(express.urlencoded({ extended: true }));
// parses incoming requests with JSON
app.use(express.json());
//The root argument specifies the root directory
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
// allows foe the password to be secret 
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
// initializes passport 
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
