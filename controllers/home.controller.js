const User = require("../models").user;
const Role = require("../models").role;
const Course = require("../models").course
const CC = require("../models").courseCategory
exports.home = async (req, res) => {
    let numsOfUsers = await User.countDocuments();
    let trainee_id = (await Role.findOne({ name: "trainee" }, "_id"))._id;
    let users = await User.find({ role: trainee_id })
    .sort({ "bio.Score": -1})
    .limit(5);
    let numsOfCourse = await Course.countDocuments();
    let numsOfCategory = await CC.countDocuments();
    res.render("index", {
        title: "FPT CMS",
        numsOfUsers: numsOfUsers,
        numsOfCourse: numsOfCourse,
        numsOfCategory: numsOfCategory,
        user_data: users,
        user: req.session.User
    });
}
exports.notfound = (req, res) => {
    res.render("404", { title: "Not found!", user: req.session.User, layout: "layouts/auth" });
}