const User = require("../models").user
const Course = require("../models").course
const CC = require("../models").courseCategory
exports.home = async (req, res) => {
    let numsOfUsers = await User.countDocuments();
    let users = await User.find({}).limit(5);
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
    res.render("404", { title: "Not found!" });
}