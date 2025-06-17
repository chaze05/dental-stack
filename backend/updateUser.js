const mongoose = require("mongoose");
const Patient = require("./models/Patient");
const PatientRecord = require("./models/PatientRecord");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI; // Change database name if needed

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

const updateUsers = async () => {
  try {
    await connectDB(); // Ensure DB is connected before querying

    const users = await PatientRecord.find(); // Fetch users

    for (const user of users) {
      const patient = await Patient.findOne({ _id: user.patientId });
  
      // if (patient) {
        // user.patientID = patient._id;
        user.fullname = patient.fullname;
        await user.save();
        console.log(`✅ Updated user: ${user.email} with patientId: ${patient._id}`);
      // }
    }

    console.log("✅ User update process complete.");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error updating users:", error);
    mongoose.connection.close();
  }
};

updateUsers();
