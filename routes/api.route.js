const apiController = require("../controllers").api;

module.exports = (app) => {
    app.get("/api/user", apiController.getUserApi);
    app.get("/api/fakeuser", apiController.getFakeInfo);
    app.get("/api/getViews", apiController.getViews);
    app.get("/api/showViews", apiController.showViews);
    app.get("/api/getLogs", apiController.getLogs);

    
}