import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { detailUserById, logout } from '~/services/UserService';
import { Image } from 'expo-image';
import ImageBase from '~/components/ImageBase/ImageBase';
import { sumPayByUser } from '~/services/OrderTicketService';
import { WIDTH } from '~/constants';
// import img from '~/assets/images/user-circle-512.webp'
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native';

const account = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [userInfo, setUserInfo] = useState(null);
    const dispatch = useDispatch();

    // console.log(user);
    useEffect(() => {
        const fetch = async () => {
            if (user) {
                const data = await detailUserById(user.data.id);
                const sum = await sumPayByUser(user.data.id);
                setUserInfo({ ...data, sum });
            } else {
                setUserInfo(null);
            }
        };
        fetch();
    }, [user]);

    const handleLogout = async () => {
        // await cancelAllHold(user?.data.id);
        await logout(dispatch, user?.accessToken);
    };

    return (
        <View>
            {userInfo === null ? (
                <View style={[styles.container, { marginTop: 90 }]}>
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
                <>
                    <View style={[styles.container, { marginTop: 50, flexWrap: 'wrap' }]}>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <ImageBase pathImg={userInfo.avatar} style={{ height: 70, width: 70, borderRadius: 70 }} />
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: '500' }}>{userInfo.username}</Text>
                                {/* <Text style={{ fontWeight: '300' }}>{userInfo.level === 1 ? 'Member' : 'VIP'}</Text> */}
                                <Text style={{ fontWeight: '300' }}>{userInfo.phone}</Text>
                                <Text style={{ fontWeight: '300' }}>{userInfo.email}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.container]}>
                        <Image
                            // className="mx-auto d-block"
                            source={{ uri: userInfo.qrCode }}
                            style={{
                                height: 80,
                                width: 80,
                                // border: '5px solid white',
                                // padding: '10px',
                            }}
                        />
                        <View style={{ flexDirection: 'row', gap: 50, marginTop: 20 }}>
                            <View>
                                <Text style={{ fontWeight: '300', textAlign: 'center' }}>Tổng chi tiêu</Text>
                                <Text style={{ color: '#3a2a62', textAlign: 'center' }}>
                                    {userInfo.sum.toLocaleString('it-IT')} VNĐ
                                </Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: '300', textAlign: 'center' }}>Điểm tích lũy</Text>
                                <Text style={{ color: '#3a2a62', textAlign: 'center' }}>{userInfo.point} P</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.line}></View>
                    </View>
                    <View style={[styles.container, { marginTop: 10, flexWrap: 'wrap' }]}>
                        <Text style={{ fontSize: 16 }}>Cấp độ thành viên</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 0,
                            justifyContent: 'flex-end',
                            paddingEnd: 10,
                            // marginTop: 10,
                        }}
                    >
                        <Ionicons name="ribbon-outline" size={25} color="#d99a00" />
                        <Text style={{ color: '#d99a00', fontWeight: '500' }}>VIP</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Progress.Bar
                            progress={userInfo.sum / 4000000}
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
                            paddingHorizontal: 10,
                            marginTop: 5,
                        }}
                    >
                        <Text>0</Text>
                        <Text>4.000.000</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <View style={styles.line}></View>
                    </View>

                    {/* <View style={{ marginTop: 20 }}>
                        <Button title="Đăng xuất" color="#3a2a62" onPress={handleLogout} />
                    </View> */}
                    <TouchableWithoutFeedback onPress={handleLogout}>
                        <Text style={{ color: '#3a2a62', fontSize: 16, textAlign: 'center', marginTop: 20 }}>Đăng xuất</Text>
                    </TouchableWithoutFeedback>
                </>
            )}
        </View>
    );
};

export default React.memo(account);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
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
