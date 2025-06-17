const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const User = require("../models/User");
const upload = require("../middlewares/upload");

// Create Patient with Image Upload
module.exports = (io) => {
  router.post("/add", upload.single("image"), async (req, res) => {
    try {
      const { fullname, email, gender,age,birthday, contactNumber, address, consultation,company,occupation,lastdoctor,lastivsit } = req.body;

      const patient = new Patient({
        fullname,
        email,
        gender,
        age,
        birthday,
        contactNumber,
        address,
        consultation,
        company,
        occupation,
        lastdoctor,
        lastivsit,
        // image: req.file ? `/uploads/${req.file.filename}` : null, // Save image path
      });

      await patient.save();
      res.status(201).json({ message: "Patient added successfully", patient });

      const user = await User.create({
        ...req.body,
        patientID: patient._id, //
      });

      await user.save();

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all users (admin access only)
  router.get("/", async (req, res) => {
    try {
      const patient = await Patient.find() // Exclude passwords
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // find patient
  router.get("/:id", async (req, res) => {
    try {
      const { patientid } = req.params;
      const records = await Patient.find({ patientid }); // Fetch all records for this patient
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router; // ✅ Return router instance
}