const models = require("../models"); // get template model for data handling from database, need further study
const User = models.user;
const Role = models.role;
const { bcrypt } = require("../libraries")

exports.signup = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const fullName = `${req.body.first_name} ${req.body.last_name}`;
    const password = req.body.password;
    let role = "trainee";
    const check = await Role.findOne({ name: "trainee" });
    if (!check) {
      return res.render('./', {
        message: `Role ${req.body.role} does not existed.`
      });
    }

    if (password !== req.body.confirm_password) {
      return res.render("auth/signup", {
        message: "Password and confirm password are not matched."
      })
    }

    if (await User.findOne({ username: username })) return res.render("auth/signup", { message: "User has already existed." });
    const user = {
      username: username,
      fullName: fullName,
      email: email,
      password: password,
      role: check._id
    };
    console.log(user);
    await User.create(user);

    res.render("auth/signup", {
      message: "Sign up successfully."
    });
  } catch (e) {
    console.log(e);
    res.render("auth/signup", {
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
        message: "User not found."
      });
    }

    if (user.password !== password) {
      return res.send({
        message: "Password is incorrect."
      });
    }

    // Store session first be for redirect.
    req.session.User = {
      username: user.username,
      role: user.role.name
    };
    res.redirect("/?success=true");
  } catch (e) {
    console.log(e);
    res.render("auth/login", {
      message: "An error occurred while login."
    })
  }
}
exports.logout = (req, res) => {
  const userSession = req.session.User
  if (userSession) {
    userSession.destroy(() => {
    }); //logout and go back to login page
  }
  res.redirect("/auth/login");
}
exports.getSignup = (req, res) => {
  res.render("auth/signup");
}

exports.getLogin = (req, res) => {
  res.render("auth/login");
}
