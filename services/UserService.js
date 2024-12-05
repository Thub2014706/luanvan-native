import axios from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';
// import { showToast } from '~/constants';
import {
    loginFailed,
    loginStart,
    loginSuccess,
    logoutFailed,
    logoutStart,
    logoutSuccess,
} from '~/redux/auth/authSlice';
import Toast from 'react-native-toast-message';
// axios.defaults.withCredentials = true;

// export const axiosJWT = axios.create();

// export const refreshToken = async () => {
//     try {
//         const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/user/refresh-token`);
//         return response.data;
//     } catch (error) {
//         console.log('loi', error);
//     }
// };

export const login = async (user, dispatch) => {
    // console.log('wedwe', user);
    dispatch(loginStart());
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/user/signin`, user);        
        dispatch(loginSuccess(response.data));
        return response.data
    } catch (error) {
        dispatch(loginFailed());
        if (error.response) {
            
            // return error.response.data.message;
            Toast.show({
                type: 'error',
                text1: error.response.data.message,
                text2: null,
            });
        } else {
            console.log('yyy', error);
            alert('Lỗi mạng ll');
        }
    }
};

export const register = async (user) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/user/signup`, user);
        Alert.alert('Đăng ký thành công', 'Tiến hành đăng nhập ngay nhé!', [
            { text: 'Đóng', onPress: () => console.log('OK Pressed') },
            {
                text: 'Đăng nhập ngay',
                onPress: () => {
                    router.replace({ pathname: '/login', params: { isLog: true } });
                },
            },
        ]);
    } catch (error) {
        if (error.response) {
            return error.response.data.message;
            // showToast(error.response.data.message, 'error');
        } else {
            console.log(error);
            alert('Lỗi mạng');
        }
    }
};

export const logout = async (dispatch, token, axiosJWT) => {
    dispatch(logoutStart());
    // console.log('qq');
    
    try {
        await axiosJWT.post(
            `${process.env.EXPO_PUBLIC_API_URL}/api/user/logout`,
            {},
            {
                headers: { authorization: `Bearer ${token}` },
            },
        );
        // dispatch(clearAll());
        // dispatch(clearAllCombo());
        dispatch(logoutSuccess());
    } catch (error) {
        dispatch(logoutFailed());
        console.log('uu', error);
    }
};

export const detailUserById = async (id) => {
    try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/user/detail-by-id/${id}`);
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};

export const updateAvatar = async (formData, id) => {
    try {
        const response = await axios.patch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/avatar/${id}`, formData, {
            headers: {
                'content-type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.log('loi', error);
    }
};
