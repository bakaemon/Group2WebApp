const models = require("../models");
const Role = models.role;
const User = models.user;
const Course = models.course;
const CC = models.courseCategory;
const { ObjectId } = require("../libraries").mongoose.Types;
const { faker } = require("../libraries")

exports.getUserApi = async (req, res) => {
  switch (req.query.id) {
    case "user":
      var data;
      if (!req.query.refby) data = await User.find({}, { password: 0 }).select("-__v");
      else {
        var role_id = await Role.findOne({ name: req.query.refby }).distinct('_id');
        data = await User.find({ role: ObjectId(role_id[0]) }, { password: 0 }).select("-__v");
      }
      var json = {
        data: data
      }
      res.end(JSON.stringify(json));
      break;
    case "course":
      res.end(JSON.stringify({ data: await Course.find({}).select("-__v") }));
      break;
    case "cc":
      res.end(JSON.stringify({ data: await CC.find({}).select("-__v") }));
      break;
  }
}
exports.getFakeInfo = async (req, res) => {
  var helpers = faker.helpers;
  if (req.query.list == "true") res.json(Object.keys(helpers))
  try {
    if (req.query.k) {
      if (helpers.hasOwnProperty(req.query.k)) res.json(faker.helpers[req.query.k]());
      else res.json({ errorMessage: "Function did not existed." });
    }
  } catch (e) {
    res.send(e);
  }
}