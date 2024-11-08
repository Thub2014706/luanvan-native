import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listCombo } from '~/services/ComboService';
import { listFood } from '~/services/FoodService';
import ComboItem from '~/components/ComboItem/ComboItem';
import { Ionicons } from '@expo/vector-icons';
import PayContainer from '~/components/PayContainer/PayContainer';
import { detailSeat } from '~/services/SeatService';
import MiniComboPay from '~/components/MiniComboPay/MiniComboPay';
import { transform } from '@babel/core';
import BackIcon from '~/components/BackIcon/BackIcon';
import { router, useFocusEffect } from 'expo-router';
import { cartTicketComboValue } from '~/redux/cart/cartSlice';
import { cancelAllHold, cancelHold } from '~/services/RedisService';

const ComboList = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const listTicket = useSelector((state) => state.cart.cartTicket);
    const [combo, setCombo] = useState([]);
    const [selectCombo, setSelectCombo] = useState([]);
    const [select, setSelect] = useState([]);
    const [food, setFood] = useState([]);
    const [seats, setSeats] = useState([]);
    const [selectFood, setSelectFood] = useState([]);
    const [time, setTime] = useState(180);
    const dispatch = useDispatch();
    const [price, setPrice] = useState(0);

    useEffect(() => {
        const fetch = async () => {
            const array = await Promise.all(
                listTicket.seats.map(async (item) => {
                    const data = await detailSeat(item);
                    return data;
                }),
            );
            setSeats(array);
        };
        fetch();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            const data1 = await listCombo();
            // console.log(data1);

            setCombo(data1);
            const newData1 = data1.map((item) => {
                return {
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: 0,
                    image: item.image,
                    variants: item.variants,
                };
            });
            setSelectCombo(newData1);
            const data2 = await listFood();
            setFood(data2);
            const newData2 = data2.map((item) => {
                return {
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: 0,
                    image: item.image,
                };
            });
            setSelectFood(newData2);
        };
        fetch();
    }, []);

    useEffect(() => {
        const fetch = () => {
            const combos = selectCombo.filter((item) => item.quantity > 0);
            const foods = selectFood.filter((item) => item.quantity > 0);
            const data = [...combos, ...foods];
            setSelect(data);
            setPrice(data.reduce((a, b) => a + b.price, 0));
            // dispatch(addCart({ combo: data, price: sum }));
        };
        fetch();
    }, [selectCombo, selectFood]);

    const handleMinus = (index, check) => {
        let copy = check === 'combo' ? [...selectCombo] : [...selectFood];
        if (copy[index].quantity > 0) {
            const updated = {
                ...copy[index],
                quantity: copy[index].quantity - 1,
            };
            copy[index] = updated;
        }
        check === 'combo' ? setSelectCombo(copy) : setSelectFood(copy);
    };

    const handleAdd = (index, check) => {
        let copy = check === 'combo' ? [...selectCombo] : [...selectFood];
        const updated = {
            ...copy[index],
            quantity: copy[index].quantity + 1,
        };
        copy[index] = updated;
        check === 'combo' ? setSelectCombo(copy) : setSelectFood(copy);
    };

    const handleCloseItem = (value) => {
        // setSelect((pre) => pre.filter((item) => item !== value));
        setSelectCombo((pre) => pre.map((item) => (item === value ? { ...item, quantity: 0 } : item)));

        setSelectFood((pre) => pre.map((item) => (item === value ? { ...item, quantity: 0 } : item)));
    };
    // console.log(listTicket);

    useEffect(() => {
        let interval;
        const startTime = Date.now();
        const startCountdown = () => {
            interval = setInterval(() => {
                const timePassed = Math.floor((Date.now() - startTime) / 1000);
                setTime((time) => {
                    if (time === 0) {
                        clearInterval(interval);
                        router.back();
                        setSelect([]);
                        return 0;
                    } else return 180 - timePassed;
                });
            }, 1000);
        };
        startCountdown();

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    const handleNext = async () => {
        dispatch(
            cartTicketComboValue({
                combos: select.map(({ variants, ...rest }) => rest),
                price: listTicket.price + price,
            }),
        );
        await cancelHold(listTicket.showTime, listTicket.seats);
        router.replace('/payTicket');
    };

    return (
        <Fragment>
            <BackIcon
                action={
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: '500', marginStart: 10 }}>Combo</Text>
                        <View style={styles.time}>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: '#663399' }}>
                                {`${Math.floor(time / 60)}`.padStart(2, 0)} : {`${time % 60}`.padStart(2, 0)}
                            </Text>
                        </View>
                    </View>
                }
            />
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.titleContant}>
                        <Ionicons name="fast-food-outline" size={24} color="white" />
                        <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>Combo</Text>
                    </View>
                    {combo.map((item, index) => {
                        return (
                            <ComboItem
                                key={index}
                                item={item}
                                value={selectCombo[index]?.quantity}
                                handleMinus={() => handleMinus(index, 'combo')}
                                handleAdd={() => handleAdd(index, 'combo')}
                            />
                        );
                    })}
                    <View style={[styles.titleContant, { marginTop: 10 }]}>
                        <Ionicons name="restaurant-outline" size={24} color="white" />
                        <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>THức ăn lẻ</Text>
                    </View>
                    {food.map((item, index) => {
                        return (
                            <ComboItem
                                key={index}
                                item={item}
                                value={selectFood[index]?.quantity}
                                handleMinus={() => handleMinus(index, 'food')}
                                handleAdd={() => handleAdd(index, 'food')}
                            />
                        );
                    })}
                </View>
            </ScrollView>
            <View style={styles.selectContant}>
                {select.length > 0 && (
                    <View style={{ marginBottom: 10 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ height: 'auto' }}>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                {select.map((item, i) => {
                                    return (
                                        <MiniComboPay
                                            key={i}
                                            item={item}
                                            handleCloseItem={() => handleCloseItem(item)}
                                        />
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                )}
                <PayContainer selectSeat={seats} priceSeat={listTicket.price + price} handleNext={handleNext} />
            </View>
        </Fragment>
    );
};

export default React.memo(ComboList);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    titleContant: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#3a2a62',
        flexDirection: 'row',
        gap: 5,
    },
    selectContant: {
        // minHeight: 160,
        // position: 'absolute',
        backgroundColor: '#f8f8f8',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    time: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#663399',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 3,
    },
});
