const adminController = require("../controllers").admin

module.exports = (app) => {
  app.use((req, res, next) => {
    const userSession = req.session.User;
    if(userSession && userSession.role !== "admin") {
      res.redirect("/")
    }
    next();
  });

  app.post("/admin/add", adminController.addUser);
  app.get("/admin/add", adminController.getAddUser);
app.post("/admin/edit", adminController.editUser)

  app.get("/admin/users", adminController.getUsers);
  app.get("/admin/edit", adminController.getEditUser);
  app.get("/admin/delete", adminController.deleteUser);
}
