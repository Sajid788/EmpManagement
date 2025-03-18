const Employee = require("../models/Employee");
const ExcelJS = require("exceljs");
const multer = require("multer");
const path = require("path");

// Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) =>
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ),
});
exports.upload = multer({ storage }).single("file");

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find(); 
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


// Add Employee
exports.addEmployee = async (req, res) => {
  try {
    const { name, email, department } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      employeeId: `EMP-${Date.now()}`
    });

    res.status(201).json({ message: "Employee Added Successfully", employee });
  } catch (error) {
    console.error("Error adding employee:", error);
    res
      .status(500)
      .json({ message: "Failed to Add Employee", error: error.message });
  }
};

// ✅ Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { name, email, department },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee Not Found" });
    }

    res
      .status(200)
      .json({ message: "Employee Updated Successfully", updatedEmployee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res
      .status(500)
      .json({ message: "Failed to Update Employee", error: error.message });
  }
};

// ✅ Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee Not Found" });
    }

    res.status(200).json({ message: "Employee Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res
      .status(500)
      .json({ message: "Failed to Delete Employee", error: error.message });
  }
};

exports.importExcel = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const worksheet = workbook.getWorksheet(1);
    let employeesToInsert = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) { 
        const name = row.getCell(1).value;
        const email = row.getCell(2).value;
        const department = row.getCell(3).value;
        let employeeId = row.getCell(4).value; 

        // If employeeId is missing or null, generate a new one
        if (!employeeId) {
          employeeId = `EMP-0${rowNumber}`;
        }

        employeesToInsert.push({ name, email, department, employeeId });
      }
    });

    await Employee.insertMany(employeesToInsert);
    res.json({ message: "Employees Imported Successfully" });
  } catch (error) {
    console.error("Error importing employees:", error);
    res.status(500).json({ message: "Failed to import employees", error });
  }
};



// Export Employees to Excel
exports.exportExcel = async (req, res) => {
  const employees = await Employee.find();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Employees");

  worksheet.addRow(["Name", "Phone", "Email", "Department", "Employee ID"]);
  employees.forEach((emp) =>
    worksheet.addRow([
      emp.name,
      emp.phone,
      emp.email,
      emp.department,
      emp.employeeId,
    ])
  );

  res.setHeader("Content-Disdepartment", "attachment; filename=employees.xlsx");
  await workbook.xlsx.write(res);
  res.end();
};
