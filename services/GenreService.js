import axios from 'axios';

export const detailGenre = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/genre/detail/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const listGenre = async () => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/genre/list`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};
