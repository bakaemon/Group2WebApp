const { mongoose } = require("../libraries")

const UserSchema = new mongoose.Schema({ //?
  username: String,
  email: String,
  password: String,
  // reference to Role collection
  roles: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role"
  }
});

const User = mongoose.model(
  "User",
  UserSchema
);

module.exports = User;
