const mongoose = require("mongoose");

const patientRecordSchema = new mongoose.Schema(
  {
    patientId:{
        type:String,
        required:true,
        trim:true,
    },
    fullname:{
      type:String,
      required:true,
      trim:true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    toothno: {
      type: String,
      required: true,
      lowercase: true,
    },
    procedure: {
      type: String,
      required: true,
    },
    dentist: {
      type: String,
    },
    amount_charged: {
      type: String,
    },
    amount_paid: {
      type: String,
    },
    balance: {
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

module.exports = mongoose.model("PatientRecord", patientRecordSchema);
