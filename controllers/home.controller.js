const User = require("../models").user;
const Role = require("../models").role;
const Course = require("../models").course
const CC = require("../models").courseCategory

exports.home = async (req, res) => {
  let numsOfUsers;

  let trainee_id = (await Role.findOne({name: "trainee"}, "_id"))._id;
  let trainer_id = (await Role.findOne({name: "trainer"}, "_id"))._id;
  let nTrainee = await User.countDocuments({role: trainee_id});
  let nTrainer = await User.countDocuments({role: trainer_id});
  if (req.session.User && req.session.User.role === "admin") numsOfUsers = await User.countDocuments();
  if (req.session.User && req.session.User.role === "staff") numsOfUsers = nTrainee + nTrainer
  let users = await User.find({role: trainee_id})
    .sort({"bio.Score": -1})
    .limit(5);
  let numsOfCourse = await Course.countDocuments();
  let numsOfCategory = await CC.countDocuments();
  res.render("index", {
    title: "FPT CMS",
    numsOfUsers: numsOfUsers,
    numsOfCourse: numsOfCourse,
    numsOfCategory: numsOfCategory,
    nTrainer: nTrainer,
    nTrainee: nTrainee,
    user_data: users,
    user: req.session.User
  });
}
exports.notfound = (req, res) => {
  res.render("404", {title: "Not found!", user: req.session.User, layout: "layouts/auth"});
}