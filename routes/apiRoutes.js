var db = require("../models");
var passport = require("../lib/passport");
var axios = require("axios");
var cheerio = require("cheerio");
var isAuthenticated = require("../lib/isAuthenticated");
var User = require("../models/User.js");

module.exports = function (app) {

    app.post("/api/register", function (req, res) {
        var user = new User(req.body);
        user.setFullName();
        user.lastUpdatedDate();
        db.User.create(user)
            .then(function () {
                res.redirect(307, "/api/login");
            })
            .catch(function (err) {
                console.log(err);
            });
    });

    app.post("/api/login", passport.authenticate("local", {
        failureRedirect: "/",
        failureFlash: "true"
    }), function (req, res) {
        res.json("/");
    });

    app.get("/api/logout", function (req, res) {
        req.session.destroy(function (err) {
            res.redirect('/'); //Inside a callback… bulletproof!
        });
    });

    app.get("/api/scrape", function (req, res) {
        db.Article.deleteMany({}, function (err, deleted) {
            if (err) {
                console.log(err);
            } else {
                console.log(deleted);
            }
        }).then(function () {
            axios.get("https://thehill.com/").then(function (response) {
                var $ = cheerio.load(response.data);
                // console.log(response.data);
                $("ul.more_headlines > li").each(function (i, element) {
                    console.log(element);
                    var article = {};
                    article.title = $(element).find("a").text();
                    article.link = $(element).find("a").attr("href");
                    if (article.title && article.link) {
                        db.Article.create(article, function (err, inserted) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(inserted);
                            }
                        });
                    }
                });
            }).catch(function (err) {
                if (err) {
                    console.log(err);
                }
            }).finally(function () {
                res.redirect(307, "/");
            });
        });
    });

    app.get("/api/clear", function (req, res) {
        db.Article.deleteMany({}, function (err, deleted) {
            if (err) {
                console.log(err);
            } else {
                console.log(deleted);
            }
        });
        res.redirect(307, "/");
    });

    app.get("/api/save-article/:id", isAuthenticated, function (req, res) {
        db.Article.find({ _id: req.params.id }).then(function (result) {
            var article = {
                title: result[0].title,
                link: result[0].link,
                userId: req.user._id
            }
            db.SavedArticle.create(article).then(function () {
                res.redirect(307, "/saved-articles");
            });
        }).catch(function (err) {
            if (err) {
                console.log(err);
            }
        });
    });

    app.delete("/api/delete-saved-article/:id", isAuthenticated, function (req, res) {
        db.SavedArticle.deleteOne({ _id: req.params.id }, function (err, deleted) {
            if (err) {
                console.log(err);
            } else {
                res.json("saved-articles");
            }
        });
    });

    app.get("/api/save-forum-article/:id", isAuthenticated, function (req, res) {
        db.Article.find({ _id: req.params.id }).then(function (result) {
            var article = {
                title: result[0].title,
                link: result[0].link,
                userId: req.user._id
            }
            db.ForumArticle.create(article).then(function () {
                res.redirect(307, "/saved-articles");
            });
        }).catch(function (err) {
            console.log(err);
        });
    });

    app.post("/api/post-comment/:id", isAuthenticated, function (req, res) {
        db.Comment.create({...req.body, userId: req.user._id, username: req.user.username, fullName: req.user.fullName, forumArticle: req.params.id}).then(function (dbComment) {
            db.User.findOneAndUpdate({ _id: req.user._id }, { $push: { comments: dbComment._id } }).catch(function (err) {
                console.log(err);
            });
            db.ForumArticle.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: dbComment._id } }).catch(function (err) {
                console.log(err);
            });
        }).then(function () {
            res.json("/forum-articles");
        }).catch(function (err) {
            console.log(err);
        });
    });

    app.delete("/api/delete-comment/:id", isAuthenticated, function(req, res) {
        db.Comment.findById(req.params.id).then(function(dbComment) {
            if(dbComment.userId == req.user._id) {
                dbComment.deleteOne();
                res.json("/forum-articles");
            } else {
                res.json("/forum-articles");
            }
        }).catch(function(err) {
            console.log(err);
        });
    });

    app.delete("/api/delete-forum-article/:id", isAuthenticated, function(req, res) {
        db.ForumArticle.deleteOne({_id: req.params.id}).then(function(deleted) {
            res.json("/forum-articles");
        }).catch(function(err) {
            console.log(err);
        });
    });
};
