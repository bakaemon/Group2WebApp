const model = require("../models");
const User = model.user;

exports.addUser = async (req, res) => {

}

exports.getUsers = async (req, res) => {
  try {
    const searchQuery = req.query.search_query;
    let users;
    if(!searchQuery) {
      users = await User.find({}).select("-__v")
        .populate({path: "role", model: "Role", select: "-__v"});
    } else {
      users = await User.find({$or: [{email: searchQuery},{fullName: searchQuery},{username: searchQuery}]})
        .populate({path: "role", model: "Role", select: "-__v"});
    }

    res.render("admin/getUsers", {
      users: users
    });
  } catch (e) {
    console.log(e);
    res.send({
      message: "Error"
    })
  }
}
