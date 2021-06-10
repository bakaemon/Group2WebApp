const models = require("../models")
const Course = models.course;
const CourseCategory = models.courseCategory;
const { ObjectId } = require("../libraries").mongoose.Types;
//GET methods
exports.getAddCourse = async (req, res) => {
    const category = await CourseCategory.find({});
    res.render("admin/course/addCourse", {
        title: "Add course",
        category: category
    });
}
exports.getAddCategory = async (req, res) => {
    res.render("admin/course/addCategory", {
        title: "Add Course Category"
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
    await Course.create(template, (err) => {
        if (!err) {
            res.render("admin/course/addCourse", {
                title: "Add course",
                category: category,
                message: "Course added."
            });
        }
    })
}
exports.addCategory = async (req, res) => {
    try {
        if (!req.body.name || !req.body.description) return res.render("admin/course/addCategory", { title: "Add Course Category", message: "Must enter either name or description" })
        const template = {
            name: req.body.name,
            description: req.body.description
        };
        if (await CourseCategory.find(template)) return res.render("admin/course/addCategory", { title: "Add Course Category", message: "The category has already existed" });
        await CourseCategory.create(template, (err) => {
            if (!err) {
                res.render("admin/course/addCategory", {
                    title: "Add Course Category",
                    message: "Category added"
                });
            }
        });
    }
    catch (e) {
        res.write(e);
        res.end();
    }
}