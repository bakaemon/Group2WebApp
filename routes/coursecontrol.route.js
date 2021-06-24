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
    eventhandler("/admin/course/addcategory", courseController.getAddCategory, courseController.addCategory);
    eventhandler("/admin/course/assign", courseController.getAddUserToCourse, courseController.addUserToCourse);
    eventhandler("/admin/course/view", courseController.getViewCourse);
}