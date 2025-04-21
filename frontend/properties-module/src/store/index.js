// properties-module/src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from './slices/propertySlice';
import propertyFormReducer from './slices/propertyFormSlice';

// Store ספציפי למודול המודעות
const store = configureStore({
    reducer: {
        properties: propertyReducer,
        propertyForm: propertyFormReducer
    }
});

export default store;

// hooks גישה ל-Shell Store (כדי לגשת למידע גלובלי כמו אימות)
export const getShellStore = () => window.shellStore;
export const getAuthState = () => getShellStore().getState().auth;
export const getUserState = () => getShellStore().getState().user;