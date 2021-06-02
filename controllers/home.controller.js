exports.home = (req, res) => {
    let LoggedUser = "Guest";
    if (req.session.User) LoggedUser = req.session.User;
    res.render("index", {user: LoggedUser});
}