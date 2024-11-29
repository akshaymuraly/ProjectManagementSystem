const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  Email: {
    type: String,
    require: true,
  },
  Password: {
    type: String,
    require: true,
  },
  Role: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("user", userSchema);
