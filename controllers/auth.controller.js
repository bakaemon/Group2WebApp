const models = require("../models"); // get template model for data handling from database, need further study
const User = models.user;
const Role = models.role;
const { bcrypt } = require("../libraries")

exports.signup = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const fullName = req.body.full_name;
    const password = req.body.password;
    const role = await Role.find({ name: req.body.role });
    if (!role) {
      return res.send({
        message: `Role ${req.body.role} does not existed.`
      });
    }

    if (await User.findOne({ username: username })) return res.send({ message: "User has already existed." });
    const user = {
      username: username,
      fullName: fullName,
      email: email,
      password: password,
      role: role._id
    };
    await User.create(user);

    res.send({
      message: "Sign up successfully."
    });
  } catch (e) {
    console.log(e);
    res.send({
      message: "An error occurred while signing up"
    })
  }
}

exports.login = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ $or: [{ username: username }, { email: email }] });

    if (!user) {
      return res.send({
        message: "User not found."
      });
    }

    if (user.password !== password) {
      return res.send({
        message: "Password is incorrect."
      });
    }

    // Store session first be for redirect.
    req.session.User = username;
    res.redirect("/?success=true");
  } catch (e) {
    console.log(e);
    res.send({
      message: "An error occurred while login."
    })
  }
}
exports.logout = (req, res) => {
  res.session["User"].destroy(() => { res.redirect("/auth/login"); }); //logout and go back to login page
}
exports.getSignup = (req, res) => {
  res.render("auth/signup");
}

exports.getLogin = (req, res) => {
  res.render("auth/login");
}
