import axios from 'axios';

export const listFilmBySchedule = async (type) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/film/list-by-schedule?type=${type}`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const getImage = async (name) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/film/image/${name}`);
        return response.config.url;
    } catch (error) {
        console.error('loi', error);
    }
};

export const detailFilm = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/film/detail/${id}`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const detailFilmBySchedule = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/film/detail-by-schedule/${id}`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const listFilmByTheater = async (theater) => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/film/list-by-theater?theater=${theater}`,
        );
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};

export const searchFilm = async (search) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/film/search?search=${search}`);
        return response.data;
    } catch (error) {
        console.error('loi', error);
    }
};
