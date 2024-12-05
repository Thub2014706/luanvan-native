import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

axios.defaults.withCredentials = true;

const refreshToken = async () => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/refresh-token`, {});
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwtDecode(user?.accessToken);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshToken();
                console.log('aa', data);

                const refreshUser = {
                    data: user?.data,
                    accessToken: data.accessToken,
                };
                dispatch(stateSuccess(refreshUser));
                // config.headers['token'] = 'Bearer ' + data.accessToken;
                config.headers.Authorization = 'Bearer ' + data.accessToken;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        },
    );
    return newInstance;
};
