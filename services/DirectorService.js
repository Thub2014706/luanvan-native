import axios from 'axios';
import { showToast } from '~/constants';

export const detailDirector = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/director/detail/${id}`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const listDirector = async () => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/director/list`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
