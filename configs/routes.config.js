const routes = require("../routes");
exports.load = (app) => {
    routes.api(app);
    routes.home(app);
    routes.auth(app);
    routes.admin(app);
    routes.coursecontrol(app);
}