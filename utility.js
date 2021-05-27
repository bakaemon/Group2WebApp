/* Import libraries*/
let express = require("express");
let bodyParser = require("body-parser");
let session = require("express-session");
let path = require("path");

//export libraries when being required
module.exports = {
    express: express, //alias of express variable at line 2
    bodyParser: bodyParser,
    session: session,
    path: path
    //upon adding new libraries, create their aliases here
}