import { View, Text, TextInput, StyleSheet, ScrollView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import ImageBase from '~/components/ImageBase/ImageBase';
import { detailInfomation } from '~/services/InformationService';
import { useDispatch } from 'react-redux';
import { listFilmBySchedule } from '~/services/FilmService';
import { HEIGHT, statusShowTime } from '~/constants';
import SlideImage from '~/components/SlideImage/SlideImage';
import UpcomingFilm from '~/components/UpcomingFilm/UpcomingFilm';

const Home = () => {
    const [search, setSearch] = useState('');
    const [info, setInfo] = useState(null);
    const dispatch = useDispatch();
    const [films1, setFilms1] = useState([]);

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

    const onChangeText = (e) => {
        setSearch(e);
    };

    if (!info) {
        return <Text>Loading...</Text>;
    }
    // console.log(films1);

    return (
        <ScrollView>
            <View style={styles.headerLogo}>
                <ImageBase
                    pathImg={info.image}
                    style={{ width: 'auto', height: 35, flex: 1, alignItems: 'center' }}
                    resizeMode="contain"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={search}
                    placeholder="Tìm kiếm phim, rạp..."
                    placeholderTextColor="#aaa"
                />
            </View>
            <SlideImage />
            {films1?.length > 0 && <UpcomingFilm films1={films1} />}
        </ScrollView>
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
        width: 100,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: '#aaa',
        borderRadius: 20,
        flex: 2,
        color: 'white',
    },
});
