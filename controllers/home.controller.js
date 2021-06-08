exports.home = (req, res) => {
    res.render("index", { title: "FPT CMS", user: req.session.User });
}
exports.notfound = (req, res) => {
    res.render("404", {title: "Not found!"});
}