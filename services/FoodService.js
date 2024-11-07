import axios from 'axios';

export const allFood = async (search, number, show) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/food?search=${search}&number=${number}&show=${show}`,
        );
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const detailFood = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/food/detail/${id}`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const listFood = async () => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/food/list`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};
