import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ticketRefundByOrder } from '~/services/TicketRefundService';
import { Barcode } from 'expo-barcode-generator';
import { detailOrderTicket } from '../../../services/OrderTicketService';
import BackIcon from '~/components/BackIcon/BackIcon';
import moment from 'moment';
import { HEIGHT, WIDTH } from '~/constants';
import { detailShowTimeById } from '~/services/ShowTimeService';
import { detailFilm, detailFilmBySchedule } from '~/services/FilmService';
import { detailTheater } from '~/services/TheaterService';
import { detailRoom } from '~/services/RoomService';
import { detailSeat } from '~/services/SeatService';

const DetailTicket = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [order, setOrder] = useState(null);
    const [refund, setRefund] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const data = await detailOrderTicket(id);
            if (data) {
                const showTime = await detailShowTimeById(data.showTime);
                const film = await detailFilmBySchedule(showTime.schedule);
                const theater = await detailTheater(showTime.theater);
                const room = await detailRoom(showTime.room);
                const seats = await Promise.all(
                    data.seat.map(async (item) => {
                        const seat = await detailSeat(item);
                        return seat;
                    }),
                );
                // console.log('ccc', data.seats);
                setOrder({
                    ...data,
                    showTime,
                    film: film.name,
                    theater: theater.name,
                    room: { name: room.name, type: room.type },
                    seat: seats,
                });
            }
            // setOrder(data);
        };
        fetch();
    }, [id]);

    // console.log(order);
    useEffect(() => {
        const fetch = async () => {
            if (order !== null) {
                const data = await ticketRefundByOrder(order._id);
                if (data) {
                    setRefund(data);
                }
            }
        };
        fetch();
    }, [order]);

    return (
        <React.Fragment>
            <BackIcon
                action={
                    <Text
                        style={{ fontSize: 18, fontWeight: '500', marginStart: 10 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {id}
                    </Text>
                }
            />
            {order !== null && (
                <ScrollView>
                    <View style={styles.container}>
                        <View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Barcode
                                    value={id}
                                    options={{ format: 'CODE128', background: 'white' }}
                                    // height={10}
                                    // width={2}
                                />
                            </View>
                            <View style={{ alignItems: 'flex-start' }}>
                                <Text>Thời gian đặt vé: {moment(order.createdAt).format('HH:mm DD/MM/YYYY')}</Text>
                                <Text>Hình thức đặt vé: {order.staff ? 'Đặt vé tại rạp' : 'Đặt vé online'}</Text>
                                {order.staff && <Text>Nhân viên đặt vé:</Text>}
                                <Text>
                                    Trạng thái:{' '}
                                    {refund === null ? (
                                        <Text style={{ color: 'green' }}>Đã hoàn tất</Text>
                                    ) : (
                                        <Text style={{ color: 'red' }}>
                                            Đã hoàn vé ({moment(refund.createdAt).format('HH:mm DD/MM/YYYY')})
                                        </Text>
                                    )}
                                </Text>
                                <View style={styles.table}>
                                    <View style={styles.header}>
                                        <View style={[styles.heading, styles.lineRight]}>
                                            <Text style={{ fontWeight: '500', margin: 10 }}>PHIM</Text>
                                        </View>
                                        <View style={[styles.heading, order.combo.length > 0 && styles.lineRight]}>
                                            <Text style={{ fontWeight: '500', margin: 10 }}>SUẤT CHIẾU</Text>
                                        </View>
                                        {order.combo.length > 0 && (
                                            <View style={styles.heading}>
                                                <Text style={{ fontWeight: '500', margin: 10 }}>COMBO BẮP NƯỚC</Text>
                                            </View>
                                        )}
                                        {/* <Text style={styles.heading}>SUẤT CHIẾU</Text> */}
                                    </View>
                                    <View style={styles.body}>
                                        <View style={[styles.heading, styles.lineRight]}>
                                            <Text>{order.film.toUpperCase()}</Text>
                                        </View>
                                        <View style={[styles.heading, order.combo.length > 0 && styles.lineRight]}>
                                            <View
                                                style={{ margin: 10, justifyContent: 'center', alignItems: 'center' }}
                                            >
                                                <Text>Rạp: {order.theater}</Text>
                                                <Text>
                                                    Phòng: {order.room.name} ({order.room.type})
                                                </Text>
                                                <Text>
                                                    Ghế:{' '}
                                                    {order.seat.map((mini, index) => (
                                                        <Text key={index}>
                                                            {String.fromCharCode(64 + mini.row)}
                                                            {mini.col}
                                                            {index < order.seat.length - 1 && ', '}
                                                        </Text>
                                                    ))}
                                                </Text>
                                                <Text>
                                                    {moment(order.showTime.date).format('DD/MM/YYYY')}{' '}
                                                    {order.showTime.timeStart} - {order.showTime.timeEnd}
                                                </Text>
                                            </View>
                                        </View>
                                        {order.combo.length > 0 && (
                                            <View style={styles.heading}>
                                                {order.combo.map((mini) => (
                                                    <Text>
                                                        {mini.quantity} {mini.name.toUpperCase()}
                                                    </Text>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                    <View>
                                        <View style={[styles.header, { borderTopWidth: 0 }]}>
                                            <View style={styles.heading}>
                                                <Text style={{ fontWeight: '500', margin: 10 }}>TỔNG THANH TOÁN</Text>
                                            </View>
                                        </View>
                                        <View style={styles.body}>
                                            <View style={styles.heading}>
                                                <View
                                                    style={{
                                                        margin: 10,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {(order.usePoint > 0 || order.discount) && (
                                                        <Text>
                                                            Tổng:{' '}
                                                            {(
                                                                order.usePoint +
                                                                (order.discount ? order.discount.useDiscount : 0) +
                                                                order.price
                                                            ).toLocaleString('it-IT')}{' '}
                                                            VNĐ
                                                        </Text>
                                                    )}
                                                    {order.usePoint > 0 && (
                                                        <Text>
                                                            Điểm thanh toán: -{order.usePoint.toLocaleString('it-IT')}{' '}
                                                            VNĐ
                                                        </Text>
                                                    )}
                                                    {order.discount && (
                                                        <Text>
                                                            Mã khuyến mãi: -
                                                            {order.discount.useDiscount.toLocaleString('it-IT')} VNĐ
                                                        </Text>
                                                    )}
                                                    <Text>
                                                        Tổng thanh toán: {order.price.toLocaleString('it-IT')} VNĐ
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </React.Fragment>
    );
};

export default React.memo(DetailTicket);

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'white',
        // justifyContent: 'center',
        // alignItems: 'center',
        flex: 1,
        minHeight: HEIGHT,
    },
    header: {
        backgroundColor: '#f1f8ff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderStyle: 'solid',
    },
    text: { margin: 6, textAlign: 'center' },
    table: {
        width: WIDTH - 20,
        marginVertical: 20,
    },
    heading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderStyle: 'solid',
        borderTopWidth: 0,
        // width: WIDTH - 20,
    },
    lineRight: {
        borderRightWidth: 1,
        borderRightColor: 'gray',
        borderStyle: 'solid',
        // height: 100
    },
});
