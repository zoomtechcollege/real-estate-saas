// feed-module/src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import feedReducer from './slices/feedSlice';
import filterReducer from './slices/filterSlice';

const store = configureStore({
    reducer: {
        feed: feedReducer,
        filters: filterReducer
    }
});

export default store;

// גישה ל-Shell Store
export const getShellStore = () => window.shellStore;
export const getIsAuthenticated = () => getShellStore().getState().auth.isAuthenticated;