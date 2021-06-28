const { mongoose } = require("../libraries")

const LogSchema = new mongoose.Schema({
  action: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createDate: { type: Date, default: Date.now, expires: 3600 * 24 * 10 }
});

const Log = mongoose.model(
  "Log",
  LogSchema
);

module.exports = Log;

