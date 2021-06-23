const adminController = require("../controllers").admin

module.exports = (app) => {
  app.use((req, res, next) => {
    const userSession = req.session.User;
    if (!userSession || userSession.role !== "admin") {
      res.redirect("/")
    } else return next();
  });
  /**
* Allow to establish both GET and POST event with the same URL request
* @param {String} URL 
* @param {Function} getEvent 
* @param {Function} postEvent 
*/
  const eventhandler = (URL, getEvent, postEvent) => {
    if (postEvent !== undefined)
      app.post(URL, postEvent);
    app.get(URL, getEvent);
  }
  eventhandler("/admin/add", adminController.getAddUser, adminController.addUser);
  eventhandler("/admin/users", adminController.getUsers);
  eventhandler("/admin/edit", adminController.getEditUser, adminController.editUser);
  eventhandler("/admin/delete", adminController.deleteUser);
}

