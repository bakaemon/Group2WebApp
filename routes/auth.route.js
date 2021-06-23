const authController = require("../controllers").auth;
//export event methods
module.exports = (app) => {
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
  eventhandler("/auth/signup", authController.getSignup, authController.signup);
  eventhandler("/auth/login", authController.getLogin, authController.login)
  eventhandler("/auth/logout", authController.logout)
}