const User = require("../models/User");
const bcrypt = require("bcryptjs");

const defaultUsers = [
  { name: "Admin", email: "admin@example.com", password: "admin123", role: "admin" },
  { name: "Developer (Rani)", email: "rani@dev.com", password: "dev123", role: "developer" },
  { name: "Dr. Smith", email: "doctor@example.com", password: "doctor123", role: "doctor" },
  { name: "Receptionist", email: "receptionist@example.com", password: "reception123", role: "receptionist" },
];

const createDefaultUsers = async () => {
  try {
    for (let userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new User({ ...userData, password: hashedPassword });
        await newUser.save();
        console.log(`✅ Created default user: ${userData.email}`);
      }
    }
  } catch (error) {
    console.error("❌ Error creating default users:", error);
  }
};

module.exports = createDefaultUsers;
