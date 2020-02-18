var mongoose = require("mongoose");
var User = require("./User");
var ForumArticle = require("./ForumArticle");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new CommentSchema object
// This is similar to a Sequelize model
var CommentSchema = new Schema({
  // `username` is of type String
  username: {
    type: Schema.Types.String,
    ref: "User",
    required: true
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  fullName: {
    type: Schema.Types.String,
    ref: "User",
    required: true
  },

  forumArticle: {
    type: Schema.Types.ObjectId,
    ref: "ForumArticle",
    required: true
  },
  // `body` is of type String
  body: {
    type: String,
    required: "Comment cannot be empty",
    minlength: [1, "Comment cannot be empty"],
    trim: true
  }
});

CommentSchema.pre("deleteOne", {document: true}, function(next) {
  User.findByIdAndUpdate(this.userId,
    {$pull: {comments: this._id}}
  ).catch(function(err) {
    console.log(err);
  });
  ForumArticle.findByIdAndUpdate(this.forumArticle,
    {$pull: {comments: this._id}},
  ).catch(function(err) {
    console.log(err);
  });
  next();
});
// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;
