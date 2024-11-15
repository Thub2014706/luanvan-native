import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { searchFilm } from '~/services/FilmService';
import { lengthRoomByTheater, lengthSeatByTheater } from '~/services/TheaterService';
import ImageBase from '~/components/ImageBase/ImageBase';
import Age from '~/components/Age/Age';
import { detailGenre } from '~/services/GenreService';
import { HEIGHT, WIDTH } from '~/constants';
import { Ionicons } from '@expo/vector-icons';
import BackIcon from '~/components/BackIcon/BackIcon';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { pushData } from '~/redux/search/search';

const ResultSearch = () => {
    const { search } = useLocalSearchParams<{ search: string }>();
    const [searchValue, setSearchValue] = useState(search);
    const [searchChange, setSearchChange] = useState(search);
    const [theaters, setTheaters] = useState([]);
    const [films, setFilms] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetch = async () => {
            const data = await searchFilm(searchValue);
            const data1 = await Promise.all(
                data.theaters.map(async (item) => {
                    const lengthRoom = await lengthRoomByTheater(item._id);
                    const lengthSeat = await lengthSeatByTheater(item._id);
                    return { ...item, lengthRoom, lengthSeat };
                }),
            );
            console.log('aaaa', data1);
            const data2 = await Promise.all(
                data.films.map(async (item) => {
                    const genre = await Promise.all(
                        item.genre.map(async (mini) => {
                            const genreDetail = await detailGenre(mini);
                            return genreDetail.name;
                        }),
                    );
                    return { ...item, genre };
                }),
            );

            setTheaters(data1);
            setFilms(data2);
        };
        fetch();
    }, [searchValue]);

    const handleSearch = () => {
        dispatch(pushData(searchChange));
        setSearchValue(searchChange);
    };

    const handleFilm = (id) => {
        router.push({ pathname: '/details/[id]', params: { id } });
    };

    return (
        <React.Fragment>
            <BackIcon
                action={
                    <View style={styles.searchContant}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => setSearchChange(value)}
                            value={searchChange}
                            placeholder="Tìm kiếm phim, rạp..."
                            placeholderTextColor="#aaa"
                            enterKeyHint={'enter'}
                        />
                        <Ionicons name="search-outline" size={18} color="gray" onPress={handleSearch} />
                    </View>
                }
            />
            <ScrollView>
                {films.length === 0 && theaters.length === 0 && (
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontWeight: '500', fontSize: 18 }}>Không có kết quả tìm kiếm!</Text>
                    </View>
                )}
                {films.length > 0 && (
                    <View style={{ gap: 10, flexDirection: 'column', padding: 10 }}>
                        <Text style={{ fontWeight: '500', fontSize: 18 }}>Kết quả tìm kiếm phim</Text>
                        <View style={{ gap: 10, flexDirection: 'column' }}>
                            {films.map((item) => {
                                return (
                                    <View key={item._id}>
                                        {/* <Link href={{ pathname: '/details/[id]', params: { id: item._id } }}> */}
                                        <TouchableWithoutFeedback onPress={() => handleFilm(item._id)}>
                                            <View style={styles.filmContant}>
                                                <ImageBase pathImg={item.image} style={{ width: 80, height: 130 }} />
                                                <View
                                                    style={{
                                                        paddingHorizontal: 10,
                                                        justifyContent: 'space-between',
                                                        paddingVertical: 5,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontWeight: '500',
                                                            fontSize: 16,
                                                            marginBottom: 5,
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                    <Text>Quốc gia: {item.nation}</Text>
                                                    <Text>Thời lượng: {item.time} phút</Text>
                                                    <View style={styles.inline}>
                                                        {item.genre.map((mini, index) => (
                                                            <Text key={index} style={styles.text}>
                                                                {mini}
                                                                {index < item.genre.length - 1 && ', '}
                                                            </Text>
                                                        ))}
                                                    </View>
                                                    <Age age={item.age} />
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        {/* </Link> */}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}
                {theaters.length > 0 && (
                    <View style={{ gap: 10, flexDirection: 'column', padding: 10 }}>
                        <Text style={{ fontWeight: '500', fontSize: 18 }}>Kết quả tìm kiếm rạp</Text>
                        <View style={{ gap: 10, flexDirection: 'column' }}>
                            {theaters.map((item) => {
                                return (
                                    <Link
                                        href={{
                                            pathname: '/(bookTicket)/theaterDetail/[id]',
                                            params: { id: item._id },
                                        }}
                                    >
                                        <View key={item._id} style={styles.theaterContant}>
                                            <ImageBase
                                                pathImg={item.image}
                                                style={{ width: WIDTH - 20, height: HEIGHT / 3.5 }}
                                            />
                                            <View style={styles.contentTheater}>
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
                                    </Link>
                                );
                            })}
                        </View>
                    </View>
                )}
            </ScrollView>
        </React.Fragment>
    );
};

export default React.memo(ResultSearch);

const styles = StyleSheet.create({
    theaterContant: {
        borderRadius: 5,
        overflow: 'hidden',
        position: 'relative',
    },
    inline: {
        flexDirection: 'row',
        marginBottom: 5,
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
    input: {
        color: 'black',
        // position: 'relative',
        flex: 1,
    },
    searchContant: {
        width: 80,
        // margin: 10,
        borderWidth: 1,
        paddingVertical: 5,
        borderColor: '#aaa',
        borderRadius: 20,
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5,
        paddingHorizontal: 10,
        marginHorizontal: 20,
    },
    filmContant: {
        flexDirection: 'row',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 6,
    },
});
