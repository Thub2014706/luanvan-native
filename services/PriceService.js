import axios from 'axios';

export const detailPrice = async (typeUser, time) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/price/detail?typeUser=${typeUser}&time=${time}`,
        );
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const detailPriceByUser = async (typeUser, date, time, room, seat) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/price/detail-by-user?typeUser=${typeUser}&date=${date}&time=${time}&room=${room}&seat=${seat}`,
        );
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};
