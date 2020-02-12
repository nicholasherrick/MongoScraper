var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
  },
  // `username` is required and of type String
  username: {
    type: String,
    required: "Username is Required",
    trim: true,
    unique: true,
    minlength: (1, "Not long enough")
  },

  firstName: {
    type: String,
    trim: true,
    required: "First Name is Required",
    minlength: (1, "Not long enough")
  },

  lastName: {
    type: String,
    trim: true,
    required: "Last Name is required",
    minlength: (1, "Not long enough")
  },
  // `password` is required and of type String
  password: {
    type: String,
    required: true,
    minlength: (6, "Not long enough")
  },
 
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],

  savedArticles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Article"
    }
  ],

  userCreated: {
    type: Date,
    default: Date.now
  },

  lastUpdated: Date,

  fullName: String
});

UserSchema.methods.setFullName = function() {
  this.fullName = this.firstName + " " + this.lastName;
  return this.fullName;
};

UserSchema.methods.lastUpdatedDate = function() {
  this.lastUpdated = Date.now();
  return this.lastUpdated;
};


// This creates our model from the above schema, using mongoose's model method
var User = mongoose.model("User", UserSchema);

// Export the Article model
module.exports = User;
