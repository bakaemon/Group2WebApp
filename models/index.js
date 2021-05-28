const { mongoose } = require("../libraries");
mongoose.Promise = global.Promise;

// const db = {
//   user: require("./user.model"),
//   role: require("./role.model")
// }

// module.exports = db;
let fs = require("../libraries").fs;

const files = fs.readdirSync('models/', { withFileTypes: true })
  .filter(item => !item.isDirectory())
  .map(item => item.name);
for (let name_module of files) {
  var name = name_module.split(".")[0];
  if (name != "index") {
    try {
      module.exports[name] = require("./" + name_module);
      console.log("Loaded model `" + name + "` from " + name_module);
    } catch (e) {
      console.log("Failed to load model `" + name + "` from " + name_module);
    }
  }
}
// console.log(module.exports); //for debug, comment this when not needing it



