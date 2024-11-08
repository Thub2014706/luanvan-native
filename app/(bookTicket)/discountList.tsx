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

const DiscountList = () => {
    const selectDis = useSelector((state) => state.cart.discount);
    const [discounts, setDiscounts] = useState([]);
    const [select, setSelect] = useState(selectDis);
    const dispatch = useDispatch()

    useEffect(() => {
        const fetch = async () => {
            const data = await listDiscount();
            setDiscounts(data);
        };
        fetch();
    }, []);

    const handleSelect = (id) => {
        select === id ? setSelect(null) : setSelect(id);
    };

    const handleApply = () => {
        dispatch(discountValue({discount: select}))
        router.back()
    }

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
            <ScrollView>
                <View style={styles.container}>
                    {discounts.map((item) => {
                        return (
                            <View style={styles.disContant}>
                                <View
                                    style={{
                                        width: '30%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#d5bcfc',
                                    }}
                                >
                                    <Text style={{ fontWeight: '500', fontSize: 20, padding: 10 }}>{item.name}</Text>
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
                                        <Text style={{ fontWeight: '300', marginBottom: 5 }}>Mã: {item.code}</Text>
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
    );
};

export default React.memo(DiscountList);

const styles = StyleSheet.create({
    container: {
        padding: 10,
        gap: 10,
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
