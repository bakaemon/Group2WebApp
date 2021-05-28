const authController = require("../controllers").auth;
//export event methods
module.exports = (app) => {
  app.post("/auth/signup", authController.signup);
  app.post("/auth/login", authController.login);

  app.get("/auth/signup", authController.getSignup);
  app.get("/auth/login", authController.getLogin)
}