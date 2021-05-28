/**
 * This file í to import all js file inside this folder
 */
let fs = require("../libraries").fs;

const files = fs.readdirSync('tools/', {withFileTypes: true})
.filter(item => !item.isDirectory())
.map(item => item.name);
for (let name of files) {
    name = name.replace(".js", "");
    if (name !== "index") module.exports[name] = require("./"+name)[name]
}