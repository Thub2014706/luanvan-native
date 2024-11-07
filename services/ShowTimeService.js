import axios from 'axios';

export const listShowTimeByDay = async (theater, date, schedule) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/showtime/list-by-day?theater=${theater}&date=${date}&schedule=${schedule}`,
        );
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const listShowTimeByFilm = async (theater, date, film) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/showtime/list-by-film?theater=${theater}&date=${date}&film=${film}`,
        );
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const detailShowTimeById = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/showtime/detail-by-id/${id}`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const soldOutSeat = async (showTime, room) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/showtime/check-seat?showTime=${showTime}&room=${room}`,
        );
        return response.data.message;
    } catch (error) {
        console.error('loi', error);
    }
};

export const showTimeByTheater = async (theater, typeSchedule) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/showtime/list-by-theater?theater=${theater}&typeSchedule=${typeSchedule}`,
        );
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const filmByTheater = async (theater, date) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/showtime/film-by-theater?theater=${theater}&date=${date}`,
        );
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const listDateByFilm = async (film) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/showtime/date-by-film?film=${film}`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const showTimeFilter = async (theater, film, date) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/showtime/filter?theater=${theater}&film=${film}&date=${date}`,
        );
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};
