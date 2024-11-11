import { View, Text, TextInput, StyleSheet, ScrollView, Image } from 'react-native';
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

const Home = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [search, setSearch] = useState('');
    const [info, setInfo] = useState(null);
    const dispatch = useDispatch();
    const [films1, setFilms1] = useState([]);
    const [pop, setPop] = useState(null);
    const socket = useContext(SocketContext);
    const [showUp, setShowUp] = useState(true);

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
        router.push({ pathname: '/(bookTicket)/search', params: { search } });
    };

    useEffect(() => {
        const fetchInfo = async () => {
            const data = await detailInfomation(dispatch);
            setInfo(data);
        };
        fetchInfo();

        const fetchFilm = async () => {
            const data = await listFilmBySchedule(statusShowTime[1]);
            // console.log('ss',data);

            setFilms1(data);
        };
        fetchFilm();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            const data = await detailPopup();
            if (data) {
                setPop(data.image);
            }
        };
        fetch();
    }, []);

    const onChangeText = (e) => {
        setSearch(e);
    };

    if (!info) {
        return <Text>Loading...</Text>;
    }

    return (
        <React.Fragment>
            <ScrollView>
                <View style={styles.headerLogo}>
                    <ImageBase
                        pathImg={info.image}
                        style={{ width: 'auto', height: 35, flex: 1, alignItems: 'center' }}
                        resizeMode="contain"
                    />
                    <View style={styles.searchContant}>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeText}
                            value={search}
                            placeholder="Tìm kiếm phim, rạp..."
                            placeholderTextColor="#aaa"
                            enterKeyHint={'enter'}
                        />
                        <Ionicons name="search-outline" size={18} color="gray" onPress={handleSearch} />
                    </View>
                </View>
                <SlideImage />
                {films1?.length > 0 && <UpcomingFilm films1={films1} />}
            </ScrollView>
            {pop !== null && showUp && (
                <View style={{ position: 'absolute', zIndex: 1000, transform: 'translate(-50%, 50%)', left: '50%' }}>
                    <View>
                        <ImageBase
                            pathImg={pop}
                            style={{
                                width: WIDTH - 20,
                                height: HEIGHT / 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                            }}
                            resizeMode="contain"
                        />
                        <Ionicons
                            name="close-circle-outline"
                            size={24}
                            color="white"
                            style={{ position: 'absolute', transform: 'translate(-50%, 50%)', right: '35%' }}
                            onPress={() => setShowUp(false)}
                        />
                    </View>
                </View>
            )}
        </React.Fragment>
    );
};

export default React.memo(Home);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'powderblue',
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
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: '#aaa',
        borderRadius: 20,
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5,
    },
});
