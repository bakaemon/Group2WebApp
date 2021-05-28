const {mongoose} = require("../libraries");
mongoose.Promise = global.Promise;

const db = {
  user: require("./user.model"),
  role: require("./role.model")
}

module.exports = db;



