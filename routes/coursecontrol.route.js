const courseController = require("../controllers").course;

module.exports = (app) => {
    //GET events
    app.get("/admin/course/")
    app.get("/admin/course/addcourse", courseController.getAddCourse);
    app.get("/admin/course/addcategory", courseController.getAddCategory);
    app.get("/admin/course/addusertocourse", courseController.getAddUserToCourse);
    //POST events
    app.post("/admin/course/addcourse", courseController.addCourse)
    app.post("/admin/course/addcategory", courseController.addCategory);
}