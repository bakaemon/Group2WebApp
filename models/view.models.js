const { mongoose } = require("../libraries")

const ViewSchema = new mongoose.Schema({
    totalviews: Number,
    useronline: Number
});

const View = mongoose.model(
    "View",
    ViewSchema
);

module.exports = View;

