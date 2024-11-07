import { createSlice } from "@reduxjs/toolkit";

export const informationSlice = createSlice({
    name: 'information',
    initialState: {
        data: {}
    },
    reducers: {
        setInformation: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { setInformation } = informationSlice.actions;

export default informationSlice.reducer;
