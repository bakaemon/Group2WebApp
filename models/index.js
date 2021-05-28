const { mongoose } = require("../libraries");
mongoose.Promise = global.Promise;

let fs = require("../libraries").fs;

const files = fs.readdirSync('models/', { withFileTypes: true })
  .filter(item => !item.isDirectory())
  .map(item => item.name); //return array of file name
for (let name_module of files) {
  //split string by dots into 3 part of string in array (e.g "user.model.js" => ["User", "model", "js"])
  let name = name_module.split(".")[0]; //get the first part only
  if (name !== "index" && name_module.split(".")[2] === "js") {
    try {
      module.exports[name] = require("./" + name_module); //save modules for exporting by name
      // console.log("Loaded model `" + name + "` from " + name_module);
    } catch (e) {
      console.log("Failed to load model `" + name + "` from " + name_module);
    }
  }
}
// console.log(module.exports); //for debug, comment this when not needing it



