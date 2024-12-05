import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ticketRefundByOrder } from '~/services/TicketRefundService';
// import Barcode from 'react-native-barcode-builder';
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
    const { order } = useLocalSearchParams<{ order: string }>();
    const [orderDetail, setOrderDetail] = useState(null);
    const [refund, setRefund] = useState(null);
    // console.log(id);

    useEffect(() => {
        const fetch = async () => {
            const data = await detailOrderTicket(order);
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
                setOrderDetail({
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
    }, [order]);

    // console.log(order);
    useEffect(() => {
        const fetch = async () => {
            if (orderDetail !== null) {
                const data = await ticketRefundByOrder(orderDetail._id);
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
                        {order}
                    </Text>
                }
            />
            {orderDetail !== null && (
                <ScrollView>
                    <View style={styles.container}>
                        <View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                {/* <Barcode
                                    value={order}
                                    format="CODE128"
                                    // options={{ format: 'CODE128', background: 'white' }}
                                    // height={10}
                                    // width={2}
                                /> */}
                            </View>
                            <View style={{ alignItems: 'flex-start' }}>
                                <Text>
                                    Thời gian đặt vé: {moment(orderDetail.createdAt).format('HH:mm DD/MM/YYYY')}
                                </Text>
                                <Text>Hình thức đặt vé: {orderDetail.staff ? 'Đặt vé tại rạp' : 'Đặt vé online'}</Text>
                                {orderDetail.staff && <Text>Nhân viên đặt vé:</Text>}
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
                                        <View
                                            style={[styles.heading, orderDetail.combo.length > 0 && styles.lineRight]}
                                        >
                                            <Text style={{ fontWeight: '500', margin: 10 }}>SUẤT CHIẾU</Text>
                                        </View>
                                        {orderDetail.combo.length > 0 && (
                                            <View style={styles.heading}>
                                                <Text style={{ fontWeight: '500', margin: 10 }}>COMBO BẮP NƯỚC</Text>
                                            </View>
                                        )}
                                        {/* <Text style={styles.heading}>SUẤT CHIẾU</Text> */}
                                    </View>
                                    <View style={styles.body}>
                                        <View style={[styles.heading, styles.lineRight]}>
                                            <Text>{orderDetail.film.toUpperCase()}</Text>
                                        </View>
                                        <View
                                            style={[styles.heading, orderDetail.combo.length > 0 && styles.lineRight]}
                                        >
                                            <View
                                                style={{ margin: 10, justifyContent: 'center', alignItems: 'center' }}
                                            >
                                                <Text>Rạp: {orderDetail.theater}</Text>
                                                <Text>
                                                    Phòng: {orderDetail.room.name} ({orderDetail.room.type})
                                                </Text>
                                                <Text>
                                                    Ghế:{' '}
                                                    {orderDetail.seat.map((mini, index) => (
                                                        <Text key={index}>
                                                            {String.fromCharCode(64 + mini.row)}
                                                            {mini.col}
                                                            {index < orderDetail.seat.length - 1 && ', '}
                                                        </Text>
                                                    ))}
                                                </Text>
                                                <Text>
                                                    {moment(orderDetail.showTime.date).format('DD/MM/YYYY')}{' '}
                                                    {orderDetail.showTime.timeStart} - {orderDetail.showTime.timeEnd}
                                                </Text>
                                            </View>
                                        </View>
                                        {orderDetail.combo.length > 0 && (
                                            <View style={styles.heading}>
                                                {orderDetail.combo.map((mini) => (
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
                                                    {(orderDetail.usePoint > 0 || orderDetail.discount) && (
                                                        <Text>
                                                            Tổng:{' '}
                                                            {(
                                                                orderDetail.usePoint +
                                                                (ordorderDetailr.discount
                                                                    ? orderDetail.discount.useDiscount
                                                                    : 0) +
                                                                orderDetail.price
                                                            ).toLocaleString('it-IT')}{' '}
                                                            VNĐ
                                                        </Text>
                                                    )}
                                                    {orderDetail.usePoint > 0 && (
                                                        <Text>
                                                            Điểm thanh toán: -
                                                            {orderDetail.usePoint.toLocaleString('it-IT')} VNĐ
                                                        </Text>
                                                    )}
                                                    {orderDetail.discount && (
                                                        <Text>
                                                            Mã khuyến mãi: -
                                                            {orderDetail.discount.useDiscount.toLocaleString('it-IT')}{' '}
                                                            VNĐ
                                                        </Text>
                                                    )}
                                                    <Text>
                                                        Tổng thanh toán: {orderDetail.price.toLocaleString('it-IT')} VNĐ
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
