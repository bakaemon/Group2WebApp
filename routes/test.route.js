module.exports = (app) => {
    app.get("/test/getsession", (req, res) => {
        if (req.query.getses) { //get method
            req.session.test = req.query.getses; //save to session
            res.redirect('/test/viewsession');
        }
        res.write("No get detected.");
        res.end();

    });
    app.get("/test/viewsession", (req, res) => {
        if (req.session.test) {
            res.write(req.session.test);
            res.end();
        } else {
            res.write("No session detected.");
            res.end();
        }
    });
    app.get("/test/viewuser", (req, res) => {
        if (!req.session.User)
        {
            res.write("You are not logged in.");
            res.end();
        } else {
            res.write("You are" + req.session.User);
            res.end();
        }
    });
    app.get("/test/destroysession", (req, res) => {
        if (req.session.test) req.session.destroy(() => { res.write("Session destroyed."); res.end(); });
        else {
            res.write("No session detected.");
            res.end();

        }
    })
};