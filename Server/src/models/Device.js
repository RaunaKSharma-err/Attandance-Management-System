const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  secret: { type: String, required: true },
});

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;
