import axios from 'axios';
import { showToast } from '~/constants';

export const holdSeat = async (data) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/redis/hold-seat`, data);
        return response.data;
    } catch (error) {
        showToast(error.response.data.message, 'error');
        console.log('loi', error);
    }
};

export const allHold = async (showTime) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/redis/all-hold?showTime=${showTime}`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const cancelHold = async (showTime, seatId) => {
    try {
        const seatIdString = seatId.join(',');
        const response = await axios.delete(
            `${process.env.EXPO_PUBLIC_API_URL}/api/redis/cancel-hold?showTime=${showTime}&seatId=${seatIdString}`,
        );
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const cancelAllHold = async (userId) => {
    try {
        const response = await axios.delete(
            `${process.env.EXPO_PUBLIC_API_URL}/api/redis/cancel-all-hold?userId=${userId}`,
        );
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const holdPay = async (data) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/redis/hold-pay`, data);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};
