const { mongoose } = require("../libraries")

const CourseCategorySchema = new mongoose.Schema({
    name: String,
    description: String,
}, { collection: "courseCategories" });
module.exports = mongoose.model(
    "CourseCategory",
    CourseCategorySchema,
);
