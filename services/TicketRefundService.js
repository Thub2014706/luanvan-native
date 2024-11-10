import axios from 'axios';
import { showToast } from '~/constants';

export const addTicketRefund = async (data) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/ticket-refund/`, data);
        window.alert(
            'Gửi yêu cầu thành công, vé sẽ được hoàn vào điểm tích lũy. Vui lòng kiểm tra lại trong tài khoản!',
        );
        return response.data;
    } catch (error) {
        window.alert(error.response.data.message);
        console.log('loi', error);
    }
};

export const allTicketRefund = async (id, number) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/ticket-refund/refund-by-user/${id}?number=${number}`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const ticketRefundByOrder = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/ticket-refund/refund-by-order/${id}`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};
