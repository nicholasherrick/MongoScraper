var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new CommentSchema object
// This is similar to a Sequelize model
var CommentSchema = new Schema({
  // `username` is of type String
  username: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  article: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  },
  // `body` is of type String
  body: {
    type: String,
    required: "Comment cannot be empty",
    minlength: [1, "Comment cannot be empty"],
    trim: true
  }
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Note", CommentSchema);

// Export the Note model
module.exports = Comment;
