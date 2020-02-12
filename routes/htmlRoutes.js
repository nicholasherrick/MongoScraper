var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("index", {
      msg: "Welcome!",
    });
  });

  app.get("/saved-articles", function(req, res) {
    res.render("saved-articles");
  });

  app.get("/forum-articles", function(req, res) {
    res.render("forum-articles");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
