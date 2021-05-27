/**
 * This file í to import all js file inside this folder
 */
let path = require("../libraries");
let fs = require("../libraries").fs;
let glob = require("glob");

var functions = {}
var files = fs.readdirSync('tools/', {withFileTypes: true})
.filter(item => !item.isDirectory())
.map(item => item.name);
for (var name of files) {
    name = name.replace(".js", "");
    if (name != "index") module.exports[name] = require("./"+name)[name]
}