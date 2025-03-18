import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/auth";

// Signup
export const signup = createAsyncThunk("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    toast.success("Signup successful! 🎉");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Signup failed ❌");
    return rejectWithValue(error.response?.data || "Signup failed");
  }
});

// Login
export const login = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    localStorage.setItem("token", response.data.token);
    toast.success("Login successful! ✅");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed ❌");
    return rejectWithValue(error.response?.data || "Login failed");
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: localStorage.getItem("token") || "" },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = "";
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
