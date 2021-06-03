const model = require("../models");
const User = model.user;
const {ObjectId} = require("../libraries").mongoose.Types;

exports.addUser = async (req, res) => {

}

exports.getUsers = async (req, res) => {
  const page = req.params.page || 1; // Page 
  try {
    const searchQuery = req.query.search_query;
    const resPerPage = 5; // results per page
    let users, numOfUsers = 0, pages = [];
    if (!searchQuery) {
      users = await User.find({})
        .populate({ path: "role", model: "Role", select: "__v" })
        .skip((resPerPage * page) - resPerPage)
        .limit(resPerPage);
      numOfUsers = users.length;
    } else {
      const query = { $or: [{ email: searchQuery }, { fullName: searchQuery }, { username: searchQuery }] }
      users = await User.find(query)
        .populate({ path: "role", model: "Role", select: "__v" })
        .skip((resPerPage * page) - resPerPage)
        .limit(resPerPage);
      numOfUsers = users.length;
    }

    for (var i = 1; i <= Math.ceil(numOfUsers / resPerPage); i++) pages.push(i);

    res.render("admin/getUsers", {
      user: req.session.User,
      users_data: users,
      page: page,
      numOfUsers: numOfUsers,
      pages: pages,
      pagelength: Math.ceil(numOfUsers / resPerPage)
    });
  } catch (e) {
    console.log(e);
    res.send({
      message: "Error"
    })
  }
}

exports.deleteUser = async (req, res) => {
  var user_id = req.query.id;
  try {
    await User.deleteOne({_id: ObjectId(user_id)}, (err)=> {
      if (err) {
        res.write("<script>alert('Can not delete user " + user_id + ".'); </script>");
        res.end();
      }
      res.redirect("back");
    });
  }
  catch (e) { console.log(e); }
}