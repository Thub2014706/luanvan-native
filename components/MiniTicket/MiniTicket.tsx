import { Alert, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { signAge, standardAge, WIDTH } from '~/constants';
import moment from 'moment';
import ImageBase from '../ImageBase/ImageBase';
import { Link, router } from 'expo-router';
import { ticketRefundByOrder } from '~/services/TicketRefundService';

const MiniTicket = ({ item, handleRefund }) => {
    const [refund, setRefund] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const data = await ticketRefundByOrder(item.item._id);
            if (data) {
                setRefund(data);
            }
        };
        fetch();
    }, [item.item._id]);

    const handleLink = (id) => {
        router.push({ pathname: '/(history)/ticket/[order]', params: { order: id } });
    };

    return (
        <View>
            <Text style={{ fontWeight: '500', fontSize: 16 }}>{item.item.idOrder}</Text>
            <View style={styles.mainContent}>
                <ImageBase pathImg={item.film.image} style={{ width: 100, height: 150 }} />
                <View style={{ paddingHorizontal: 10, justifyContent: 'space-between' }}>
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
                                <Text key={index}>
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
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                        <TouchableWithoutFeedback onPress={() => handleLink(item.item.idOrder)}>
                            <View
                                style={{
                                    backgroundColor: '#3a2a62',
                                    borderRadius: 5,
                                    paddingHorizontal: 15,
                                    alignSelf: 'baseline',
                                    paddingVertical: 5,
                                }}
                            >
                                <Text style={{ color: 'white' }}>Chi tiết</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        {refund === null && (
                            <View>
                                <TouchableWithoutFeedback onPress={handleRefund}>
                                    <View
                                        style={{
                                            backgroundColor: '#f3ea28',
                                            borderRadius: 5,
                                            paddingHorizontal: 15,
                                            alignSelf: 'baseline',
                                            paddingVertical: 5,
                                        }}
                                    >
                                        <Text>Hoàn vé</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        )}
                    </View>
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
