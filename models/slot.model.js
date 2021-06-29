const { mongoose } = require("../libraries")

const SlotSchema = new mongoose.Schema({
  name: String,
  timerange: String
});

const Slot = mongoose.model(
  "Slot",
  SlotSchema
);

module.exports = Slot;

