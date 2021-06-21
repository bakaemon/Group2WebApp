const models = require("../models"); // get template model for data handling from database, need further study
const User = models.user;
const Role = models.role;
const Course = models.course;
// const { bcrypt } = require("../libraries")

exports.signup = async (req, res) => {
  const courses = await Course.find({});
  var notice = (msg) => {
    res.render("auth/signup", {
      title: "Sign up",
      course: courses,
      message: msg,
      user: req.session.User
    });
  };
  try {
    const username = req.body.username;
    const email = req.body.email;
    const fullName = `${req.body.first_name} ${req.body.last_name}`;
    const password = req.body.password;
    const dob = req.body.dob;
    const education = req.body.education;
    const lang = req.body.lang;
    const score = req.body.score;
    const role = await Role.findOne({ name: "trainee" });
    if (!role) return notice(`Role ${req.body.role} does not existed.`)

    if (password !== req.body.confirm_password) return notice("Password and confirm password are not matched.");

    if (await User.findOne({ username: username })) return notice("User has already existed.");
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
      role: role._id,

    };
    await User.create(user);

    notice("Sign up successfully.")
  } catch (e) {
    console.log(e);
    notice("An error occurred while signing up");
  }
}

exports.login = async (req, res) => {
  if (req.session.User) return redirect("/");
  var notice = (msg) => {
    res.render("auth/login", {
      title: "Login",
      message: msg
    });
  }
  try {
    const loginValue = req.body.login_value;
    const password = req.body.password;

    const user = await User.findOne({ $or: [{ username: loginValue }, { email: loginValue }] })
      .populate({ path: "role", model: "Role", select: "-__v" });

    if (!user) {
      return notice("Username or email doesn't exist.");
    }

    if (user.password !== password) {
      return notice("Incorrect password.");
    }
    // Store session first before redirect.
    req.session.User = {
      username: user.username,
      fullname: user.fullName,
      role: user.role.name
    };
    
    if (req.body.remember) req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000; //expires after a year
    else req.session.cookie.expires = false; //expire after closing browser
    res.redirect("/");
  } catch (e) {
    console.log(e);
    notice("An error occurred while login.");
  }
}
exports.logout = (req, res) => {
  const userSession = req.session.User
  if (userSession) {
    req.session.destroy(); //logout and go back to login page
  }
  res.redirect("/auth/login");
}
exports.getSignup = (req, res) => {
  res.render("auth/signup", { title: "Sign up", user: req.session.User });
}

exports.getLogin = (req, res) => {
  res.render("auth/login", { title: "Login", user: req.session.User });
}
