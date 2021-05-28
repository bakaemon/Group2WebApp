const { mongoose } = require("../libraries")

const UserSchema = new mongoose.Schema({ //?
  username: String,
  fullName: String,
  email: String,
  password: String,
  // reference to Role collection
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role" //need further study
  }
});

const User = mongoose.model(
  "User",
  UserSchema
);

module.exports = User;
