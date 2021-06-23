const models = require("../models")
const Course = models.course;
const User = models.user
const CourseCategory = models.courseCategory;
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
                .populate({ path: "category", models: "CourseCategory", select: "-__v" })
                .skip((resPerPage * page) - resPerPage)
                .limit(resPerPage);
            
        } else {
            items = await Course.find({});
            numOfItems = items.length;
            items = await Course.find({ name: regexQuery })
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
        var findCat = await CourseCategory.find(template)
        if (findCat.length > 0) return notice("The category has already existed");
        await CourseCategory.create(template, (err, result) => {
            if (err) return notice("Unable to add course category to database");
            notice("Category added.");
        });
    }
    catch (e) {
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
        const update = async (newmembers) => {
            await Course.updateOne({ name: course }, { $addToSet: { members: newmembers._id } }, (err, result) => {
                if (err) return notice("Unable to add user to course");
                if (result.nModified == 0) return notice("User '" + newmembers.username + "'  has already in course.");
                console.log(result.nModified);
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
        notice("An error hs occurred.");
        console.log(e);
    }

}