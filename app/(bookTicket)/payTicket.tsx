import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { Link, router, useFocusEffect } from 'expo-router';
import { detailDiscount } from '~/services/DiscountService';
import { clearAllTicket, discountValue, removeDiscount } from '~/redux/cart/cartSlice';
import Toast from 'react-native-toast-message';
import { detailUserById } from '~/services/UserService';
import { cancelHold, holdPay } from '~/services/RedisService';
import { addOrderTicket } from '~/services/OrderTicketService';
import { checkStatus, momoPaymentTicket } from '~/services/MomoService';
import { WebView } from 'react-native-webview';
import { createAxios } from '~/createInstance';
import { loginSuccess } from '~/redux/auth/authSlice';

const PayTicket = () => {
    const listTicket = useSelector((state) => state.cart.cartTicket);
    const discount = useSelector((state) => state.cart.discount);
    const user = useSelector((state) => state.auth.login.currentUser);
    const [detailUser, setDetailUser] = useState(null);
    const [showTime, setShowTime] = useState();
    const [seats, setSeats] = useState([]);
    const [price, setPrice] = useState(listTicket.price);
    const [priceTicket, setPriceTicket] = useState();
    const [priceCombo, setPriceCombo] = useState();
    const [detailDis, setDetailDis] = useState(null);
    const dispatch = useDispatch();
    const [isComingBack, setIsComingBack] = useState(false);
    const [point, setPoint] = useState(0);
    // const timeoutRef = useRef(null);
    const [time, setTime] = useState(180);
    const [timePay, setTimePay] = useState(180);
    const [maxPoint, setMaxPoint] = useState();
    const [switchPoint, setSwitchPoint] = useState(false);
    const [flag, setFlag] = useState(false);
    const [orderId, setOrderId] = useState(null);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    useEffect(() => {
        const fetch = async () => {
            const data = await detailUserById(user?.data.id);
            setDetailUser(data);
        };
        fetch();
    }, [user]);

    useEffect(() => {
        const fetch = async () => {
            const data = await holdPay({
                showTime: listTicket.showTime,
                seatId: listTicket.seats,
                userId: user?.data.id,
            });
            // console.log(data);
            setTimePay(data);
        };
        fetch();
    }, [listTicket, user]);

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

    useFocusEffect(
        useCallback(() => {
            const fetch = async () => {
                if (isComingBack) {
                    if (discount !== null) {
                        setPoint(0);
                        setSwitchPoint(false);
                        const data = await detailDiscount(discount);
                        setDetailDis(data);
                    } else {
                        setDetailDis(null);
                    }
                } else {
                    setIsComingBack(true);
                    dispatch(removeDiscount());
                }
            };
            fetch();
        }, [discount]),
    );

    useEffect(() => {
        const fetch = async () => {
            const result1 =
                listTicket.price - point - (detailDis !== null ? listTicket.price * (detailDis.percent / 100) : 0);
            setPrice(result1);
            const result2 = (listTicket.price - (detailDis ? listTicket.price * (detailDis.percent / 100) : 0)) * 0.9;
            setMaxPoint(result2);
        };
        fetch();
    }, [listTicket.price, detailDis, point]);
    // console.log(orderId);

    const handleSwitch = () => {
        if (switchPoint) {
            setSwitchPoint(false);
            setPoint(0);
        } else {
            setSwitchPoint(true);
            setPoint(maxPoint);
        }
    };

    // const handlePoint = (val) => {
    //     if (timeoutRef.current) {
    //         clearTimeout(timeoutRef.current);
    //     }
    //     const value = Number(val);

    //     setPoint(value);
    //     timeoutRef.current = setTimeout(() => {
    //         if (value < 20000 && value > 0) {
    //             Toast.show({
    //                 type: 'error',
    //                 text1: 'Điểm thanh toán phải tối thiểu 20.000đ',
    //                 text2: null,
    //             });
    //             // showToast('Điểm thanh toán phải tối thiểu 20.000đ', 'warning');
    //         } else if (value > detailUser.point) {
    //             Toast.show({
    //                 type: 'error',
    //                 text1: 'Điểm thanh toán đã vượt quá số điểm của bạn',
    //                 text2: null,
    //             });
    //             // showToast('Điểm thanh toán đã vượt quá số điểm của bạn', 'warning');
    //         } else if (value > listTicket.price * (detailDis ? 1 - detailDis?.percent / 100 : 1) * 0.9) {
    //             Toast.show({
    //                 type: 'error',
    //                 text1: 'Điểm thanh toán đã vượt quá 90% số tiền thanh toán',
    //                 text2: null,
    //             });
    //             // showToast('Điểm thanh toán đã vượt quá 90% số tiền thanh toán', 'warning');
    //         } else setUsePoint(value);
    //     }, 700);
    // };

    // console.log(orderId);

    // useEffect(() => {
    //     let interval;
    //     let startTime = Date.now();
    //     const startCountdown = () => {
    //         interval = setInterval(async () => {
    //             const timePassed = Math.floor((Date.now() - startTime) / 1000);
    //             const remainingTime = timePay - timePassed;

    //             if (orderId !== null && !flag) {
    //                 setFlag(true);
    //                 clearInterval(interval);
    //                 const check = await checkStatus({ orderId });
    //                 console.log(check);

    //                 if (check.resultCode === 0) {
    //                     Alert.alert('Thông báo', 'Giao dịch thành công. Đến trang lịch sử để xem lại giao dịch nhé!', [
    //                         {
    //                             text: 'Đồng ý',
    //                             onPress: async () => {
    //                                 dispatch(clearAllTicket());
    //                                 router.navigate('/');
    //                                 await cancelHold(listTicket.showTime, listTicket.seats);
    //                                 setFlag(true);
    //                             },
    //                         },
    //                     ]);
    //                 } else if (check.resultCode === 1000) {
    //                     // Alert.alert('Thông báo', 'Bạn đang trong quá trình giao dịch, hãy tiếp tục thanh toán!', [
    //                     //     {
    //                     //         text: 'Đồng ý',
    //                     //         onPress: () => {
    //                     //             setFlag(true);
    //                     //         },
    //                     //     },
    //                     // ]);
    //                     console.log('Đang xử lý giao dịch... sẽ tiếp tục kiểm tra');
    //                 } else if (check.resultCode !== 0 && check.resultCode !== 1000) {
    //                     Alert.alert('Thông báo', 'Giao dịch thất bại. Vui lòng thực hiện giao dịch mới!', [
    //                         {
    //                             text: 'Đóng',
    //                             onPress: async () => {
    //                                 await cancelHold(listTicket.showTime, listTicket.seats);
    //                                 setFlag(true);
    //                                 dispatch(clearAllTicket());
    //                                 router.navigate('/');
    //                             },
    //                         },
    //                     ]);
    //                 } else {
    //                     interval = setInterval(startCountdown, 3000);
    //                 }
    //             } else {
    //                 if (remainingTime <= 0 && !flag) {
    //                     setFlag(true);
    //                     clearInterval(interval);
    //                     setTime(0);
    //                     Alert.alert(
    //                         'Thông báo',
    //                         'Đã quá thời gian thực hiện giao dịch của bạn. Vui lòng thực hiện giao dịch mới!',
    //                         [
    //                             {
    //                                 text: 'Đóng',
    //                                 onPress: () => {
    //                                     dispatch(clearAllTicket());
    //                                     router.replace('/');
    //                                     setFlag(true);
    //                                 },
    //                             },
    //                         ],
    //                     );
    //                     // console.log(time);
    //                 } else if (remainingTime > 0) {
    //                     setTime(timePay - timePassed);
    //                 }
    //             }
    //         }, 1000);
    //     };
    //     startCountdown();

    //     return () => {
    //         if (interval) {
    //             clearInterval(interval);
    //         }
    //     };
    // }, [timePay, flag, dispatch, orderId]);

    useEffect(() => {
        let interval;
        let startTime = Date.now();
    
        const checkAndHandleStatus = async () => {
            const check = await checkStatus({ orderId });
            console.log(check);
    
            if (check.resultCode === 0) {
                clearInterval(interval);
                Alert.alert('Thông báo', 'Giao dịch thành công. Đến trang lịch sử để xem lại giao dịch nhé!', [
                    {
                        text: 'Đồng ý',
                        onPress: async () => {
                            dispatch(clearAllTicket());
                            router.replace('/(history)/history');
                            await cancelHold(listTicket.showTime, listTicket.seats);
                            setFlag(true);
                        },
                    },
                ]);
            } else if (check.resultCode === 1000) {
                console.log('Đang xử lý giao dịch... sẽ tiếp tục kiểm tra');
                // Không dừng interval, để tiếp tục kiểm tra mỗi giây
            } else {
                clearInterval(interval);
                Alert.alert('Thông báo', 'Giao dịch thất bại. Vui lòng thực hiện giao dịch mới!', [
                    {
                        text: 'Đóng',
                        onPress: async () => {
                            await cancelHold(listTicket.showTime, listTicket.seats);
                            setFlag(true);
                            dispatch(clearAllTicket());
                            router.replace('/');
                        },
                    },
                ]);
            }
        };
    
        const startCountdown = () => {
            interval = setInterval(async () => {
                const timePassed = Math.floor((Date.now() - startTime) / 1000);
                const remainingTime = timePay - timePassed;
    
                console.log(orderId, flag);
                
                if (orderId !== null) {
                    setFlag(true);
                    await checkAndHandleStatus();
                } else {
                    if (remainingTime <= 0 && !flag) {
                        setFlag(true);
                        clearInterval(interval);
                        setTime(0);
                        Alert.alert(
                            'Thông báo',
                            'Đã quá thời gian thực hiện giao dịch của bạn. Vui lòng thực hiện giao dịch mới!',
                            [
                                {
                                    text: 'Đóng',
                                    onPress: () => {
                                        dispatch(clearAllTicket());
                                        router.replace('/');
                                        setFlag(true);
                                    },
                                },
                            ],
                        );
                    } else if (remainingTime > 0) {
                        setTime(remainingTime);
                    }
                }
            }, 1000);
        };
    
        startCountdown();
    
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [timePay, flag, dispatch, orderId]);
    

    // useEffect(() => {
    //     const fetch = async () => {
    //         if (orderId !== null) {
    //             const check = await checkStatus({ orderId });
    //             console.log(check);

    //             if (check.resultCode === 0) {
    //                 Alert.alert('Thông báo', 'Giao dịch thành công. Đến trang lịch sử để xem lại giao dịch nhé!', [
    //                     {
    //                         text: 'Đồng ý',
    //                         onPress: () => {
    //                             dispatch(clearAllTicket());
    //                             router.navigate('/');
    //                             setFlag(true);
    //                         },
    //                     },
    //                 ]);
    //             } else {
    //                 Alert.alert('Thông báo', 'Giao dịch thất bại. Vui lòng thực hiện giao dịch mới!', [
    //                     {
    //                         text: 'Đóng',
    //                         onPress: () => {
    //                             dispatch(clearAllTicket());
    //                             router.navigate('/');
    //                             setFlag(true);
    //                         },
    //                     },
    //                 ]);
    //             }
    //         }
    //     };
    //     fetch();
    // }, [dispatch, orderId]);

    const alert = (text) => {
        Alert.alert('Thông báo', text, [
            {
                text: 'Đóng',
                onPress: () => {
                    console.log('OKK');
                },
            },
        ]);
    };
    // console.log((listTicket.price - point) * (listTicket.percent / 100));

    const handlePay = async () => {
        if (point < 20000 && point > 0) {
            alert('Điểm thanh toán phải tối thiểu 20.000đ');
        } else if (point > detailUser.point) {
            alert('Điểm thanh toán đã vượt quá số điểm của bạn');
        } else if (point > listTicket.price * (detailDis ? 1 - detailDis?.percent / 100 : 1) * 0.9) {
            alert('Điểm thanh toán đã vượt quá 90% số tiền thanh toán');
        } else {
            const data = await momoPaymentTicket({
                amount: price,
            });
            let dis;
            if (detailDis !== null) {
                dis = { id: discount, useDiscount: (listTicket.price - point) * (detailDis.percent / 100) };
            }

            await addOrderTicket(
                {
                    idOrder: data.orderId,
                    showTime: listTicket.showTime,
                    seat: listTicket.seats,
                    price,
                    discount: dis,
                    paymentMethod: 'momo',
                    member: user?.data.id,
                    combo: listTicket.combos.map(({ image, ...rest }) => rest),
                    usePoint: point,
                },
                user?.accessToken,
                axiosJWT,
            );
            setOrderId(data.orderId);
            Linking.openURL(data.payUrl);
            // window.location.href = data.payUrl;
        }
    };

    return (
        showTime && (
            <React.Fragment>
                <View style={{ zIndex: 100 }}>
                    <Toast topOffset={20} />
                </View>
                <BackIcon
                    action={
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flex: 1,
                            }}
                        >
                            <View
                                style={{
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
                            <View style={styles.time}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: '#663399' }}>
                                    {`${Math.floor(time / 60)}`.padStart(2, 0)} : {`${time % 60}`.padStart(2, 0)}
                                </Text>
                            </View>
                        </View>
                    }
                />
                <ScrollView>
                    <View style={styles.container}>
                        {/* thong tin phim */}
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
                                            {index < showTime.film.genre.length - 1 && <Text>, </Text>}
                                        </React.Fragment>
                                    ))}
                                </View>
                                <Age age={showTime.film.age} />
                            </View>
                        </View>

                        {/* thong tin ghe */}
                        <View style={styles.info}>
                            <Text style={{ fontWeight: '500', marginBottom: 10 }}>THÔNG TIN VÉ</Text>
                            <View style={[styles.inline, { marginBottom: 20, gap: 5, flexWrap: 'wrap' }]}>
                                {seats.map((item, index) => {
                                    return (
                                        <View style={styles.seatDecor} key={index}>
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

                        {/* thong tin combo */}
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
                                                    <Text>x{item.quantity}</Text>
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

                        {/* ma giam gia */}
                        <View style={styles.info}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                                <Text>Mã khuyến mãi</Text>
                                <Link href={'/discountList'}>
                                    {detailDis === null ? (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text style={{ color: 'gray' }}>Chọn mã khuyến mãi</Text>
                                            <Ionicons name="chevron-forward-outline" size={18} color="gray" />
                                        </View>
                                    ) : (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    padding: 2,
                                                    borderWidth: 0.5,
                                                    borderStyle: 'solid',
                                                    borderColor: '#663399',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Text style={{ color: '#663399', fontWeight: '300' }}>
                                                    Mã code: {detailDis.code}
                                                </Text>
                                            </View>
                                            <Ionicons name="chevron-forward-outline" size={18} color="gray" />
                                        </View>
                                    )}
                                </Link>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                <View style={styles.line}></View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                                <Text>Điểm tích lũy</Text>
                                <Text style={{ fontWeight: '300' }}>{detailUser?.point}P</Text>
                            </View>
                            {detailUser?.point < 20000 ||
                            listTicket.price * (detailDis ? 1 - detailDis?.percent / 100 : 1) * 0.9 < 20000 ? (
                                <Text style={{ color: '#ff7c7c', textAlign: 'justify' }}>
                                    Bạn không đủ điều kiện dùng điểm tích lũy do
                                    {detailUser?.point < 20000
                                        ? ' điểm tích lũy của bạn chưa đạt đến mức tối thiểu là 20000 P'
                                        : ' 90% giá trị đơn hàng của bạn nhỏ hơn 20.000 VNĐ'}
                                </Text>
                            ) : (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginTop: 10,
                                        alignItems: 'center',
                                    }}
                                >
                                    <TextInput
                                        style={[
                                            styles.input,
                                            {
                                                borderColor: !switchPoint ? 'gray' : '#c7c7c7',
                                                color: !switchPoint ? 'black' : '#c7c7c7',
                                            },
                                        ]}
                                        onChangeText={(value) => setPoint(value)}
                                        value={point === 0 ? '' : point.toString()}
                                        placeholder="Nhập tối thiểu 20000P"
                                        keyboardType="numeric"
                                        editable={!switchPoint}
                                        // enterKeyHint="next"
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text>Dùng {maxPoint} P</Text>
                                        <Switch
                                            trackColor={{ false: '#767577', true: '#663399' }}
                                            thumbColor={'#fdfaff'}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={() => handleSwitch()}
                                            value={switchPoint}
                                        />
                                    </View>
                                    {/* <Text style={{ fontWeight: '300' }}>{point}</Text> */}
                                </View>
                            )}
                        </View>

                        {/* chi tiet thanh toan */}
                        <View style={styles.info}>
                            <Text style={{ fontWeight: '500', marginBottom: 10 }}>CHI TIẾT THANH TOÁN</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ fontStyle: '300' }}>Tổng tiền</Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ fontStyle: '300' }}>
                                        {listTicket.price.toLocaleString('it-IT')} VNĐ
                                    </Text>
                                </View>
                            </View>

                            {detailDis && (
                                <View
                                    style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}
                                >
                                    <Text style={{ fontStyle: '300' }}>Giảm giá mã khuyến mãi</Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text style={{ fontStyle: '300', color: '#d99a00' }}>
                                            -{(listTicket.price * (detailDis.percent / 100)).toLocaleString('it-IT')}{' '}
                                            VNĐ
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {point > 0 && (
                                <View
                                    style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}
                                >
                                    <Text style={{ fontStyle: '300' }}>Giảm giá điểm tích lũy</Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text style={{ fontStyle: '300', color: '#d99a00' }}>
                                            -{point.toLocaleString('it-IT')} VNĐ
                                        </Text>
                                    </View>
                                </View>
                            )}

                            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                <View style={styles.line}></View>
                            </View>

                            <View
                                style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}
                            >
                                <Text style={{ fontWeight: '500' }}>Tổng thanh toán</Text>
                                <Text style={{ fontWeight: '500' }}>{price.toLocaleString('it-IT')} VNĐ</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.buttonContant}>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', paddingBottom: 10 }}>
                        <Text style={{ fontWeight: '500' }}>
                            Tổng thanh toán:{' '}
                            <Text style={{ color: '#663399', fontSize: 18 }}>{price.toLocaleString('it-IT')} VNĐ</Text>
                        </Text>
                    </View>
                    <TouchableWithoutFeedback onPress={handlePay}>
                        <View style={styles.button}>
                            <Text style={{ color: 'white', fontSize: 16 }}>Thanh toán với Momo</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </React.Fragment>
        )
    );
};

export default React.memo(PayTicket);

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
        backgroundColor: '#ececec',
    },
    time: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#663399',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 3,
    },
    input: {
        height: 35,
        borderWidth: 1,
        padding: 5,
        width: '50%',
        borderRadius: 5,
    },
    buttonContant: {
        bottom: 0,
        padding: 10,
        backgroundColor: 'white',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 50,
        shadowColor: 'black',
        borderTopColor: '#ececec',
        borderStyle: 'solid',
        borderTopWidth: 0.8,
    },
    button: {
        backgroundColor: '#3a2a62',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 15,
    },
});
