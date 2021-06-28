const tools = require("../tools")
const validate = tools.validateInput;
const model = require("../models");
const User = model.user;
const Role = model.role;
const {ObjectId} = require("../libraries").mongoose.Types;
/* POST methods*/
exports.addUser = async (req, res) => {
  let roles = await Role.find({});
  var notice = (msg, holder) => {
    res.render("admin/addUser", {
      title: "Add user",
      message: msg,
      holder: holder,
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
    let roles = await Role.find({});
    if (roles.length == 0) res.send("Can't not retrieve roles from database.");
    const check = await Role.findOne({name: role});
    if (!check) {
      return notice(`Role ${req.body.role} does not existed.`)
    }

    let holder = {
      username: username,
      fullName: fullName,
      email: email,
      password: password,
      dob: dob,
      education: education,
      lang: lang,
      score: score,
      role: role
    }

    if (!validate("username", username)) {
      return notice("Username must not contain special key.", holder);
    }

    if (!validate("password", password)) {
      return notice("Password's length must greater than 8.", holder);
    }

    if (req.body.fullName && !validate("unicode", fullName)) { //&& !validate("unicode", education) && !validate("unicode", lang)) {
      return notice("Full name is not in correct format.", holder);
    }

    if (await User.findOne({$or: [{username: username}, {email: email}]})) return notice("User has already existed.", holder);
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
  try {
    var user_id = req.query.id;

    var notice = async (msg, user, roles) => {
      res.render("admin/editUser", {
        title: "Add user",
        message: msg,
        role: roles,
        user_data: user,
        user: req.session.User,
      })
    };

    var user = await User.findOne({_id: ObjectId(user_id)}).populate({path: "role", model: "Role"});
    var roles = await Role.find({});

    if (!validate("username", req.body.username)) {
      return notice("Username must not contain special key.", user, roles);
    }

    if (!validate("password", req.body.password)) {

      return notice("Password's length must greater than 8.", user, roles);
    }

    if (req.body.fullName && !validate("unicode", req.body.fullName)) {
      return notice("Full name is not in correct format.", user, roles);
    }

    var newValues = {
      $set: {
        username: req.body.username,
        fullName: req.body.fullName,
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
    await User.updateOne({_id: ObjectId(user_id)}, newValues);
    // if (result.nModified < 1) return notice("User has not been edited.", user, roles);

    user = await User.findOne({_id: ObjectId(user_id)}).populate({path: "role", model: "Role"});
    await notice("User has been edited successfully.", user, roles);

  } catch (e) {
    console.log(e)
    res.render("admin/editUser", {
      title: "Edit user",
      user_data: user,
      role: roles,
      user: req.session.User
    });
  }
}
exports.giveScholarship = async (req, res) => {
  var respond = (message, data = {}, isError = true,) => {
    res.json({ status: isError, message: message, data: data })
  }
  var user = await User.findOne({ _id: req.body.id });
  if (!user) return respond("No user found.");
  var users = await User.find().sort({ "bio.Score": -1 });
  if (-1 > users.indexOf(user) > 2) return respond("User didn't meet criteria to get scholarship");
  await User.updateOne(user, {
    scholarship: {
      active: req.body.active,
      total: req.body.total
    }
  }, { multi: true }).then((result, err) => {
    if (result.nModified !== 0)
      return respond("Set " + user.username + "'s scholarship to active, total value of $" + req.body.total, result, false);
    respond("The trainee " + user.name + " already had scholarship!");
  }).catch(e => { respond(e); console.log(e) });
}
/* GET methods */
exports.getUsers = async (req, res) => {
  const page = req.query.page || 1; // Page 
  try {
    const searchQuery = req.query.search_query;
    var regexQuery = {"$regex": searchQuery, "$options": "i"}
    const resPerPage = 5; // results per page
    let users, numOfUsers = 0, pages = [];
    if (!searchQuery) {
      users = await User.find();
      numOfUsers = users.length;
      users = await User.find({})
        .sort({username: 1})
        .populate({path: "role", model: "Role", select: "-__v"})
        .skip((resPerPage * page) - resPerPage)
        .limit(resPerPage);
    } else {
      const query = {$or: [{email: regexQuery}, {fullName: regexQuery}, {username: regexQuery}]}
      users = await User.find(query)
      numOfUsers = users.length;
      users = await User.find(query)
        .sort({username: 1})
        .populate({path: "role", model: "Role", select: "-__v"})
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
    await User.deleteOne({_id: ObjectId(user_id)}, (err) => {
      if (err) {
        res.write("<script>alert('Can not delete user " + user_id + ".'); </script>");
        res.end();
      }
      res.redirect("back");
    });
  } catch (e) {
    console.log(e);
  }
}
exports.getAddUser = async (req, res) => {
  let roles = await Role.find({});
  if (roles.length == 0) res.send("Can't not retrieve roles from database.");
  res.render("admin/addUser", {title: "Add user", role: roles})
}
exports.getEditUser = async (req, res) => {
  var user_id = req.query.id;
  try {
    var user = await User.findOne({_id: ObjectId(user_id)}).populate({path: "role", model: "Role"});
    var roles = await Role.find({});
    if (!user) res.redirect("back");
    res.render("admin/editUser", {title: "Edit user", user_data: user, role: roles, user: req.session.User});
  } catch (e) {
    res.send(e)
  }
}
exports.getLogs = (req, res) => {
  res.render("admin/logOutput", { title: "Activity Logs", user: req.session.User });
}

