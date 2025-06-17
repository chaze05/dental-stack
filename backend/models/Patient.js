const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    contactNumber: {
      type: String,
      unique: true,
      required: true,
    },
    age: {
      type: String,
    },
    address: {
      type: String,
    },
    company: {
      type: String,
    },
    gender: {
      type: String,
    },
    occupation: {
      type: String,
    },
    consultation: {
      type: String,
    },
    lastdoctor: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    lastvisit: {
      type: String,
    },
    // medicalHistory: {
    //   type: String,
    // },
    //   image: {
    //     type: String, // Stores the image URL (use Multer for file uploads)
    //     required: false,
    // },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Patient", patientSchema);
