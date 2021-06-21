const models = require("../models");
const User = models.user;
const Course = models.course;
const CC = models.courseCategory;

exports.getapi = async (req, res) => {
  switch (req.query.id) {
    case "user":
      var json = {
        data: await User.find({}, {password: 0}).select("-__v")
      }
      res.end(JSON.stringify(json));
      break;
    case "course":
      res.end(JSON.stringify({ data: await Course.find({}).select("-__v")}));
      break;
    case "cc":
      res.end(JSON.stringify({ data: await CC.find({}).select("-__v")}));
      break;
  }
}