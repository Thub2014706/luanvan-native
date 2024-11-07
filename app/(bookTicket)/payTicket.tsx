import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BackIcon from '~/components/BackIcon/BackIcon';
import { detailShowTimeById } from '~/services/ShowTimeService';
import { detailTheater } from '~/services/TheaterService';
import { detailRoom } from '~/services/RoomService';
import moment from 'moment';
import { detailFilmBySchedule } from '~/services/FilmService';
import Age from '~/components/Age/Age';
import { WIDTH } from '~/constants';
import ImageBase from '~/components/ImageBase/ImageBase';
import { detailGenre } from '~/services/GenreService';
import { detailSeat } from '~/services/SeatService';
import { listCombo } from '~/services/ComboService';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const payTicket = () => {
    const listTicket = useSelector((state) => state.cart.cartTicket);
    const [showTime, setShowTime] = useState();
    const [seats, setSeats] = useState([]);
    const [priceTicket, setPriceTicket] = useState();
    const [priceCombo, setPriceCombo] = useState();
    const [detailDis, setDetailDis] = useState();
    const [selectDis, setSelectDis] = useState();
    // const [combos, setCombos] = useState([])

    useEffect(() => {
        const fetch = async () => {
            const dataShowTime = await detailShowTimeById(listTicket.showTime);
            const dataTheater = await detailTheater(dataShowTime.theater);
            const dataRoom = await detailRoom(dataShowTime.room);
            const dataFilm = await detailFilmBySchedule(dataShowTime.schedule);
            const arrayGenre = await Promise.all([
                Promise.all(dataFilm.genre.map(async (item) => (await detailGenre(item)).name)),
            ]);
            setShowTime({
                ...dataShowTime,
                theater: dataTheater.name,
                room: { name: dataRoom.name, type: dataRoom.type },
                film: { ...dataFilm, genre: arrayGenre },
            });
            // console.log(dataShowTime);
        };
        fetch();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            const data = await Promise.all(
                listTicket.seats.map(async (item) => {
                    const detail = await detailSeat(item);
                    return { row: detail.row, col: detail.col };
                }),
            );
            setSeats(data);
        };
        fetch();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            if (listTicket.combos.length > 0) {
                const sum = listTicket.combos.reduce((a, b) => a + b.price, 0);
                setPriceTicket(listTicket.price - sum);
                setPriceCombo(sum);
            } else {
                setPriceTicket(listTicket.price);
                setPriceCombo(0);
            }
        };
        fetch();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            if (selectDis) {
                setPoint(0);
                const data = await detailDiscount(selectDis);
                setDetailDis(data);
            } else {
                setDetailDis();
            }
        };
        fetch();
    }, [selectDis]);

    // console.log(listTicket);

    return (
        showTime && (
            <React.Fragment>
                <BackIcon
                    action={
                        <View
                            style={{
                                // flexDirection: 'col',
                                // justifyContent: 'space-between',
                                // alignItems: 'center',
                                // flex: 1,
                                marginStart: 10,
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: '500' }}>{showTime.theater}</Text>
                            <View>
                                <Text style={{ fontWeight: '300' }}>
                                    {showTime.room.name} ({showTime.room.type}), {showTime.timeStart} -{' '}
                                    {showTime.timeEnd}, {moment(showTime.date).format('DD/MM/YYYY')}
                                </Text>
                            </View>
                        </View>
                    }
                />
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.containerInfo}>
                            <ImageBase pathImg={showTime.film.image} style={{ width: 80, height: 130 }} />
                            <View style={styles.contentMain}>
                                <Text style={styles.title}>{showTime.film.name}</Text>
                                <Text style={styles.text}>Thời lượng: {showTime.film.time} phút</Text>
                                <View style={styles.inline}>
                                    {showTime.film.genre.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <Text key={item._id} style={styles.text}>
                                                {item}
                                            </Text>
                                            {index < showTime.film.genre.length - 1 && <Text> + </Text>}
                                        </React.Fragment>
                                    ))}
                                </View>
                                <Age age={showTime.film.age} />
                            </View>
                        </View>
                        <View style={styles.info}>
                            <Text style={{ fontWeight: '500', marginBottom: 10 }}>THÔNG TIN VÉ</Text>
                            <View style={[styles.inline, { marginBottom: 20, gap: 5, flexWrap: 'wrap' }]}>
                                {seats.map((item, index) => {
                                    return (
                                        <View style={styles.seatDecor}>
                                            <Text style={{ color: '#663399' }}>
                                                {String.fromCharCode(64 + item.row)}
                                                {item.col}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                <View style={styles.line}></View>
                            </View>
                            <View
                                style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}
                            >
                                <Text>Tổng</Text>
                                <Text>{priceTicket.toLocaleString('it-IT')} VNĐ</Text>
                            </View>
                        </View>

                        <View style={styles.info}>
                            <Text style={{ fontWeight: '500', marginBottom: 10 }}>THÔNG TIN BẮP NƯỚC</Text>
                            {listTicket.combos.length > 0 && (
                                <React.Fragment>
                                    <View style={{ marginBottom: 20 }}>
                                        {listTicket.combos.map((item, index) => {
                                            return (
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                    key={index}
                                                >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <ImageBase
                                                            pathImg={item.image}
                                                            style={{ width: 50, height: 50 }}
                                                            resizeMode="cover"
                                                            blurRadius={null}
                                                        />
                                                        <Text style={{ marginStart: 5 }}>{item.name}</Text>
                                                    </View>
                                                    <Text>{item.quantity}</Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                        <View style={styles.line}></View>
                                    </View>
                                </React.Fragment>
                            )}
                            <View
                                style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}
                            >
                                <Text>Tổng</Text>
                                <Text>{priceCombo.toLocaleString('it-IT')} VNĐ</Text>
                            </View>
                        </View>
                        <View style={styles.info}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>Mã khuyến mãi</Text>
                                <Link href={'/discountList'}>
                                    <View
                                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <Text style={{ color: 'gray' }}>Chọn mã khuyến mãi</Text>
                                        <Ionicons name="chevron-forward-outline" size={18} color="gray" />
                                    </View>
                                </Link>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </React.Fragment>
        )
    );
};

export default React.memo(payTicket);

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    contentMain: {
        padding: 10,
        width: WIDTH - 120,
    },
    title: {
        fontWeight: '500',
        marginBottom: 5,
    },
    containerInfo: {
        width: WIDTH - 20,
        borderRadius: 10,
        flexDirection: 'row',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: 'white',
        elevation: 5,
        // justifyContent: 'center'
    },
    inline: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    info: {
        padding: 10,
        borderRadius: 10,
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: 'white',
        elevation: 5,
        marginTop: 10,
    },
    seatDecor: {
        borderStyle: 'solid',
        borderRadius: 5,
        borderColor: '#663399',
        borderWidth: 1,
        paddingVertical: 2,
        paddingHorizontal: 10,
    },
    line: {
        width: '100%',
        height: 0.6,
        backgroundColor: '#989898',
    },
});
