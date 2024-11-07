import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { listDiscount } from '~/services/DiscountService';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import BackIcon from '~/components/BackIcon/BackIcon';
import * as Progress from 'react-native-progress';
import { WIDTH } from '~/constants';

const discountList = ({ selectDis, setSelectDis }) => {
    const [discounts, setDiscounts] = useState([]);
    const [select, setSelect] = useState(selectDis)

    useEffect(() => {
        const fetch = async () => {
            const data = await listDiscount();
            setDiscounts(data);
        };
        fetch();
    }, []);

    const handleSelect = (id) => {
        selectDis === id ? setSelect(null) : setSelect(id);
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
            <ScrollView>
                <View style={styles.container}>
                    {discounts.map((item) => {
                        return (
                            <View style={styles.disContant}>
                                <View
                                    style={{
                                        width: '25%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#d5bcfc',
                                    }}
                                >
                                    <Text style={{ fontWeight: '500', fontSize: 20 }}>{item.name}</Text>
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
                                            width={WIDTH - 20 - (25 / 100) * (WIDTH - 20) - 70}
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
                <TouchableWithoutFeedback>
                    <View style={styles.button}>
                        <Text style={{ color: 'white' }}>Đồng ý</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </React.Fragment>
    );
};

export default React.memo(discountList);

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
    },
});
