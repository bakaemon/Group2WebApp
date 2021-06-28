const { mongoose } = require("../libraries")

const UserSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  email: String,
  password: String,
  bio: {
    DoB: String, //date of birth
    Education: String,
    Lang: String, //main programming language
    Score: String //TOEIC score
  },
  // reference to Role collection
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role"
  },
  scholarship: {
    active: Boolean,
    total: Number
  }
});

const User = mongoose.model(
  "User",
  UserSchema
);

module.exports = User;
