import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { listDiscount } from '~/services/DiscountService';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import BackIcon from '~/components/BackIcon/BackIcon';
import * as Progress from 'react-native-progress';
import { WIDTH } from '~/constants';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { discountValue } from '~/redux/cart/cartSlice';
import { detailUserById } from '~/services/UserService';

const DiscountList = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const listTicket = useSelector((state) => state.cart.cartTicket);
    const selectDis = useSelector((state) => state.cart.discount);
    const [discounts, setDiscounts] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [select, setSelect] = useState(selectDis);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetch = async () => {
            const data = await detailUserById(user.data.id);
            setUserInfo(data);
        };
        fetch();
    }, [user]);

    useEffect(() => {
        const fetch = async () => {
            if (userInfo !== null) {
                const data = await listDiscount();
                data.sort((a, b) => {
                    const aValid = (a.level === 2 || a.level === userInfo.level - 1) && a.minium <= listTicket.price;
                    const bValid = (b.level === 2 || b.level === userInfo.level - 1) && b.minium <= listTicket.price;

                    return aValid === bValid ? 0 : aValid ? -1 : 1;
                });
                setDiscounts(data);
            }
        };
        fetch();
    }, [listTicket.price, userInfo]);

    const handleSelect = (id) => {
        select === id ? setSelect(null) : setSelect(id);
    };

    const handleApply = () => {
        dispatch(discountValue({ discount: select }));
        router.back();
    };

    return (
        <React.Fragment>
            <BackIcon
                action={
                    <Text
                        style={{ fontSize: 18, fontWeight: '500', marginHorizontal: 10 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Mã khuyến mãi
                    </Text>
                }
            />
            {discounts.length > 0 ? (
                <React.Fragment>
                    <ScrollView>
                        <View style={styles.container}>
                            {discounts.map((item) => {
                                return (
                                    <View>
                                        <View style={{ position: 'relative' }}>
                                            <View style={styles.disContant}>
                                                <View
                                                    style={{
                                                        width: '30%',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        backgroundColor: '#d5bcfc',
                                                    }}
                                                >
                                                    <Text style={{ fontWeight: '500', fontSize: 20, padding: 10 }}>
                                                        {item.name}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        justifyContent: 'space-between',
                                                        flexDirection: 'row',
                                                        paddingHorizontal: 10,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <View style={{ padding: 10, paddingStart: 0 }}>
                                                        <Text style={{ fontSize: 16, fontWeight: '500' }}>
                                                            Chiết khấu {item.percent}%
                                                        </Text>
                                                        <Text style={{ fontWeight: '300', marginBottom: 5 }}>
                                                            Mã: {item.code}
                                                        </Text>
                                                        <Progress.Bar
                                                            progress={item.used / item.quantity}
                                                            width={WIDTH - 20 - (30 / 100) * (WIDTH - 20) - 70}
                                                            color="#3a2a62"
                                                            height={5}
                                                            unfilledColor="#d2d2d2"
                                                            borderWidth={0}
                                                        />
                                                        <Text style={{ fontWeight: '300', marginTop: 5 }}>
                                                            Đã dùng: {item.used}. Còn lại: {item.quantity - item.used}
                                                        </Text>
                                                        <Text style={{ fontWeight: '300' }}>
                                                            HSD: {moment(item.endDate).format('DD/MM/YYYY')}
                                                        </Text>
                                                    </View>
                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        {select !== item._id ? (
                                                            <Ionicons
                                                                name="ellipse-outline"
                                                                size={24}
                                                                color="gray"
                                                                onPress={() => handleSelect(item._id)}
                                                            />
                                                        ) : (
                                                            <Ionicons
                                                                name="checkmark-circle"
                                                                size={24}
                                                                color="#3a2a62"
                                                                onPress={() => handleSelect(item._id)}
                                                            />
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                            {userInfo !== null &&
                                                ((item.level !== 2 && item.level !== userInfo.level - 1) ||
                                                    item.minium > listTicket.price) && (
                                                    <View
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            backgroundColor: 'white',
                                                            opacity: 0.4,
                                                            zIndex: 10,
                                                            borderRadius: 2,
                                                            // pointerEvents: 'none',
                                                        }}
                                                    ></View>
                                                )}
                                        </View>
                                        {userInfo !== null &&
                                            ((item.level !== 2 && item.level !== userInfo.level - 1) ||
                                                item.minium > listTicket.price) && (
                                                <Text style={{ color: 'red', fontSize: 13 }}>
                                                    {item.level !== 2 && item.level !== userInfo.level - 1
                                                        ? 'Cấp độ thẻ của bạn không thể áp dụng mã khuyến mãi này.'
                                                        : item.minium > listTicket.price &&
                                                          'Tổng đơn hàng của bạn không đủ để áp dụng mã khuyến mãi này.'}
                                                </Text>
                                            )}
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                    <View style={styles.buttonContant}>
                        <TouchableWithoutFeedback onPress={handleApply}>
                            <View style={styles.button}>
                                <Text style={{ color: 'white', fontSize: 16 }}>Áp dụng</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </React.Fragment>
            ) : (
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có mã khuyến mãi nào!</Text>
                </View>
            )}
        </React.Fragment>
    );
};

export default React.memo(DiscountList);

const styles = StyleSheet.create({
    container: {
        padding: 10,
        gap: 10,
        // marginTop: 5
    },
    disContant: {
        flexDirection: 'row',
        borderRadius: 2,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderStyle: 'solid',
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#3a2a62',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 15,
    },
    buttonContant: {
        bottom: 0,
        backgroundColor: 'white',
        padding: 10,
    },
});
