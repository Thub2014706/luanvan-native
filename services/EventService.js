import axios from 'axios';

export const listEvent = async () => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/event/list`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const detailEvent = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/event/detail/${id}`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};