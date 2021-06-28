const apiController = require("../controllers").api;

module.exports = (app) => {
    app.get("/api/user", apiController.getUserApi);
    app.get("/api/fakeuser", apiController.getFakeInfo);
    app.get("/api/getViews", apiController.getViews);
    
}