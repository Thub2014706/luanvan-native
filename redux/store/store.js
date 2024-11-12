import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../auth/authSlice';
import cartReducer from '../cart/cartSlice';
// import socketReducer from '~/features/socket/socketSlide';
import informationReducer from '../information/informationSlide';
import socketReducer from '../socket/socketSlide';
import searchReducer from '../search/search';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
    // whitelist: ['information', 'auth', 'socket', 'cart'],
    whitelist: ['auth', 'cart', 'information', 'search'],
    blacklist: ['socket'],
};

const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    socket: socketReducer,
    information: informationReducer,
    search: searchReducer,
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
