let {fs} = require("../libraries");

const files = fs.readdirSync('controllers/', { withFileTypes: true })
  .filter(item => !item.isDirectory())
  .map(item => item.name);
for (let name of files) {
  name = name.replace(".controller.js", "");
  if (name != "index.js") {
    module.exports = require("./" + name + ".controller.js")
    console.log("Loaded controller `" + name + "` from " + name + ".controller.js");
  }
}
// console.log(module.exports); //for debug, comment this when not needing it