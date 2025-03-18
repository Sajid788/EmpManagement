const express = require("express");
const { getEmployees, addEmployee,updateEmployee, deleteEmployee, importExcel, exportExcel, upload } = require("../controllers/employeeController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/",  getEmployees);
router.put("/:id",protect, authorize(["admin"]), updateEmployee); 
router.delete("/:id",protect, authorize(["admin"]), deleteEmployee); 
router.post("/", protect, authorize(["admin"]), addEmployee);
router.post("/import", protect, authorize(["admin"]), upload, importExcel);
router.get("/export", protect, exportExcel);

module.exports = router;
