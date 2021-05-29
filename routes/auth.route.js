const authController = require("../controllers").auth;
//export event methods
module.exports = (app) => {
  //POST event handlers
  app.post("/auth/signup", authController.signup);
  app.post("/auth/login", authController.login);
  //GET event handlers
  app.get("/auth/signup", authController.getSignup);
  app.get("/auth/login", authController.getLogin)
}