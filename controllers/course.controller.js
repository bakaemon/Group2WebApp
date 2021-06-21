const models = require("../models")
const Course = models.course;
const User = models.user
const CourseCategory = models.courseCategory;
const { ObjectId } = require("../libraries").mongoose.Types;
//GET methods
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
    var users = await User.find({});
    var courses = await Course.find({});
    res.render("admin/course/addUserToCourse", {
        title: "Add user to course",
        user_data: users,
        course: courses,
        user: req.session.User,
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
    var notice = (msg) => {
        res.render("admin/course/addCourse", {
            title: "Add course",
            category: category,
            message: msg,
            user: req.session.User
        });
    }
    await Course.create(template, (err) => {
        if (err) return notice("Unable to add course to database.");
        notice("Course added.");
    })
}
exports.addCategory = async (req, res) => {
    var notice = (msg) => {
        res.render("admin/course/addCategory", {
            title: "Add Course Category",
            message: msg,
            user: req.session.User
        });
    }
    try {
        if (!req.body.name || !req.body.description) return notice("Must enter either name or description")
        const template = {
            name: req.body.name,
            description: req.body.description
        };
        if (await CourseCategory.find(template)) return notice("The category has already existed");
        await CourseCategory.create(template, (err) => {
            if (err) return notice("Unable to add course category to database");
            notice("Category added.");
        });
    }
    catch (e) {
        res.write(e);
        res.end();
    }
}