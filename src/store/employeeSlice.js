import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://employee-management-system-625p.onrender.com/api';

// Get all employees
export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch employees'
      );
    }
  }
);

// Get employee by ID
export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (employeeId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/employees/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch employee details'
      );
    }
  }
);

// Create new employee
export const createEmployee = createAsyncThunk(
  'employees/create',
  async (employeeData, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${BASE_URL}/employees`, employeeData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh employee list after creation
      dispatch(fetchEmployees());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create employee'
      );
    }
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (employeeId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${BASE_URL}/employees/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return employeeId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete employee'
      );
    }
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, employeeData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(`${BASE_URL}/employees/${id}`, employeeData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update employee'
      );
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    employeeList: [],
    currentEmployee: null,
    totalEmployees: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    createSuccess: false,
    createLoading: false,
    deleteSuccess: false,
    deleteLoading: false,
    updateSuccess: false,
    updateLoading: false,
  },
  reducers: {
    clearEmployeeErrors: (state) => {
      state.error = null;
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
    resetCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    resetDeleteSuccess: (state) => {
      state.deleteSuccess = false;
    },
    resetUpdateSuccess: (state) => {
      state.updateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeList = action.payload.employees;
        state.totalEmployees = action.payload.totalEmployees;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch employee by ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create employee cases
      .addCase(createEmployee.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // Delete employee cases
      .addCase(deleteEmployee.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.currentEmployee = null;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })
      
      // Update employee cases
      .addCase(updateEmployee.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.currentEmployee = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearEmployeeErrors, 
  clearCurrentEmployee, 
  resetCreateSuccess,
  resetDeleteSuccess,
  resetUpdateSuccess
} = employeeSlice.actions;

export default employeeSlice.reducer;
