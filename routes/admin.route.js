const adminController = require("../controllers").admin

module.exports = (app) => {
  app.use((req, res, next) => {
    const userSession = req.session.User;
    if(userSession && userSession.role !== "admin") {
      res.redirect("/")
    }
    next();
  });

  app.post("/admin/addUser", adminController.addUser);
  app.get("/admin/addUser", (req, res) => {
    res.render("admin/addUser");
  });

  app.get("/admin/getUsers", adminController.getUsers);
}
