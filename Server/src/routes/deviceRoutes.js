// routes/deviceRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Device = require("../models/Device.js");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { deviceId, secret } = req.body;

  const device = await Device.findOne({ deviceId });
  if (!device) return res.status(404).json({ message: "Device not found" });

  if (device.secret !== secret) {
    return res.status(401).json({ message: "Invalid secret" });
  }

  const token = jwt.sign(
    { deviceId: device.deviceId },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d", // device gets a 1-day token
    }
  );

  res.json({ token });
});

module.exports = router;
