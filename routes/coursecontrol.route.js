const courseController = require("../controllers").course;

module.exports = (app) => {
    /**
    * Allow to establish both GET and POST event with the same URL request
    * @param {String} URL 
    * @param {Function} getEvent 
    * @param {Function} postEvent 
    */
    const eventhandler = (URL, getEvent, postEvent = undefined) => {
        if (postEvent !== undefined)
            app.post(URL, postEvent);
        app.get(URL, getEvent);
    }
    eventhandler("/admin/course/", courseController.getCourses)
    eventhandler("/admin/course/addcourse", courseController.getAddCourse, courseController.addCourse);
    eventhandler("/admin/course/delete_course", courseController.deleteCourse);
    eventhandler("/admin/course/addcategory", courseController.getAddCategory, courseController.addCategory);
    eventhandler("/admin/course/assign", courseController.getAddUserToCourse, courseController.addUserToCourse);
    eventhandler("/admin/course/category", courseController.getCategories);
    eventhandler("/admin/course/delete_category", courseController.deleteCategory);
    eventhandler("/admin/course/view", courseController.getViewCourse);
    eventhandler("/admin/course/edit", courseController.getEditCourse, courseController.editCourse);
    eventhandler("/admin/course/edit_category", courseController.getEditCategory, courseController.editCategory);
    eventhandler("/admin/course/trainerschedule", courseController.getTrainerSchedules)
}