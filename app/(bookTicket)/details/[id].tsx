import { FlatList, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { detailFilm } from '~/services/FilmService';
import ImageBase from '~/components/ImageBase/ImageBase';
import { HEIGHT, nameDay, statusShowTime, WIDTH } from '~/constants';
import { detailGenre } from '~/services/GenreService';
import Age from '~/components/Age/Age';
import { detailDirector } from '~/services/DirectorService';
import { detailPerformer } from '~/services/PerformerService';
import { listShowTimeByFilm, soldOutSeat } from '~/services/ShowTimeService';
import { listProvince, listTheaterByProvince } from '~/services/TheaterService';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import RenderHTML from 'react-native-render-html';
import ScheduleMini from '~/components/ScheduleMini/ScheduleMini';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import BackIcon from '~/components/BackIcon/BackIcon';
import { useSelector } from 'react-redux';
import Loading from '~/components/Loading/Loading';
import ReviewFilm from '~/components/ReviewFilm/ReviewFilm';

const pickerStyle = {
    inputIOS: {
        // borderColor: 'gray',
        // borderWidth: 5,
        // borderStyle: 'solid',
        borderRadius: 5,
        backgroundColor: '#e1e1e1',
        marginVertical: 10,
        padding: 15,
    },
    placeholder: {
        color: 'black',
    },
    inputAndroid: {
        borderColor: 'gray',
        borderWidth: 5,
        borderStyle: 'solid',
        borderRadius: 10,
        backgroundColor: '#e1e1e1',
        marginTop: 10,
    },
};

const DetailFilm = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const { id } = useLocalSearchParams<{ id: string }>();
    const [film, setFilm] = useState(null);
    const [province, setProvince] = useState([]);
    const [selectPro, setSelectPro] = useState();
    const [theaters, setTheaters] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetch = async () => {
            const data = await detailFilm(id);
            const [arrayGenre, arrayDirector, arrayPerformer] = await Promise.all([
                Promise.all(data.genre.map(async (item) => (await detailGenre(item)).name)),
                Promise.all(data.director.map(async (item) => (await detailDirector(item)).name)),
                Promise.all(data.performer.map(async (item) => (await detailPerformer(item)).name)),
            ]);
            // console.log({ data, arrayGenre, arrayDirector, arrayPerformer });
            setFilm({ data, arrayGenre, arrayDirector, arrayPerformer });
        };
        fetch();
    }, [id]);

    const [selectDay, setSelectDay] = useState(0);
    const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

    const now = new Date();
    const array = [0, 1, 2, 3, 4, 5, 6];
    const week = [];

    array.forEach((item) => {
        const date = new Date(now);
        date.setDate(date.getDate() + item);
        // console.log(new Date());

        week.push({ date: date.getDate(), day: date.getDay(), full: moment(date).format('YYYY-MM-DD') });
    });

    const handleSelect = async (index, date) => {
        setSelectDay(index);
        setDate(date);
    };

    useEffect(() => {
        const fetch = async () => {
            const data = await listProvince();
            // setSelectPro(data[0].province);
            setProvince(data.map((item) => ({ value: item.province, label: item.province, key: item.province })));
        };
        fetch();
    }, []);
    // console.log(province);

    useEffect(() => {
        const fetch = async () => {
            if (selectPro) {
                const data = await listTheaterByProvince(selectPro);
                const data2 = await Promise.all(
                    data.map(async (item) => {
                        const showTimes = await listShowTimeByFilm(item._id, date, id);
                        const data3 = await Promise.all(
                            showTimes.map(async (mini) => {
                                const now = Date.now();
                                const currentDate = new Date(now);
                                const minutes = currentDate.getMinutes();
                                const hours = currentDate.getHours();
                                const initialTime = momentTimezone.tz(mini.timeStart, 'HH:mm', 'Asia/Ho_Chi_Minh');
                                const newTime = initialTime.subtract(20, 'minutes');
                                const late =
                                    new Date(mini.date) > currentDate.setUTCHours(0, 0, 0, 0) ||
                                    (hours === newTime.hours() && minutes < newTime.minutes()) ||
                                    hours < newTime.hours()
                                        ? 1
                                        : 0;
                                const test = await soldOutSeat(mini._id, mini.room);
                                return { ...mini, test, late };
                            }),
                        );
                        return { theater: item, showTimes: data3 };
                    }),
                );
                // setShowTimes(data2)
                setTheaters(data2);
            } else {
                setTheaters([]);
            }
        };
        fetch();
    }, [id, date, selectPro]);

    const handleSeat = (showTime) => {
        if (user) {
            router.push({ pathname: '/seat/[showTime]', params: { id: showTime } });
        } else {
            router.navigate({ pathname: '/(account)/login', params: { isLog: true } });
        }
    };

    return film !== null ? (
        <React.Fragment>
            <BackIcon
                action={
                    <Text
                        style={{ fontSize: 18, fontWeight: '500', marginHorizontal: 10 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {film.data.name}
                    </Text>
                }
            />
            <ScrollView>
                <View style={styles.container}>
                    <ImageBase pathImg={film.data.image} style={styles.backgroundImage} blurRadius={3} />
                    <View style={styles.containerInfo}>
                        <ImageBase pathImg={film.data.image} style={{ width: 90, height: 140 }} />
                        <View style={styles.contentMain}>
                            <Text style={styles.title}>{film.data.name}</Text>
                            <Text style={styles.text}>Quốc gia: {film.data.nation}</Text>
                            <Text style={styles.text}>Thời lượng: {film.data.time} phút</Text>
                            <View style={styles.inline}>
                                {film.arrayGenre.map((item, index) => (
                                    <Text key={item._id} style={styles.text}>
                                        {item}
                                        {index < film.arrayGenre.length - 1 && ', '}
                                    </Text>
                                ))}
                            </View>
                            <Age age={film.data.age} />
                        </View>
                    </View>
                    <View style={styles.body}>
                        <View style={styles.inline}>
                            <Text>Đạo diễn: </Text>
                            {film.arrayDirector.map((item, index) => {
                                return (
                                    <Text key={item._id} style={styles.text}>
                                        {item}
                                        {index < film.arrayDirector.length - 1 && ', '}
                                    </Text>
                                );
                            })}
                        </View>
                        <View style={styles.inline}>
                            <Text>Diễn viên: </Text>
                            {film.arrayPerformer.map((item, index) => {
                                return (
                                    <Text key={item._id} style={styles.text}>
                                        {item}
                                        {index < film.arrayPerformer.length - 1 && ', '}
                                    </Text>
                                );
                            })}
                        </View>
                        <View>
                            <Text>Mô tả phim: </Text>
                            <RenderHTML
                                contentWidth={WIDTH}
                                source={{ html: film.data.description }}
                                tagsStyles={{
                                    p: { textAlign: 'justify', fontWeight: '300', marginTop: 5 },
                                }}
                            />
                        </View>
                        <FlatList
                            data={week}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <ScheduleMini
                                    key={item.day}
                                    date={item.date}
                                    day={now.getDay() === item.day ? 'Hôm nay' : nameDay[item.day]}
                                    handleSelectDay={() => handleSelect(index, item.full)}
                                    selectDay={selectDay === index ? true : false}
                                />
                            )}
                            ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
                        ></FlatList>
                        <RNPickerSelect
                            onValueChange={(value) => setSelectPro(value)}
                            items={province}
                            style={pickerStyle}
                            placeholder={{
                                label: 'Danh sách địa điểm',
                                value: null,
                            }}
                        />
                        <View>
                            {theaters.map((item, index) => {
                                return (
                                    <LinearGradient
                                        key={item._id}
                                        colors={['#d5bcfc', '#aec7fa']}
                                        style={styles.theaterContant}
                                        start={{ x: 0.45, y: 0.25 }}
                                        end={{ x: 0.5, y: 1.0 }}
                                    >
                                        <Text style={{ fontWeight: '500', fontSize: 18 }}>{item.theater.name}</Text>
                                        <Text style={{ fontWeight: '300' }}>
                                            {item.theater.address}, {item.theater.ward}, {item.theater.district},{' '}
                                            {item.theater.province}
                                        </Text>
                                        <View>
                                            {item.showTimes.length > 0 ? (
                                                Object.entries(
                                                    item.showTimes.reduce((acc, mini) => {
                                                        if (!acc[mini.translate]) {
                                                            acc[mini.translate] = [];
                                                        }
                                                        acc[mini.translate].push(mini);
                                                        return acc;
                                                    }, {}),
                                                ).map(([translate, mini]) => (
                                                    <View key={mini._id}>
                                                        <Text style={{ marginTop: 5 }}>{translate}</Text>
                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                gap: 10,
                                                                flexWrap: 'wrap',
                                                                // justifyContent: 'space-between',
                                                            }}
                                                        >
                                                            {mini.map((min) => (
                                                                <TouchableWithoutFeedback
                                                                    key={min._id}
                                                                    onPress={() => {
                                                                        if (
                                                                            min.status === statusShowTime[2] &&
                                                                            min.test === 1 &&
                                                                            min.late === 1
                                                                        ) {
                                                                            handleSeat(min._id);
                                                                        }
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={[
                                                                            styles.showTimeDecor,
                                                                            min.status === statusShowTime[2] &&
                                                                            min.test === 1 &&
                                                                            min.late === 1
                                                                                ? styles.yes2
                                                                                : styles.no2,
                                                                        ]}
                                                                    >
                                                                        {min.timeStart}
                                                                    </Text>
                                                                </TouchableWithoutFeedback>
                                                            ))}
                                                        </View>
                                                    </View>
                                                ))
                                            ) : (
                                                <View
                                                    style={{
                                                        borderRadius: 4,
                                                        padding: 8,
                                                        borderWidth: 0.5,
                                                        borderStyle: 'solid',
                                                        borderColor: 'black',
                                                        marginTop: 10,
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <Image
                                                        source={require('~/assets/images/movie-updating.png')}
                                                        style={{ height: 20, width: 20, marginEnd: 10 }}
                                                    />
                                                    <Text>Hiện chưa có lịch chiếu</Text>
                                                </View>
                                            )}
                                        </View>
                                    </LinearGradient>
                                );
                            })}
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <ReviewFilm id={film.data._id} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </React.Fragment>
    ) : (
        <Loading />
    );
};

export default React.memo(DetailFilm);

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'center',
        // alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        flex: 1,
        minHeight: HEIGHT,
    },
    containerInfo: {
        marginTop: 40,
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
    contentMain: {
        padding: 10,
        width: WIDTH - 120,
    },
    title: {
        fontWeight: '500',
        marginBottom: 5,
    },
    text: {
        fontWeight: '300',
    },
    inline: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    body: {
        justifyContent: 'flex-start',
        // flexDirection: 'row',
        alignItems: 'flex-start',
        width: WIDTH - 20,
        marginTop: 10,
        // padding: 10,
    },
    theaterContant: {
        // height: 600,
        width: WIDTH - 20,
        padding: 15,
        marginTop: 10,
    },
    showTimeDecor: {
        padding: 7,
        width: 65,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 16,
        marginTop: 10,
    },
    yes2: {
        borderColor: '#3a2a62',
        color: '#3a2a62',
    },
    no2: {
        borderColor: 'gray',
        color: 'gray',
    },
    backgroundImage: {
        position: 'absolute',
        width: WIDTH,
        height: HEIGHT * 0.2,
        resizeMode: 'cover',
    },
});
