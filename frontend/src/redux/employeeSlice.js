import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/employees";

// Fetch Employees
export const fetchEmployees = createAsyncThunk(`employee/fetch`, async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
});

export const addEmployee = createAsyncThunk(
  "employee/add",
  async (employee, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue("No token found. Please log in.");
    }

    try {
      const response = await axios.post(API_URL, employee, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Request failed");
    }
  }
);

// Update Employee
export const updateEmployee = createAsyncThunk(
  "employee/update",
  async ({ id, employee }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/${id}`, employee, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update employee"
      );
    }
  }
);

// Delete Employee
export const deleteEmployee = createAsyncThunk(
  "employee/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete employee"
      );
    }
  }
);

// Upload Excel
export const uploadExcel = createAsyncThunk("employee/upload", async (file) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_URL}/import`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
});

// Export Excel
export const exportExcel = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/export`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "employees.xlsx");
    document.body.appendChild(link);
    link.click();

    toast.success("Data exported successfully!");
  } catch (error) {
    toast.error("Failed to export data. Please try again.");
  }
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState: { employees: [], error: null },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
      })

      // Add Employee
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
        toast.success("Employee added successfully!");
      })
      .addCase(addEmployee.rejected, (state, action) => {
        toast.error(action.payload || "Failed to add employee.");
      })

      // Update Employee
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.map((emp) =>
          emp._id === action.payload._id ? action.payload : emp
        );
        toast.success("Employee updated successfully!");
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        toast.error(action.payload || "Failed to update employee.");
      })

      // Delete Employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(
          (emp) => emp._id !== action.payload
        );
        toast.success("Employee deleted successfully!");
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        toast.error(action.payload || "Failed to delete employee.");
      });
  },
});

export default employeeSlice.reducer;
