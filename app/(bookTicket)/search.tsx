import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { searchFilm } from '~/services/FilmService';
import { lengthRoomByTheater, lengthSeatByTheater } from '~/services/TheaterService';
import ImageBase from '~/components/ImageBase/ImageBase';
import Age from '~/components/Age/Age';
import { detailGenre } from '~/services/GenreService';
import { WIDTH } from '~/constants';

const Search = () => {
    const { search } = useLocalSearchParams<{ search: string }>();

    const [theaters, setTheaters] = useState([]);
    const [films, setFilms] = useState([]);
    // console.log('aaaa',search);

    useEffect(() => {
        const fetch = async () => {
            const data = await searchFilm(search);
            const data1 = await Promise.all(
                data.theaters.map(async (item) => {
                    const lengthRoom = await lengthRoomByTheater(item._id);
                    const lengthSeat = await lengthSeatByTheater(item._id);
                    return { ...item, lengthRoom, lengthSeat };
                }),
            );
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
    }, [search]);

    return (
        <View>
            {films.length === 0 && theaters.length === 0 && <Text>Không có kết quả tìm kiếm!</Text>}
            {films.length > 0 && (
                <React.Fragment>
                    <Text>Kết quả tìm kiếm phim</Text>
                    <View style={{ gap: 10, flexDirection: 'column' }}>
                        {films.map((item) => {
                            return (
                                <View style={styles.filmContant}>
                                    <ImageBase pathImg={item.image} style={{ width: 80, height: 130 }} />
                                    <View style={{ padding: 10 }}>
                                        <Text>{item.name}</Text>
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
                            );
                        })}
                    </View>
                </React.Fragment>
            )}
            {theaters.length > 0 && (
                <React.Fragment>
                    <Text>Kết quả tìm kiếm rạp</Text>
                    <View style={{ gap: 10, flexDirection: 'column' }}>
                        {theaters.map((item) => {
                            return (
                                <View style={styles.filmContant}>
                                    <ImageBase pathImg={item.image} style={{ width: WIDTH - 20, height: 'auto' }} />
                                    <View style={{ padding: 10 }}>
                                        <Text>{item.name}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </React.Fragment>
            )}
        </View>
    );
};

export default React.memo(Search);

const styles = StyleSheet.create({
    filmContant: {
        flexDirection: 'row',
        borderRadius: 5,
    },
    inline: {
        flexDirection: 'row',
        marginBottom: 5,
    },
});
