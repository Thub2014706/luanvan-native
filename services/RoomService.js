import axios from 'axios';
import { showToast } from '~/constants';

export const allRoom = async (idCinema) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/room?idCinema=${idCinema}`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const detailRoom = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/room/detail/${id}`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const listRoomByTheater = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/room/list-by-theater/${id}`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const filterRoomByTheater = async (theater, room) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/room/filter-by-theater?theare=${theater}&room=${room}`,
        );
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};
