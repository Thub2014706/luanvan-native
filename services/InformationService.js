import axios from 'axios';
import { setInformation } from '~/redux/information/informationSlide';

export const detailInfomation = async (dispatch) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/information/detail`);
        dispatch(setInformation(response.data));
        console.log(process.env.EXPO_PUBLIC_API_URL);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
