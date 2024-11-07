import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../auth/authSlice';
import cartReducer from '../cart/cartSlice';
// import socketReducer from '~/features/socket/socketSlide';
import informationReducer from '../information/informationSlide';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
    whitelist: ['information', 'auth', 'cart'],
    // whitelist: ['auth', 'cart', 'socket', 'information'],
};

const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    // socket: socketReducer,
    information: informationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export let persistor = persistStore(store);
