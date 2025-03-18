const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  department: { type: String, required: true },
  employeeId: {
    type: String,
    unique: true,
    default: () => `EMP-${Date.now()}`
  },
});


module.exports = mongoose.model("Employee", EmployeeSchema);

