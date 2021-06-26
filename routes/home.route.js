const homeController = require("../controllers").home;

module.exports = (app) => {
    app.get("/", homeController.home);
    app.get("/404", homeController.notfound);
}