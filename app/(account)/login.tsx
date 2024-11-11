import {
    Appearance,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { login, register } from '~/services/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { WIDTH } from '~/constants';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import BackIcon from '~/components/BackIcon/BackIcon';

const Login = () => {
    const { isLog } = useLocalSearchParams<{ isLog: string }>();
    // console.log(isLogin);

    const isLogin = isLog === 'true';
    const [data, setData] = useState(
        isLogin
            ? {
                  info: '',
                  password: '',
              }
            : {
                  username: '',
                  email: '',
                  phone: '',
                  password: '',
                  confirmPassword: '',
              },
    );
    const [war, setWar] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const fetch = async () => {
            isLogin
                ? setData({
                      info: '',
                      password: '',
                  })
                : setData({
                      username: '',
                      email: '',
                      phone: '',
                      password: '',
                      confirmPassword: '',
                  });
        };
        fetch();
    }, [isLogin]);

    const handleChange = (field) => (value) => {
        setWar('');
        setData((pre) => ({
            ...pre,
            [field]: value,
        }));
    };
    const user = useSelector((state) => state.auth.login.currentUser);

    const handleSubmit = async () => {
        if (isLogin) {
            const result = await login(data, dispatch);
            console.log('qwqw', result);
            if (result) {
                router.back();
            }
        } else {
            await register(data);
        }

        // const result = isLogin ? await login(data, dispatch) : await register(data);
        // if (result) {
        //     setWar(result);
        // }
    };

    return (
        <>
            <View style={{ zIndex: 999 }}>
                <Toast topOffset={20} />
            </View>
            <BackIcon />
            <ScrollView>
                <View style={styles.container}>
                    <Text style={{ fontSize: 20, fontWeight: '500' }}>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</Text>
                    {isLogin ? (
                        <View>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange('info')}
                                value={data.info}
                                placeholder="Tài khoản, email hoặc số điện thoại"
                                keyboardType="default"
                                enterKeyHint="next"
                                onSubmitEditing={() => passwordInput.focus()}
                            />
                            <TextInput
                                ref={(input) => {
                                    passwordInput = input;
                                }}
                                secureTextEntry={true}
                                value={data.password}
                                onChangeText={handleChange('password')}
                                style={styles.input}
                                placeholder="Mật khẩu"
                                enterKeyHint="done"
                            />
                        </View>
                    ) : (
                        <View>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange('username')}
                                value={data.username}
                                placeholder="Tên đăng nhập"
                                keyboardType="default"
                                enterKeyHint="next"
                            />
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange('email')}
                                value={data.email}
                                placeholder="Email"
                                keyboardType="email-address"
                                enterKeyHint="next"
                            />
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange('phone')}
                                value={data.phone}
                                placeholder="Số điện thoại"
                                keyboardType="name-phone-pad"
                                enterKeyHint="next"
                            />
                            <TextInput
                                secureTextEntry={true}
                                value={data.password}
                                onChangeText={handleChange('password')}
                                style={styles.input}
                                placeholder="Mật khẩu"
                                enterKeyHint="next"
                            />
                            <TextInput
                                secureTextEntry={true}
                                value={data.confirmPassword}
                                onChangeText={handleChange('confirmPassword')}
                                style={styles.input}
                                placeholder="Nhập lại mật khẩu"
                                enterKeyHint="done"
                            />
                        </View>
                    )}
                    <TouchableWithoutFeedback onPress={handleSubmit}>
                        <View style={styles.button}>
                            <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>
                                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    {war !== '' && (
                        <View style={{ alignSelf: 'flex-start', flexDirection: 'row', gap: 5, marginTop: 20 }}>
                            <Ionicons name="warning-outline" size={18} color="#3a2a62" />
                            <Text style={{ fontSize: 16 }}>{war}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 10,
        marginTop: 70,
    },
    input: {
        height: 50,
        margin: 12,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: WIDTH - 20,
        borderColor: 'gray',
        borderRadius: 10,
    },
    button: {
        width: '100%',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3a2a62',
        borderRadius: 10,
        marginTop: 20,
    },
});
