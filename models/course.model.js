const { mongoose } = require("../libraries")

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
      }]
});

module.exports = mongoose.model(
    "Course",
    CourseSchema
);

