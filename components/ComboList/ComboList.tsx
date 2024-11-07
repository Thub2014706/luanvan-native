import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { listCombo } from '~/services/ComboService';
import { listFood } from '~/services/FoodService';
import ComboItem from '~/components/ComboItem/ComboItem';
import { Ionicons } from '@expo/vector-icons';
import PayContainer from '~/components/PayContainer/PayContainer';
import { detailSeat } from '~/services/SeatService';
import MiniComboPay from '~/components/MiniComboPay/MiniComboPay';
import { transform } from '@babel/core';
import BackIcon from '~/components/BackIcon/BackIcon';

const ComboList = () => {
    const listTicket = useSelector((state) => state.cart.cartTicket);
    const [combo, setCombo] = useState([]);
    const [selectCombo, setSelectCombo] = useState([]);
    const [select, setSelect] = useState([]);
    const [food, setFood] = useState([]);
    const [seats, setSeats] = useState([]);
    const [selectFood, setSelectFood] = useState([]);

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

    const handleNext = () => {};

    return (
        <Fragment>
            <BackIcon action={
                <Text  style={{ fontSize: 18, fontWeight: '500', marginStart: 10 }} numberOfLines={1} ellipsizeMode="tail"></Text>
            } />
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
            <View>
                <View style={styles.selectContant}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ height: 'auto' }}>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            {select.map((item, i) => {
                                return <MiniComboPay key={i} item={item} handleCloseItem={() => handleCloseItem(item)} />;
                            })}
                        </View>
                    </ScrollView>
                </View>
                <PayContainer selectSeat={seats} priceSeat={listTicket.price} handleNext={handleNext} />
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
        height: 160,
        // position: 'absolute',
        backgroundColor: '#f8f8f8',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
});
