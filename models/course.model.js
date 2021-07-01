const {mongoose} = require("../libraries")

const CourseSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseCategory"
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  schedules: [{
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    date: Date,
    time: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot"
    }
  }]
});

module.exports = mongoose.model(
  "Course",
  CourseSchema
);

