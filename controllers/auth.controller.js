const db = require("../models")
const User = db.User

async function getAllUser(req, res) {
  try {
    const users = await User.find({});
    res.send({
      data: users
    });

  } catch(e) {
    console.log(e);
    res.send({
      message: "An error occurred while getting all users."
    })
  }
}

module.exports.auth = {
  getAllUser,
}
