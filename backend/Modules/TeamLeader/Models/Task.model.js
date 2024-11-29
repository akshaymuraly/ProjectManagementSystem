const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  Task: {
    type: String,
    required: true,
  },
  Project: {
    type: mongoose.Schema.ObjectId,
    ref: "project",
  },
  Status: {
    type: String,
    default: "Status not updated",
  },
  TeamMembers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  ],
});

module.exports = mongoose.model("task", taskSchema);
