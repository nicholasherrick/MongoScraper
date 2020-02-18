var mongoose = require("mongoose");
var User = require("./User");
var Comment = require("./Comment");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ForumArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true,
    unique: true
  },

  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },

  imageLink: {
    type: String,
    required: false
  },

  summary : {
    type: String,
    required: false
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// ForumArticleSchema.pre("deleteOne", {document: true}, function(next) {
//   Comment.findByIdAndUpdate(this.userId,
//     {$pull: {comments: this._id}}
//   ).catch(function(err) {
//     console.log(err);
//   });
//   User.findByIdAndUpdate(this.userId,
//     {$pull: {comments: this._id}},
//   ).catch(function(err) {
//     console.log(err);
//   });
//   next();
// });

// This creates our model from the above schema, using mongoose's model method
var ForumArticle = mongoose.model("ForumArticle", ForumArticleSchema);

// Export the Article model
module.exports = ForumArticle;
