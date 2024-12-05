import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ImageBase from '~/components/ImageBase/ImageBase';
import { detailInfomation } from '~/services/InformationService';
import { useDispatch, useSelector } from 'react-redux';
import { listFilmBySchedule } from '~/services/FilmService';
import { HEIGHT, statusShowTime, WIDTH } from '~/constants';
import SlideImage from '~/components/SlideImage/SlideImage';
import { setNumberChat, setSocketConnection } from '~/redux/socket/socketSlide';
import { SocketContext } from '../SocketContext';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { detailPopup } from '~/services/PopupService';
import Carousel from '~/components/Carousel/Carousel';
import { detailGenre } from '~/services/GenreService';
import moment from 'moment';
import { listEvent } from '~/services/EventService';

const Home = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [info, setInfo] = useState(null);
    const dispatch = useDispatch();
    const [films1, setFilms1] = useState([]);
    const [films2, setFilms2] = useState([]);
    const socket = useContext(SocketContext);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (user && socket) {
            socket.emit('number', user.data.id);
            socket.on('numberFirst', (num) => {
                dispatch(setNumberChat(num));
            });

            socket.on('removeNumber', (num) => {
                dispatch(setNumberChat(num));
            });

            socket.on('addNumber', (num) => {
                dispatch(setNumberChat(num));
            });
            // dispatch(setSocketConnection(socket));

            return () => {
                socket.off('numberFirst');
                socket.off('removeNumber');
                socket.off('addNumber');
                // socket.disconnect()
            };
        }
    }, [user, dispatch, socket]);

    const handleSearch = () => {
        router.push({ pathname: '/(bookTicket)/search' });
    };

    useEffect(() => {
        const fetchInfo = async () => {
            const data = await detailInfomation(dispatch);
            setInfo(data);
        };
        fetchInfo();

        const fetchFilm1 = async () => {
            const data = await listFilmBySchedule(statusShowTime[1]);
            const dataResult = await Promise.all(
                data.map(async (item) => {
                    const genre = await Promise.all(
                        item.genre.map(async (mini) => {
                            const genreDetail = await detailGenre(mini);
                            return genreDetail.name;
                        }),
                    );
                    return { ...item, genre };
                }),
            );
            setFilms1(dataResult);
        };
        fetchFilm1();

        const fetchFilm2 = async () => {
            const data = await listFilmBySchedule(statusShowTime[2]);
            const dataResult = await Promise.all(
                data.map(async (item) => {
                    const genre = await Promise.all(
                        item.genre.map(async (mini) => {
                            const genreDetail = await detailGenre(mini);
                            return genreDetail.name;
                        }),
                    );
                    return { ...item, genre };
                }),
            );
            setFilms2(dataResult);
        };
        fetchFilm2();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            const data = await listEvent();
            setEvents(data);
        };
        fetch();
    }, []);

    if (!info) {
        return <Text>Loading...</Text>;
    }

    return (
        <React.Fragment>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.headerLogo}>
                        <ImageBase
                            pathImg={info.image}
                            style={{ width: 'auto', height: 35, flex: 1, alignItems: 'center' }}
                            resizeMode="contain"
                        />
                        <TouchableWithoutFeedback onPress={handleSearch}>
                            <View style={styles.searchContant}>
                                <Text style={{ color: '#aaa' }}>Tìm kiếm phim, rạp...</Text>
                                <Ionicons name="search-outline" size={18} color="gray" />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <SlideImage />
                    {/* {films1?.length > 0 && <UpcomingFilm films1={films1} />} */}
                    <View style={{ backgroundColor: '#3a2a62', paddingVertical: 20 }}>
                        {films1?.length > 0 && <Carousel data={films1} />}
                    </View>
                    <View style={{ marginTop: 20, paddingHorizontal: 5 }}>
                        <Text style={{ fontSize: 18, fontWeight: '500' }}>PHIM SẮP CHIẾU</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ marginTop: 5, flexDirection: 'row', gap: 10 }}>
                                {films2.map((item, index) => {
                                    return (
                                        <Link
                                            href={{ pathname: '/(bookTicket)/details/[id]', params: { id: item._id } }}
                                            key={index}
                                        >
                                            <View style={{ width: 150 }}>
                                                <ImageBase
                                                    pathImg={item.image}
                                                    style={{ width: 150, height: 230, borderRadius: 10 }}
                                                />
                                                <Text
                                                    style={{
                                                        color: '#3a2a62',
                                                        textAlign: 'center',
                                                        fontWeight: '500',
                                                        marginTop: 5,
                                                    }}
                                                >
                                                    {moment(item.releaseDate).format('DD/MM/YYYY')}
                                                </Text>
                                            </View>
                                        </Link>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                    <View style={{ marginTop: 20, paddingHorizontal: 5 }}>
                        <Text style={{ fontSize: 18, fontWeight: '500' }}>SỰ KIỆN</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ marginTop: 5, flexDirection: 'row', gap: 10 }}>
                                {events.map((item) => {
                                    return (
                                        <Link
                                            href={{ pathname: '/eventDetail/[id]', params: { id: item._id } }}
                                            key={item._id}
                                        >
                                            <View style={{ width: 200 }}>
                                                <ImageBase pathImg={item.image} style={{ height: 200, width: 200 }} />
                                                <Text
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                    style={{
                                                        color: '#3a2a62',
                                                        textAlign: 'center',
                                                        fontWeight: '500',
                                                        marginTop: 5,
                                                    }}
                                                >
                                                    {item.title}
                                                </Text>
                                            </View>
                                        </Link>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        </React.Fragment>
    );
};

export default React.memo(Home);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#3a2a62',
        // minHeight: HEIGHT + 200,
        paddingBottom: 100,
    },
    headerLogo: {
        backgroundColor: '#141831',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        color: 'white',
        // position: 'relative',
        flex: 1,
    },
    searchContant: {
        width: 100,
        margin: 10,
        borderWidth: 1,
        padding: 7,
        borderColor: '#aaa',
        borderRadius: 20,
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5,
    },
});
