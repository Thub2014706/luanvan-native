import axios from 'axios';
import { showToast } from '~/constants';

export const allSeatRoom = async (room) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/seat?room=${room}`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const detailSeat = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/seat/detail/${id}`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};
