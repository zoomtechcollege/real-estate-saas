// properties-module/src/store/slices/propertySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthState } from '../index';

// הוספת token לבקשות
const getAuthHeader = () => {
    const { token } = getAuthState();
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchUserProperties = createAsyncThunk(
    'properties/fetchUserProperties',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/properties/user', getAuthHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const createProperty = createAsyncThunk(
    'properties/createProperty',
    async (propertyData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/properties', propertyData, getAuthHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const updateProperty = createAsyncThunk(
    'properties/updateProperty',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/properties/${id}`, data, getAuthHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const deleteProperty = createAsyncThunk(
    'properties/deleteProperty',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/properties/${id}`, getAuthHeader());
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

const propertySlice = createSlice({
    name: 'properties',
    initialState: {
        items: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        resetStatus: (state) => {
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchUserProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProperty.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createProperty.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
                state.success = true;
            })
            .addCase(createProperty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
        // שאר הטיפול באירועים של updateProperty ו-deleteProperty
    }
});

export const { resetStatus } = propertySlice.actions;
export default propertySlice.reducer;