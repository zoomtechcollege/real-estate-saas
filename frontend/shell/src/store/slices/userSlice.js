// shell/src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk לקבלת פרטי המשתמש המחובר
export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (!auth.token) {
                return rejectWithValue({ message: "אין משתמש מחובר" });
            }

            const response = await axios.get('/api/users/profile', {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Async Thunk לעדכון פרטי המשתמש
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (userData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (!auth.token) {
                return rejectWithValue({ message: "אין משתמש מחובר" });
            }

            const response = await axios.put('/api/users/profile', userData, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
        name: '',
        email: '',
        phone: '',
        role: 'user', // 'user' או 'admin'
        createdAt: null,
        loading: false,
        error: null
    },
    reducers: {
        clearUserData: (state) => {
            // איפוס כל הנתונים למעט role (ששומר על הרשאות)
            const role = state.role;
            Object.assign(state, {
                id: null,
                name: '',
                email: '',
                phone: '',
                role,
                createdAt: null,
                loading: false,
                error: null
            });
        },
        clearUserError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchUserProfile cases
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                // עדכון כל פרטי המשתמש
                Object.assign(state, action.payload);
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // updateUserProfile cases
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                // עדכון פרטי המשתמש החדשים
                Object.assign(state, action.payload);
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // איפוס נתוני משתמש בעת התנתקות
            .addCase('auth/logout/fulfilled', (state) => {
                // שומר על role להרשאות, מאפס את שאר הנתונים
                const role = state.role;
                Object.assign(state, {
                    id: null,
                    name: '',
                    email: '',
                    phone: '',
                    role,
                    createdAt: null,
                    loading: false,
                    error: null
                });
            });
    }
});

export const { clearUserData, clearUserError } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectUserId = (state) => state.user.id;
export const selectUserRole = (state) => state.user.role;
export const selectIsAdmin = (state) => state.user.role === 'admin';
export const selectUserName = (state) => state.user.name;
export const selectUserEmail = (state) => state.user.email;
export const selectUserPhone = (state) => state.user.phone;
export const selectUserProfile = (state) => ({
    id: state.user.id,
    name: state.user.name,
    email: state.user.email,
    phone: state.user.phone,
    role: state.user.role,
    createdAt: state.user.createdAt
});
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;