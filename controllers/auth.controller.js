const models = require("../models"); // get template model for data handling from database, need further study
const User = models.user;
const Role = models.role;
const Course = models.course;
const { bcrypt } = require("../libraries")

exports.signup = async (req, res) => {
  const courses = await Course.find({});
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
    if (!role) {
      return res.render('./', {
        course: courses,
        message: `Role ${req.body.role} does not existed.`
      });
    }

    if (password !== req.body.confirm_password) {
      return res.render("auth/signup", {
        course: courses,
        message: "Password and confirm password are not matched."
      })
    }

    if (await User.findOne({ username: username })) return res.render("auth/signup", { message: "User has already existed." });
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

    res.render("auth/signup", {
      course: courses,
      message: "Sign up successfully."
    });
  } catch (e) {
    console.log(e);
    res.render("auth/signup", {
      course: courses,
      message: "An error occurred while signing up"
    })
  }
}

exports.login = async (req, res) => {
  try {
    const loginValue = req.body.login_value;
    const password = req.body.password;

    const user = await User.findOne({ $or: [{ username: loginValue }, { email: loginValue }] })
      .populate({ path: "role", model: "Role", select: "-__v" });

    if (!user) {
      return res.render("auth/login", {
        message: "Username or email doesn't exist."
      });
    }

    if (user.password !== password) {
      return res.render("auth/login", {
        message: "Incorrect password."
      });
    }

    // Store session first be for redirect.
    req.session.User = {
      username: user.username,
      fullname: user.fullName,
      role: user.role.name
    };
    if (req.body.remember) req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000; //expires after a year
    else req.session.cookie.expires = false; //expire after closing browser
    res.redirect("/?success=true");
  } catch (e) {
    console.log(e);
    res.render("auth/login", {
      message: "An error occurred while login."
    });
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
  res.render("auth/signup", {title: "Sign up"});
}

exports.getLogin = (req, res) => {
  res.render("auth/login", {title: "Login"});
}
