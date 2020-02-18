var db = require("../models");
var isAuthenticated = require("../lib/isAuthenticated");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    db.Article.find({}).lean().then(function(result) {
      res.render("index", {article: result, user: req.user});
    }).catch(function(err){
      console.log(err);
    });
  });

  app.get("/saved-articles", isAuthenticated, function (req, res) {
    db.SavedArticle.find({userId: req.user._id}).lean().then(function(result) {
      res.render("saved-articles", {savedArticle: result, user: req.user});
    }).catch(function(err){
      console.log(err);
    });
  });

  app.get("/forum-articles", isAuthenticated, function (req, res) {
    db.ForumArticle.find({}).populate("comments").lean().then(function(result) {
      res.render("forum-articles", {forumArticle: result, user: req.user});
    }).catch(function(err){
      console.log(err);
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404", {user: req.user});
  });
};
