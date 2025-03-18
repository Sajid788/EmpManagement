import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  deleteEmployee,
  updateEmployee,
  addEmployee,
} from "../redux/employeeSlice";

const EmployeeTable = () => {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employee);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 8;

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteEmployee(id));
  };

  const handleEdit = (employee) => {
    setSelectedEmployee({ ...employee });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedEmployee._id) {
      console.error("Error: Selected employee is undefined");
      return;
    }
    await dispatch(
      updateEmployee({ id: selectedEmployee._id, employee: selectedEmployee })
    );
    dispatch(fetchEmployees());
    setIsEditing(false);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    await dispatch(addEmployee(newEmployee));
    dispatch(fetchEmployees());
    setIsAdding(false);
    setNewEmployee({ name: "", email: "", department: "" });
  };

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(employees.length / employeesPerPage);

  console.log(employees);
  return (
    <div className="container mx-auto p-4">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setIsAdding(true)}
      >
        Add Employee
      </button>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">EmployeeId</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((emp) => (
            <tr key={emp._id} className="hover:bg-gray-100 text-center">
              <td className="border p-2">{emp.name}</td>
              <td className="border p-2">{emp.email}</td>
              <td className="border p-2">{emp.department}</td>
              <td className="border p-2">{emp.employeeId}</td>
              <td className="border p-2 flex gap-2 justify-center">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(emp._id)}
                >
                  Delete
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleEdit(emp)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Employee Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
            <form onSubmit={handleAddEmployee}>
              <input
                type="text"
                placeholder="Name"
                className="w-full border p-2 rounded mb-2"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded mb-2"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Department"
                className="w-full border p-2 rounded mb-2"
                value={newEmployee.department}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, department: e.target.value })
                }
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Add
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditing && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                className="w-full border p-2 rounded mb-2"
                value={selectedEmployee.name || ""}
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    name: e.target.value,
                  })
                }
              />
              <input
                type="email"
                className="w-full border p-2 rounded mb-2"
                value={selectedEmployee.email || ""}
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    email: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Department"
                className="w-full border p-2 rounded mb-2"
                value={selectedEmployee.department || ""}
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    department: e.target.value,
                  })
                }
              />

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="bg-gray-500 text-white px-3 py-1 rounded"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-gray-500 text-white px-3 py-1 rounded"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeTable;
