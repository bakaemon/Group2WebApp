const { mongoose } = require("../libraries")

const RoleSchema = new mongoose.Schema({
  name: String
});

const Role = mongoose.model( //Quang Anh, you'd better explain this to me later
  "Role",
  RoleSchema
);

module.exports = Role;

