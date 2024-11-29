const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  ProjectName: {
    type: String,
    required: true,
  },
  ProjectDetails: {
    type: String,
    required: true,
  },
  Members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

module.exports = mongoose.model("project", projectSchema);
