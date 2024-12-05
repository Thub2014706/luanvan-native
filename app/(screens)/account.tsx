import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { detailUserById, logout } from '~/services/UserService';
import { Image } from 'expo-image';
import ImageBase from '~/components/ImageBase/ImageBase';
import { sumPayByUser } from '~/services/OrderTicketService';
import { HEIGHT, WIDTH } from '~/constants';
// import img from '~/assets/images/user-circle-512.webp'
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native';
import { logoutSuccess } from '~/redux/auth/authSlice';
import { createAxios } from '~/createInstance';

const account = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [userInfo, setUserInfo] = useState(null);
    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, logoutSuccess);

    // console.log(user);
    useEffect(() => {
        const fetch = async () => {
            if (user && user.data && user.data.id) {
                const data = await detailUserById(user.data.id);
                const sum = await sumPayByUser(user.data.id);
                // console.log('qqqq', user, data);
                setUserInfo({ ...data, sum });
            } else {
                setUserInfo(null);
            }
        };
        fetch();
    }, [user && user.data && user.data.id]);

    const handleLogout = async () => {
        // await cancelAllHold(user?.data.id);
        console.log('aa');

        await logout(dispatch, user?.accessToken, axiosJWT);
    };

    return (
        <React.Fragment>
            {userInfo === null ? (
                <View style={[styles.container, { alignItems: 'center', paddingTop: 80 }]}>
                    <Image
                        source={require('~/assets/images/user-circle-512.webp')}
                        style={{ height: 100, width: 100 }}
                    />
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Đăng ký thành viên</Text>
                    <Text>Nhận ngay ưu đãi</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                        <Link href={{ pathname: '/(account)/login', params: { isLog: false } }}>
                            <View style={styles.register}>
                                <Text style={{ fontSize: 16, color: 'white' }}>Đăng ký</Text>
                            </View>
                        </Link>
                        <Link href={{ pathname: '/(account)/login', params: { isLog: true } }}>
                            <View style={styles.login}>
                                <Text style={{ fontSize: 16 }}>Đăng nhập</Text>
                            </View>
                        </Link>
                    </View>
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <ImageBase pathImg={userInfo.avatar} style={{ height: 70, width: 70, borderRadius: 70 }} />
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: '500' }}>{userInfo.username}</Text>
                            <Text style={{ fontWeight: '300' }}>{userInfo.phone}</Text>
                            <Text style={{ fontWeight: '300' }}>{userInfo.email}</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={{ uri: userInfo.qrCode }}
                            style={{
                                height: 80,
                                width: 80,
                            }}
                        />
                        <View style={{ flexDirection: 'row', gap: 50, marginTop: 20 }}>
                            <View>
                                <Text style={{ fontWeight: '300', textAlign: 'center' }}>Tổng chi tiêu</Text>
                                <Text style={{ color: '#3a2a62', textAlign: 'center', marginTop: 5 }}>
                                    {userInfo.sum.toLocaleString('it-IT')} VNĐ
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: '300', textAlign: 'center' }}>Điểm tích lũy</Text>
                                <Text style={{ color: '#3a2a62', textAlign: 'center', marginTop: 5 }}>
                                    {userInfo.point} P
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.line}></View>
                    </View>
                    <View>
                        <View style={[styles.container, { marginTop: 10, flexWrap: 'wrap' }]}>
                            <Text style={{ fontSize: 16 }}>Cấp độ thành viên</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 0,
                                justifyContent: 'flex-end',
                                // marginTop: 10,
                            }}
                        >
                            <Ionicons name="ribbon-outline" size={25} color="#d99a00" />
                            <Text style={{ color: '#d99a00', fontWeight: '500' }}>VIP</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Progress.Bar
                                progress={Math.min(userInfo.sum / 4000000, 1)}
                                width={WIDTH - 20}
                                color="#3a2a62"
                                height={7}
                                unfilledColor="#d2d2d2"
                                borderWidth={0}
                            />
                            {/* <Progress.Pie progress={0.4} size={50} />
                            <Progress.Circle size={30} indeterminate={true} />
                            <Progress.CircleSnail color={['red', 'green', 'blue']} /> */}
                        </View>
                        <View
                            style={{
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                marginTop: 5,
                            }}
                        >
                            <Text>0</Text>
                            <Text>4.000.000</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <View style={styles.line}></View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Link href={'/(history)/history'}>
                            <View>
                                <Text style={{ color: '#3a2a62', fontSize: 16, marginTop: 20 }}>Lịch sử giao dịch</Text>
                            </View>
                        </Link>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <View style={styles.line}></View>
                    </View>
                    <TouchableWithoutFeedback onPress={handleLogout}>
                        <Text style={{ color: '#3a2a62', fontSize: 16, textAlign: 'center', marginTop: 20 }}>
                            Đăng xuất
                        </Text>
                    </TouchableWithoutFeedback>
                </View>
            )}
        </React.Fragment>
    );
};

export default React.memo(account);

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'center',
        // alignItems: 'center',
        padding: 10,
        flex: 1,
        backgroundColor: 'white',
        // minHeight: HEIGHT,
    },
    login: {
        padding: 7,
        borderRadius: 5,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#3a2a62',
        justifyContent: 'center',
        alignItems: 'center',
    },
    register: {
        padding: 9,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3a2a62',
    },
    line: {
        width: WIDTH - 20,
        height: 1,
        backgroundColor: '#989898',
    },
});
