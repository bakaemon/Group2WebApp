const db = require("../models"); // get template model for data handling from database, need further study
const User = db.User;

async function getAllUser(req, res) {
  try {
    const users = await User.find({}); //
    res.send({
      data: users, //send user's data to alias "data" once request call to this
    });

  } catch(e) {
    console.log(e);
    res.send({
      message: "An error occurred while getting all users."
    })
  }
}

module.exports = {
  getAllUser,
}
