import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { listCombo } from '~/services/ComboService';
import { listFood } from '~/services/FoodService';
import ComboItem from '~/components/ComboItem/ComboItem';

const comboList = () => {
    const listTicket = useSelector((state) => state.cart.cartTicket);
    const [combo, setCombo] = useState([]);
    const [selectCombo, setSelectCombo] = useState([]);
    const [select, setSelect] = useState([]);
    const [food, setFood] = useState([]);
    const [selectFood, setSelectFood] = useState([]);

    // console.log(selectCombo, selectFood);

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

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text>Combo</Text>
                {combo.map((item, index) => {
                    return (
                        <ComboItem
                            key={item._id}
                            item={item}
                            value={selectCombo[index]?.quantity}
                            handleMinus={() => handleMinus(index, 'combo')}
                            handleAdd={() => handleAdd(index, 'combo')}
                        />
                    );
                })}
                <Text>Combo</Text>
                {food.map((item, index) => {
                    return (
                        <ComboItem
                            key={item._id}
                            item={item}
                            value={selectFood[index]?.quantity}
                            handleMinus={() => handleMinus(index, 'food')}
                            handleAdd={() => handleAdd(index, 'food')}
                        />
                    );
                })}
            </View>
        </ScrollView>
    );
};

export default comboList;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
});
