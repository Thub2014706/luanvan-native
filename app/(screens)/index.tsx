import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ImageBase from '~/components/ImageBase/ImageBase';
import { detailInfomation } from '~/services/InformationService';
import { useDispatch, useSelector } from 'react-redux';
import { listFilmBySchedule } from '~/services/FilmService';
import { HEIGHT, statusShowTime, WIDTH } from '~/constants';
import SlideImage from '~/components/SlideImage/SlideImage';
import UpcomingFilm from '~/components/UpcomingFilm/UpcomingFilm';
import { io } from 'socket.io-client';
import { setNumberChat, setSocketConnection } from '~/redux/socket/socketSlide';
import { SocketContext } from '../SocketContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { detailPopup } from '~/services/PopupService';
import Carousel from '~/components/Carousel/Carousel';
import { detailGenre } from '~/services/GenreService';

const Home = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [search, setSearch] = useState('');
    const [info, setInfo] = useState(null);
    const dispatch = useDispatch();
    const [films1, setFilms1] = useState([]);
    const socket = useContext(SocketContext);

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

        const fetchFilm = async () => {
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
        fetchFilm();
    }, []);
    console.log(films1);

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
                    {films1?.length > 0 && <Carousel data={films1} />}
                </View>
            </ScrollView>
        </React.Fragment>
    );
};

export default React.memo(Home);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3a2a62',
        height: HEIGHT + 200,
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
