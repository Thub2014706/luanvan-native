import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ImageBase from '../ImageBase/ImageBase';
import { detailFood } from '~/services/FoodService';
import { Ionicons } from '@expo/vector-icons';

const ComboItem = ({ item, value, handleMinus, handleAdd }) => {
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
    console.log(item);

    return (
        data && (
            <View style={styles.container}>
                {/* <Image resizeMode='contain' /> */}
                <ImageBase pathImg={data.image} style={{ height: 100, width: '30%' }} resizeMode="contain" />
                <View style={styles.group}>
                    <View style={styles.content}>
                        <Text style={{ fontWeight: '500', fontSize: 16 }}>{data.name}</Text>
                        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                            {data.variants &&
                                data.variants.map((food, index) => (
                                    <Text style={{ fontWeight: '300' }}>
                                        {food.quantity} {food.name}
                                        {index < data.variants.length - 1 && ' + '}
                                    </Text>
                                ))}
                        </View>
                        <Text style={{ fontWeight: '500', fontSize: 18, color: '#3a2a62', marginTop: 10 }}>
                            {item.price.toLocaleString('it-IT')} VNĐ
                        </Text>
                    </View>
                    <View style={styles.bar}>
                        <Ionicons name="add-circle-outline" size={28} color="#3a2a62" onPress={handleAdd} />
                        <Text style={{ fontSize: 16 }}>{value}</Text>
                        <Ionicons name="remove-circle-outline" size={28} color="#3a2a62" onPress={handleMinus} />
                    </View>
                </View>
            </View>
        )
    );
};

export default ComboItem;

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        width: '100%',
        flexDirection: 'row',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: 'white',
        elevation: 5,
        marginVertical: 5,
        // paddingEnd: 10
        // alignItems: 'space-between'
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    bar: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    group: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
});
