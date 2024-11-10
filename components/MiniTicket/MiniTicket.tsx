import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { signAge, standardAge, WIDTH } from '~/constants';
import moment from 'moment';
import ImageBase from '../ImageBase/ImageBase';
import { Link } from 'expo-router';

const MiniTicket = ({ item }) => {
    return (
        <View>
            <Text style={{ fontWeight: '500', fontSize: 16 }}>{item.item.idOrder}</Text>
            <View style={styles.mainContent}>
                <ImageBase pathImg={item.film.image} style={{ width: 100, height: 150 }} />
                <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: '500' }}>
                        {item.film.name} [{signAge[standardAge.findIndex((age) => age === item.film.age)]}]
                    </Text>
                    <Text>
                        {item.showTime.timeStart} - {item.showTime.timeEnd}{' '}
                        {moment(item.showTime.date).format('DD/MM/YYYY')}
                    </Text>
                    <Text>Rạp: {item.theater}</Text>
                    <Text>
                        Phòng: {item.room.name} ({item.room.type})
                    </Text>
                    <Text>
                        Ghế:{' '}
                        {item.seats.map((mini, index) => {
                            return (
                                <Text>
                                    {String.fromCharCode(64 + mini.row)}
                                    {mini.col}
                                    {index < item.seats.length - 1 && ', '}
                                </Text>
                            );
                        })}
                    </Text>
                    <Text>
                        Tổng thanh toán:{' '}
                        <Text style={{ color: '#3a2a62', fontWeight: '500' }}>
                            {item.item.price.toLocaleString('it-IT')} VNĐ
                        </Text>
                    </Text>
                    <Link href={{ pathname: '/(history)/details/[id]', params: { id: item.item.idOrder } }}>Chi tiết</Link>
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <View style={styles.line}></View>
            </View>
        </View>
    );
};

export default React.memo(MiniTicket);

const styles = StyleSheet.create({
    mainContent: {
        flexDirection: 'row',
    },
    line: {
        width: WIDTH - 20,
        height: 1,
        backgroundColor: '#989898',
    },
});
