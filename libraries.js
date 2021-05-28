//export libraries when being required
module.exports = {
    express: require("express"),
    bodyParser: require("body-parser"),
    session:require("express-session"),
    mongoose: require("mongoose"),
    path:require("path"),
    fs: require("fs"),
    hbs: require("hbs"),
    bcrypt: require("bcryptjs")
    //upon adding new libraries, create their aliases here
}