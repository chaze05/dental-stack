const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middlewares/authenticate")
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ success: true, user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role, patientID: user.patientID  }, token });
  } catch (err) {

    res.status(500).json({ success: false, message: err.message + "Server error" });
  }
});

router.get("/me", async (req, res) => {
  try {
    // req.user is set by the authenticate middleware
    const user = await User.findById(req.user._id).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: error.message+"Server error" });
  }
});



module.exports = router;
