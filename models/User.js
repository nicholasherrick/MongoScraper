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
    validate: [
      function(input) {
        return input.length >= 1;
      },
      "not long enough."
    ]
  },

  firstName: {
    type: String,
    trim: true,
    required: "First Name is Required",
    validate: [
      function(input) {
        return input.length >= 1;
      },
      "not long enough."
    ]
  },

  lastName: {
    type: String,
    trim: true,
    required: "Last Name is required",
    validate: [
      function(input) {
        return input.length >= 1;
      },
      "not long enough."
    ]
  },
  // `password` is required and of type String
  password: {
    type: String,
    required: true,
    validate: [
      function(input) {
        return input.length >= 6;
      },
      "Password not long enough."
    ]
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

UserSchema.pre("save", function(next) {
  let user = this;
  if(!user.isModified("password")) return next();

  bcrypt.genSalt(12, (err, salt) => {
      if(err) return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
          if(err) return next(err);
          user.password = hash;
          next();
      });
  });
});

UserSchema.methods.comparePassword = function(enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};


// This creates our model from the above schema, using mongoose's model method
var User = mongoose.model("User", UserSchema);

// Export the Article model
module.exports = User;
