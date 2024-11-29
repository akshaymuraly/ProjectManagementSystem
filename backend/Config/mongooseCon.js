const mongoose = require("mongoose");

async function mongooseCon() {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("hopefully connected to db!");
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  mongooseCon,
};
