const models = require("../models");
const User = models.user;

exports.getAllUser = async (req, res)  => {
  try {
    const users = await User.find({}); //
    res.send({
      data: users, //send user's data to alias "data" once request call to this
    });

  } catch (e) {
    console.log(e);
    res.send({
      message: "An error occurred while getting all users."
    })
  }
}