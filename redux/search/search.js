import { createSlice } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        data: [],
    },
    reducers: {
        pushData: (state, action) => {
            state.data = [action.payload, ...state.data.filter((item) => item !== action.payload)];
        },
        removeData: (state, action) => {
            state.data = state.data.filter((item) => item !== action.payload);
        },
        removeAllData: (state) => {
            state.data = [];
        },
    },
});

export const { pushData, removeData, removeAllData } = searchSlice.actions;

export default searchSlice.reducer;
