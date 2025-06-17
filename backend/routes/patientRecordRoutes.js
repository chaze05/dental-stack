const express = require("express");
const router = express.Router();
const PatientRecord = require("../models/PatientRecord");
const upload = require("../middlewares/upload");



// Create Patient with Image Upload
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { date, patientId,fullname, toothno,dentist, procedure, amount_charged, amount_paid,balance } = req.body;

    const patientRecord = new PatientRecord({
        patientId,
        fullname,
        date,
        dentist,
        toothno,
        procedure,
        amount_charged,
        amount_paid,
        balance
      // image: req.file ? `/uploads/${req.file.filename}` : null, // Save image path
    });

    await patientRecord.save();
    res.status(201).json({ message: "Patient Record added successfully", patientRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users (admin access only)
// router.get("/:id", async (req, res) => {
//   try {
//     const record = await PatientRecord.find({ _id: req._id });
//     res.json(record);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const patientRecord = await PatientRecord.find() // Exclude passwords
    res.json(patientRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const records = await PatientRecord.find({ patientId:id }); // Fetch all records for this patient
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
