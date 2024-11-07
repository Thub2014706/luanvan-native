import axios from 'axios';

export const detailTheater = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/theater/detail/${id}`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const listTheater = async () => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/theater/list`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const listProvince = async () => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/theater/list-province`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const listTheaterByProvince = async (province) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/theater/list-by-province?province=${province}`,
        );
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const lengthRoomByTheater = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/theater/length-room/${id}`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const lengthSeatByTheater = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/theater/length-seat/${id}`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};
