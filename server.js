require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");
var passport = require("passport");
var db = require("./models");
var flash = require("flash");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
  require("express-session")({
    secret: process.env.SECRET_STRING,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: require("handlebars-helpers")()
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);



app.listen(PORT, function () {
  console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
});

module.exports = app;
