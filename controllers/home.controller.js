exports.home = (req, res) => {
    res.render("index", { user: req.session.User });
}