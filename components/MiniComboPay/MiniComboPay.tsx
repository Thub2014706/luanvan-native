import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import ImageBase from '../ImageBase/ImageBase';
import { Ionicons } from '@expo/vector-icons';
import { detailFood } from '~/services/FoodService';
import BackIcon from '../BackIcon/BackIcon';

const MiniComboPay = ({ item, handleCloseItem }) => {
    // console.log(item);
    const [data, setData] = useState();

    useEffect(() => {
        const fetch = async () => {
            if (item && item.variants) {
                const array = await Promise.all(
                    item.variants.map(async (food) => {
                        const foodData = await detailFood(food.food);
                        return { ...food, name: foodData.name };
                    }),
                );
                setData({ ...item, variants: array });
            } else if (item) {
                setData(item);
            }
        };
        fetch();
    }, [item]);

    return (
        data && (
            <View style={styles.container}>
                <ImageBase
                    pathImg={item.image}
                    style={{ height: '100%', width: '30%' }}
                    resizeMode="cover"
                    blurRadius={null}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5, flex: 1 }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: '80%' }}>
                        <Text numberOfLines={1} ellipsizeMode="tail">
                            <Text style={{ fontWeight: '500' }}>{data.quantity}x</Text> {item.name}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            {data.variants && (
                                <Text style={{ fontWeight: '300' }} numberOfLines={1} ellipsizeMode="tail">
                                    {data.variants.map((item) => `${item.quantity} ${item.name}`).join(' + ')}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View>
                        <Ionicons name="close-circle" onPress={() => handleCloseItem()} size={20} color="black" />
                    </View>
                </View>
            </View>
        )
    );
};

export default MiniComboPay;

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: 200,
        flexDirection: 'row',
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,
        // borderWidth: 0.5,
        backgroundColor: 'white',
        borderRadius: 5,
    },
});
