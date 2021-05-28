//export libraries when being required
module.exports = {
    express: require("express"), //alias of express variable at line 2
    bodyParser: require("body-parser"),
    session:require("express-session"),
    mongoose: require("mongoose"),
    path:require("path"),
    fs: require("fs"),
    hbs: require("hbs"),
    //upon adding new libraries, create their aliases here
}