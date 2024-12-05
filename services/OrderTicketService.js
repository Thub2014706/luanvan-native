import axios from 'axios';
import { showToast } from '~/constants';

export const addOrderTicket = async (data, token, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`${process.env.EXPO_PUBLIC_API_URL}/api/order-ticket`, data, {
            headers: { authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        showToast(error.response.data.message, 'error');
        console.log('loi', error);
    }
};

export const detailOrderTicket = async (idOrder) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/order-ticket/detail?idOrder=${idOrder}`,
        );
        return response.data;
    } catch (error) {
        showToast(error.response.data.message, 'error');
        console.log('loi', error);
    }
};

export const allOrderTicketSelled = async (showTime) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/order-ticket/all-selled?showTime=${showTime}`,
        );
        return response.data;
    } catch (error) {
        showToast(error.response.data.message, 'error');
        console.log('loi', error);
    }
};

export const allOrderTicket = async (theater, number, show) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/order-ticket?theater=${theater}&number=${number}&show=${show}`,
        );
        return response.data;
    } catch (error) {
        showToast(error.response.data.message, 'error');
        console.log('loi', error);
    }
};

export const sumPayByUser = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/order-ticket/sum-by-user/${id}`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const allOrderByUser = async (id, number) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/order-ticket/order-by-user/${id}?number=${number}`,
        );
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};
