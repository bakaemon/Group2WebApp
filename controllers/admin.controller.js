const tools = require("../tools")
const sortBy = tools.sortBy;
const model = require("../models");
const User = model.user;
const Role = model.role;
const { ObjectId } = require("../libraries").mongoose.Types;
/* POST methods*/
exports.addUser = async (req, res) => {
  let roles = await Role.find({});
  var notice = (msg) => {
    res.render("admin/addUser", {
      title: "Add user",
      message: msg,
      role: roles,
      user: req.session.User,
    })
  };
  if (roles.length == 0) notice("Can't not retrieve roles from database.");
  try {
    const username = req.body.username;
    const email = req.body.email;
    const fullName = req.body.fullname;
    const password = req.body.password;
    const dob = req.body.dob;
    const education = req.body.education;
    const lang = req.body.lang;
    const score = req.body.score;
    let role = req.body.role;
    const check = await Role.findOne({ name: role });
    if (!check) {
      return notice(`Role ${req.body.role} does not existed.`)
    }

    if (await User.findOne({ $or: [{ username: username }, { email: email }] })) return notice("User has already existed.");
    const user = {
      username: username,
      fullName: fullName,
      email: email,
      password: password,
      bio: {
        DoB: dob,
        Education: education,
        Lang: lang,
        Score: score
      },
      role: check._id,

    };
    await User.create(user, (err) => {
      if (!err) return notice("User added successfully.");
    });

  } catch (e) {
    console.log(e);
    notice("An error occurred while signing up.");
  }
}
exports.editUser = async (req, res) => {
  var user_id = req.query.id;
  var newValues = {
    $set: {
      username: req.body.username,
      fullName: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      bio: {
        DoB: req.body.dob,
        Education: req.body.education,
        Lang: req.body.lang,
        Score: req.body.score
      },
      role: ObjectId(req.body.role)
    }
  }
  await User.updateOne({ _id: ObjectId(user_id) }, newValues, async (err, result) => {
    var message, roles = await Role.find({});
    if (err) message = err;
    else {
      if (result.nModified < 1) message = "User has not been edited.";
      else message = "User has been edited.";
    }
    var user = await User.findOne({ _id: ObjectId(user_id) }).populate({ path: "role", model: "Role" });
    res.render("admin/editUser", { title: "Edit user", message: message, user_data: user, role: roles, user: req.session.User });
  })
}

/* GET methods */
exports.getUsers = async (req, res) => {
  const page = req.query.page || 1; // Page 
  try {
    const searchQuery = req.query.search_query;
    var regexQuery = { "$regex": searchQuery, "$options": "i" }
    const resPerPage = 5; // results per page
    let users, numOfUsers = 0, pages = [];
    if (!searchQuery) {
      users = await User.find();
      numOfUsers = users.length;
      users = await User.find({})
        .populate({ path: "role", model: "Role", select: "-__v" })
        .skip((resPerPage * page) - resPerPage)
        .limit(resPerPage);
    } else {
      const query = { $or: [{ email: regexQuery }, { fullName: regexQuery }, { username: regexQuery }] }
      users = await User.find(query)
      numOfUsers = users.length;
      users = await User.find(query)
        .populate({ path: "role", model: "Role", select: "-__v" })
        .skip((resPerPage * page) - resPerPage)
        .limit(resPerPage);
    }
    for (var i = 1; i <= Math.ceil(numOfUsers / resPerPage); i++) pages.push(i);
    res.render("admin/getUsers", {
      title: "User control panel",
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
    await User.deleteOne({ _id: ObjectId(user_id) }, (err) => {
      if (err) {
        res.write("<script>alert('Can not delete user " + user_id + ".'); </script>");
        res.end();
      }
      res.redirect("back");
    });
  }
  catch (e) { console.log(e); }
}
exports.getAddUser = async (req, res) => {
  let roles = await Role.find({});
  if (roles.length == 0) res.send("Can't not retrieve roles from database.");
  res.render("admin/addUser", { title: "Add user", role: roles })
}
exports.getEditUser = async (req, res) => {
  var user_id = req.query.id;
  try {
    var user = await User.findOne({ _id: ObjectId(user_id) }).populate({ path: "role", model: "Role" });
    var roles = await Role.find({});
    if (!user) res.redirect("back");
    res.render("admin/editUser", { title: "Edit user", user_data: user, role: roles, user: req.session.User });
  }
  catch (e) { res.send(e) }
}

