import axios from 'axios';

export const listAdvertisement = async () => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/advertisement/list`);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('sd', error);
    }
};
