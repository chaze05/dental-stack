const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");


// Register a patient (default role)
router.post("/add", async (req, res) => {
  try {
    const { fullname, date, procedure, patientId } = req.body;

    const existingAppointment = await Appointment.findOne({ 
      date, 
      patientId
    });
    
    if (existingAppointment) {
      return res.status(400).json({ message: "You already have an existing appointment request." });
    }

    const newAppointment = new Appointment({ fullname, date, procedure, patientId });

    await newAppointment.save();
    res.status(201).json({ message: "Patient registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





// Get all appointments (admin access only)
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()// Exclude passwords
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get("/:status", async (req, res) => {
  try {
    let { status } = req.params;
    let { date } = req.query;
    const today = new Date();
    
    // Set time range for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);


    // Convert status to number if it's not "pending"
    if (status == "pending") {
      status = 0;
      if (isNaN(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
    }else if(status == "active"){
      status = 1;
    }else{
      status = 2;
    }    
    // Build query dynamically
    const query = { status:status };
    // Apply date filter only for non-pending statuses
    if (date) {
      query.date = date;
    }
    console.log({query});
    // Fetch appointments
    const appointments = await Appointment.find(query);

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.put("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    // Ensure status is either 1 or 2
    if (![1, 2].includes(status)) {
      return res.status(400).json({ message: "Invalid status value. Must be 1 or 2." });
    }

    const user = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Returns the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User status updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




module.exports = router;
