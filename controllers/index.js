let { fs } = require("../libraries");

const files = fs.readdirSync('controllers/', { withFileTypes: true })
  .filter(item => !item.isDirectory())
  .map(item => item.name);
for (let name_module of files) {
  var name = name_module.split(".")[0];
  if (name != "index" && name_module.split(".")[2] == "js") {
    try {
      module.exports[name] = require("./" + name_module);
      console.log("Loaded model `" + name + "` from " + name_module);
    } catch (e) {
      console.log("Failed to load model `" + name + "` from " + name_module);
    }
  }
}
// console.log(module.exports); //for debug, comment this when not needing it