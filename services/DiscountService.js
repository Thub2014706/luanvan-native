import axios from 'axios';

export const detailDiscount = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/discount/detail/${id}`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const listDiscount = async () => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/discount/list`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const listDiscountFuture = async () => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/discount/list-future`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};
