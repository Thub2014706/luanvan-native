import axios from 'axios';

export const detailPopup = async () => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/popup/detail`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
