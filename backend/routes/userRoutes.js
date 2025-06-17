const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Register a patient (default role)
router.post("/register", async (req, res) => {
  try {
    const { fullname, email, password, patientID } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname, email, password: hashedPassword, patientID,role: "patient" });

    await newUser.save();
    res.status(201).json({ message: "Patient registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin access only)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userdata = await User.find({ patientID:id }); // Fetch all records for this patient
    res.json(userdata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
