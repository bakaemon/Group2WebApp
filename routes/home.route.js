const homeController = require("../controllers").home;

module.exports = (app) => {
    app.get("/", homeController.home);
    app.get("/404", homeController.notfound);

    /* 404 handling */
    app.use((req, res, next) => {
        res.render("404", { title: "Not found!" });
    })
}