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
for (let name of files) {
  name = name.replace(".model.js", "");
  if (name != "index.js") {
    module.exports[name] = require("./" + name + ".model.js")
    console.log("Loaded model `" + name + "` from " + name + ".model.js");
  }
}
// console.log(module.exports); //for debug, comment this when not needing it



