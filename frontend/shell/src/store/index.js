// shell/src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// הגדרת Persist למידע שרוצים לשמור בין רענונים
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['token', 'isAuthenticated'] // שומר רק מידע קריטי
};

const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['id', 'role'] // שומר רק מידע קריטי
};

// Store מרכזי שמנהל רק מידע משותף
export const store = configureStore({
    reducer: {
        auth: persistReducer(authPersistConfig, authReducer),
        user: persistReducer(userPersistConfig, userReducer),
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
});

export const persistor = persistStore(store);

// חושף את ה-Store דרך חלון גלובלי כדי שמודולים יוכלו לגשת אליו
window.shellStore = store;