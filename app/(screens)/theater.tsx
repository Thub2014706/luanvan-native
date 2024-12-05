import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ImageBase from '~/components/ImageBase/ImageBase';
import { Ionicons } from '@expo/vector-icons';
import { listTheater } from '~/services/TheaterService';
import { HEIGHT, WIDTH } from '~/constants';
import { Link } from 'expo-router';

const theater = () => {
    const [theaters, setTheaters] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await listTheater();
            setTheaters(data);
        };
        fetch();
    }, []);

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={{ gap: 10, flexDirection: 'column' }}>
                    {theaters.map((item) => {
                        return (
                            <Link href={{ pathname: '/(bookTicket)/theaterDetail/[id]', params: { id: item._id } }}>
                                <View key={item._id} style={styles.theaterContant}>
                                    <ImageBase
                                        pathImg={item.image}
                                        style={{ width: WIDTH - 20, height: HEIGHT / 3.5 }}
                                    />
                                    <View style={styles.contentTheater}>
                                        <View style={{ width: WIDTH - 80 }}>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontWeight: '500',
                                                    fontSize: 18,
                                                    marginBottom: 5,
                                                }}
                                            >
                                                {item.name.toUpperCase()}
                                            </Text>
                                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                                <Ionicons name="business-outline" size={18} color="#f3ea28" />

                                                <Text style={{ color: 'white' }}>
                                                    {item.lengthRoom} phòng chiếu với {item.lengthSeat} ghế.
                                                </Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                                <Ionicons name="location-outline" size={18} color="#f3ea28" />
                                                <Text style={{ color: 'white' }}>
                                                    {item.address}, {item.ward}, {item.district}, {item.province}.
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Link>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
};

export default theater;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        paddingBottom: 100,
    },
    theaterContant: {
        borderRadius: 5,
        overflow: 'hidden',
        position: 'relative',
    },
    contentTheater: {
        position: 'absolute',
        bottom: 0,
        width: WIDTH - 20,
        height: '50%',
        backgroundColor: 'rgba(22, 82, 202, 0.4)',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});
