const apiController = require("../controllers").api;

module.exports = (app) => {
    app.get("/api", apiController.getapi);
}