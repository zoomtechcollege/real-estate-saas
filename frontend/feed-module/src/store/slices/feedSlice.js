// feed-module/src/store/slices/feedSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPropertiesFeed = createAsyncThunk(
    'feed/fetchPropertiesFeed',
    async (filters, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/properties', { params: filters });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

const feedSlice = createSlice({
    name: 'feed',
    initialState: {
        properties: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1
    },
    reducers: {
        setPage: (state, action) => {
            state.currentPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertiesFeed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPropertiesFeed.fulfilled, (state, action) => {
                state.loading = false;
                state.properties = action.payload.properties;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchPropertiesFeed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setPage } = feedSlice.actions;
export default feedSlice.reducer;