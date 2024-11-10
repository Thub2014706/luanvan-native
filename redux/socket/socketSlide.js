import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

export const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        socketConnection: null,
        numberChat: 0,
    },
    reducers: {
        setSocketConnection: (state, action) => {
            state.socketConnection = action.payload;
        },
        setNumberChat: (state, action) => {
            state.numberChat = action.payload;
        },
    },
});

export const { setSocketConnection, setNumberChat } = socketSlice.actions;

export default socketSlice.reducer;
