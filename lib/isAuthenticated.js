// Checks if user is logged in, if not, redirect to login page
module.exports = function(req, res, next) {
    if (req.user) {
      return next();
    }
    return res.redirect("/");
  };
  