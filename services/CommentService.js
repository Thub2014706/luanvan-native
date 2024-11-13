import axios from 'axios';
import Toast from 'react-native-toast-message';
import { showToast } from '~/constants';

export const addComment = async (data) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/comment/`, data);
        // showToast('Thêm mới thành công', 'success');
        return response.data;
    } catch (error) {
        // showToast(error.response.data.message, 'error');
        Toast.show({
            type: 'error',
            text1: error.response.data.message,
            // text2: null,
        });
        console.log('loi', error);
    }
};

export const listCommentByFilm = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/comment/all-by-film/${id}`);
        // showToast('Thêm mới thành công', 'success');
        return response.data;
    } catch (error) {
        showToast(error.response.data.message, 'error');
        console.log('loi', error);
    }
};

export const avgComment = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/comment/avg-comment/${id}`);
        // showToast('Thêm mới thành công', 'success');
        return response.data;
    } catch (error) {
        // showToast(error.response.data.message, 'error');
        console.log('loi', error);
    }
};
