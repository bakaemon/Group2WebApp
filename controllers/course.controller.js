const models = require("../models")
const Course = models.course;
const User = models.user;
const Slot = models.slot;
const CourseCategory = models.courseCategory;
const validate = require("../tools").validateInput;
const { getDate } = require("../tools")
const { ObjectId } = require("../libraries").mongoose.Types;
//GET methods
exports.getCourses = async (req, res) => {
  const page = req.params.page || 1;
  try {
    var regexQuery = { "$regex": req.query.s, "$options": "i" };
    const resPerPage = 5;
    let items, numOfItems = 0, pages = [];
    if (!req.query.s) {
      items = await Course.find({});
      numOfItems = items.length;
      items = await Course.find({})
        .sort({ name: 1 })
        .populate({ path: "category", models: "CourseCategory", select: "-__v" })
        .skip((resPerPage * page) - resPerPage)
        .limit(resPerPage);

    } else {
      items = await Course.find({ name: regexQuery });
      numOfItems = items.length;
      items = await Course.find({ name: regexQuery })
        .sort({ name: 1 })
        .populate({ path: "category", models: "CourseCategory", select: "-__v" })
        .skip((resPerPage * page) - resPerPage)
        .limit(resPerPage);
    }
    for (var i = 1; i <= Math.ceil(numOfItems / resPerPage); i++) pages.push(i);
    res.render("admin/course/getCourses", {
      title: "Course control panel",
      user: req.session.User,
      courses: items,
      page: page,
      numOfItems: numOfItems,
      pages: pages,
      pagelength: Math.ceil(numOfItems / resPerPage)
    });

  } catch (e) {
    console.log(e);
  }
}
exports.getAddCourse = async (req, res) => {
  const category = await CourseCategory.find({});
  res.render("admin/course/addCourse", {
    title: "Add course",
    category: category,
    user: req.session.User,
  });
}
exports.getAddCategory = (req, res) => {
  res.render("admin/course/addCategory", {
    title: "Add Course Category",
    user: req.session.User,
  })
}
exports.getAddUserToCourse = async (req, res) => {
  try {
    var users = await User.find({});
    var courses = await Course.find({});
    res.render("admin/course/addUserToCourse", {
      title: "Add user to course",
      user_data: users,
      course: courses,
      user: req.session.User,
    })
  } catch (e) {
    console.log(e);
    res.end(500);
  }
}
exports.deleteCourse = async (req, res) => {
  if (!req.query.id) return res.redirect("back");
  try {
    await Course.deleteOne({ _id: req.query.id }, (err, result) => {
      if (err) {
        res.write("<script>alert('Unable to delete.'); window.history.back(); </script>");
        res.end();
      } else res.redirect("back");
    })
  } catch (e) {
    res.write("<script>alert('An error has orrcured'); window.history.back(); </script>");
    res.end();
  }
}
exports.getCategories = async (req, res) => {
  try {
    var data = await CourseCategory.find({});
    res.render("admin/course/getCategories", {
      title: "Category Control Panel",
      category: data,
      user: req.session.User
    });
  } catch (e) {
    console.log(e);
  }
}
exports.deleteCategory = async (req, res) => {
  if (!req.query.id) return res.redirect("back");
  try {
    await CourseCategory.deleteOne({ _id: req.query.id }, (err, result) => {
      if (err) {
        res.write("<script>alert('Unable to delete.'); window.history.back(); </script>");
        res.end();
      } else res.redirect("back");
    })
  } catch (e) {
    res.write("<script>alert('An error has orrcured'); window.history.back(); </script>");
    res.end();
  }
}
exports.getViewCourse = async (req, res) => {
  if (!req.query.id) res.redirect("back");
  try {
    // const resPerPage = 0;
    // var pages = [];
    // var page = req.query.page || 1;
    // var countItems = await Course.aggregate(
    //     [{
    //         $match: { _id: ObjectId(req.query.id) }
    //     },
    //     {
    //         $project: {
    //             members: { $size: "$members" }
    //         }
    //     }]
    // );
    // var numOfItems = countItems[0].members;
    var course = await Course.findOne({ _id: req.query.id })
      .populate({
        path: "members",
        models: "User",
        populate: {
          path: "role",
          models: "Role"
        },
        select: "-__v"
      })
    // .skip((resPerPage * page) - resPerPage)
    // .limit(resPerPage);
    // for (var i = 1; i <= Math.ceil(numOfItems / resPerPage); i++) pages.push(i);
    if (req.query.deluser) {
      await Course.updateOne({ _id: req.query.id },
        {
          $pull: { members: ObjectId(req.query.deluser) }
        }, (err, result) => {
          res.redirect("back");
        })
    }
    res.render("admin/course/viewCourse", {
      title: "View ",
      course: course,
      // numOfItems: numOfItems,
      // page: page,
      // pages: pages,
      // pagelength: Math.ceil(numOfItems / resPerPage),
      user: req.session.User
    });
  } catch (e) {
    console.log(e);
  }

}
exports.getEditCourse = async (req, res) => {
  if (!req.query.id) return res.redirect("back");
  try {
    var course = await Course.findOne({ _id: req.query.id })
      .populate({ path: "category", models: "CourseCategory" });
    var category = await CourseCategory.find({});
    res.render("admin/course/getEditCourse", {
      title: "Edit course " + course.name,
      course: course,
      category: category,
      user: req.session.User
    });
  } catch (e) {
    console.log(e);
  }
}
exports.getEditCategory = async (req, res) => {
  if (!req.query.id) return res.redirect("back");
  try {
    var category = await CourseCategory.findOne({ _id: req.query.id });
    res.render("admin/course/getEditCategory", {
      title: "Edit category " + category.name,
      category: category,
      user: req.session.User
    });
  } catch (e) {
    console.log(e);
  }
};
exports.viewSchedule = async (req, res) => {
  if (!req.query.course) res.redirect("back");
  var course = await Course.find({ _id: ObjectId(req.query.course) })
    .populate({ path: "members", model: "User" })
    .populate({ path: "schedules.time", models: "Slot" })
    .populate({ path: "schedules.trainer", models: "User" });
  var slots = await Slot.find({})
  var user = await User.find({ name: req.session.User.name })
  if (!["admin", "staff"].includes(req.session.User.role) || !course.members.includes(user)) res.redirect("back");

  res.render("admin/course/schedules/viewSchedule", {
    title: "View schedule of course " + course.name,
    schedules: course.schedules,
    slots: slots,
    user: req.session.User
  })
}
exports.getTrainerSchedules = async (req, res) => {
  if (!req.query.course) res.redirect("back");
  var course = await Course.find({ "schedules.trainer": req.session.User.username })
    .populate({ path: "members", model: "User" })
    .populate({ path: "schedules.time", models: "Slot" })
    .populate({ path: "schedules.trainer", models: "User" });
  var slots = await Slot.find({});
  var user = await User.find({ name: req.session.User.name });
  console.log(course);
  if (!["admin", "staff", "trainer"].includes(req.session.User.role) ||
    (!course.members.includes(user) || course.schedules.trainer !== user)) res.redirect("back");
  var schedules = course.schedules.filter(s => s.trainer == user);
  console.log(schedules);
  res.render("admin/course/schedules/viewSchedule", {
    title: "View schedule of course " + course.name,
    schedules: schedules,
    slots: slots,
    user: req.session.User
  })

}
exports.getAddSchedules = async (req, res) => {
  if (!req.query.course) return res.redirect("back");
  var course = await Course.findOne({name: req.query.course })
  if (!course) return res.redirect("back");
  var trainers = (await User.find()
    .populate({ path: "role", model: "Role" }))
    .filter(User => user.role.name == "trainer");
  var slots = await Slot.find();
  res.render("admin/course/schedules/addschedule", {
    title: "Add Schedule",
    trainers,
    slots: slots,
    user: req.session.User
  })
}
//POST method
exports.addCourse = async (req, res) => {
  const category = await CourseCategory.find({});
  const template = {
    name: req.body.name,
    description: req.body.description,
    category: ObjectId(req.body.category),
    members: []
  };
  var notice = (msg, holder) => {
    res.render("admin/course/addCourse", {
      title: "Add course",
      category: category,
      message: msg,
      holder: holder,
      user: req.session.User
    });
  }

  if (!validate("unicode", template.name)) {
    return notice("Invalid course name", template)
  }

  await Course.create(template, async (err) => {
    if (err) return notice("Unable to add course to database.", template);
    notice("Course added.");
    await Course.findOne({ name: req.body.name, description: req.body.description }, async (err, result) => {
      if (result) return notice("Duplicate courses!")
      await Course.create(template, (err) => {
        if (err) return notice("Unable to add course to database.");
        notice("Course added.");
      })
    })
  })
}
exports.addCategory = async (req, res) => {
  var notice = (msg, holder) => {
    res.render("admin/course/addCategory", {
      title: "Add Course Category",
      message: msg,
      holder: holder,
      user: req.session.User
    });
  }
  try {
    if (!req.body.name || !req.body.description) return notice("Must enter either name or description")
    const template = {
      name: req.body.name,
      description: req.body.description
    };
    if (!req.body.name || !req.body.description) return notice("Must enter either name or description", template);
    if (!validate("unicode", req.body.name)) return notice("Invalid category name", template);

    var findCate = await CourseCategory.find(template);
    if (findCate.length > 0) return notice("The category has already existed");
    await CourseCategory.create(template, (err, result) => {
      if (err) return notice("Unable to add course category to database");
      notice("Category added.");
    });
  } catch (e) {
    res.write(e);
    res.end();
  }
}
exports.addUserToCourse = async (req, res) => {
  var users = await User.find({});
  var courses = await Course.find({});
  var notice = (msg) => {
    res.render("admin/course/addUserToCourse", {
      title: "Add user to course",
      message: msg,
      user_data: users,
      course: courses,
      user: req.session.User,
    });
  };
  try {
    var trainer = req.body.trainerusername;
    var trainee = req.body.traineeusername;
    var course = req.body.course;
    if (!trainee && !trainer)
      return notice("You must input at least one of either trainer or trainee.");
    //update members array
    const update = async (newmembers) => {
      await Course.updateOne({ name: course }, { $addToSet: { members: newmembers._id } }, (err, result) => {
        if (err) return notice("Unable to add user to course");
        if (result.nModified == 0) return notice("User '" + newmembers.username + "'  has already in course.");
        return notice("Added user '" + newmembers.username + "' to " + course);
      });
    };
    if (trainee) {
      var trainee_db = await User.findOne({ username: trainee });
      if (trainee_db) update(trainee_db);
      else notice("User did not exist.");
    } else if (trainer) {
      var trainer_db = await User.findOne({ username: trainer });
      if (trainer_db) update(trainer_db);
      else notice("User did not exist.");
    }
  } catch (e) {
    notice("An error has occurred.");
    console.log(e);
  }

}
exports.editCourse = async (req, res) => {
  if (!req.query.id) return res.redirect("back");
  var course = await Course.findOne({ _id: req.query.id })
    .populate({ path: "category", models: "CourseCategory" });
  var category = await CourseCategory.find({});
  var notice = (msg) => {
    res.render("admin/course/getEditCourse", {
      title: "Edit course " + course.name,
      message: msg,
      course: course,
      category: category,
      user: req.session.User
    })
  };
  try {
    let name = req.body.name;
    let description = req.body.description;
    let category = req.body.category;
    let message
    if (!name || !description || !category) return notice("Please enter either the input fields.");
    if (!validate("unicode", name)) return notice("Invalid course name.");
    await Course.updateOne({ _id: req.query.id }, {
      name: name,
      description: description,
      category: ObjectId(category)
    }, (err, result) => {
      if (err) return notice("Unable to edit course.");
      else if (result.nModified !== 0) message = "Course has been updated.";
      else message = "Category has not been updated";
      notice(message)
    })

  } catch (e) {
    console.log(e);
    notice("An error has orrcured.")
  }
}
exports.editCategory = async (req, res) => {
  if (!req.query.id) return res.redirect("back");
  var category = await CourseCategory.findOne({ _id: req.query.id });
  var notice = (msg) => {
    res.render("admin/course/getEditCategory", {
      title: "Edit category " + category.name,
      message: msg,
      category: category,
      user: req.session.User
    });
  };
  try {
    let name = req.body.name;
    let description = req.body.description;
    if (!name || !description) return notice("Please enter either the input fields.");
    await CourseCategory.updateOne({ _id: req.query.id }, {
      name: name,
      description: description
    }, (err, result) => {
      if (err) return notice("Unable to edit category.");
      else if (result.nModified !== 0) return notice("Category has been updated.");
      else notice("Category has not been updated")
    });
  } catch (e) {
    notice("An error has orrcured.")
  }
}
exports.addSchedules = async (req, res) => {
  if (!req.body.trainer || !req.body.slot || req.body.course);
  var template = {
    trainer: ObjectId(req.body.trainer),
    date: getDate(),
    time: ObjectId(req.body.slot)
  }
  var trainers = (await User.find()
    .populate({ path: "role", model: "Role" }))
    .filter(User => user.role.name == "trainer");
  var slots = await Slot.find();
  var notice = (msg) => {
    res.render("admin/course/schedules/addSchedule", {
      title: "Add Schedule to Course",
      message: msg,
      trainers: trainers,
      slots: slots,
      user: req.session.User
    })
  }
  var query = { name: ObjectID(req.body.course) }
  await Course.updateOne(query, { schedules: template }, (err, result) => {
    if (result.nModified == 0) notice("Schedule duplicate! The schedule might've been assigned.");
    else notice("Course "+ course)
  })
}