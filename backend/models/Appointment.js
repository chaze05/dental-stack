const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId:{type:String,required:true},
    fullname: { type: String, required: true },
    date: { type: String,equired: true,trim: true,},
    procedure:{type:String,required:true,trim:true,},
    reason:{type:String,trim:true,},
    status: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
