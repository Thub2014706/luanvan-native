import { FlatList, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScheduleMini from '~/components/ScheduleMini/ScheduleMini';
import moment from 'moment';
import { HEIGHT, nameDay, statusShowTime, WIDTH } from '~/constants';
import { filmByTheater, soldOutSeat } from '~/services/ShowTimeService';
import { Link, router, useLocalSearchParams } from 'expo-router';
import momentTimezone from 'moment-timezone';
import ImageBase from '~/components/ImageBase/ImageBase';
import Age from '~/components/Age/Age';
import BackIcon from '~/components/BackIcon/BackIcon';
import { detailTheater } from '~/services/TheaterService';

const TheaterDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [selectDay, setSelectDay] = useState(0);
    const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [showTimes, setShowTimes] = useState([]);
    const [theater, setTheater] = useState(null);

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
            const data = await detailTheater(id);
            setTheater(data);
        };
        fetch();
    }, [id]);

    useEffect(() => {
        const fetch = async () => {
            const data = await filmByTheater(id, date);
            const newData = await Promise.all(
                data.map(async (item) => {
                    const newShowTimes = await Promise.all(
                        item.showTimes.map(async (mini) => {
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
                    return { film: item.film, showTimes: newShowTimes };
                }),
            );
            setShowTimes(newData);
        };
        fetch();
    }, [id, date]);

    const handleSeat = (id) => {
        router.push({
            pathname: '/seat/[showTime]',
            params: { id },
        });
    };

    return (
        theater !== null && (
            <React.Fragment>
                <BackIcon
                    action={
                        <Text
                            style={{ fontSize: 18, fontWeight: '500', marginHorizontal: 10 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {theater.name}
                        </Text>
                    }
                />
                <ScrollView>
                    <View style={styles.container}>
                        <View>
                            <FlatList
                                data={week}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <ScheduleMini
                                        key={index}
                                        date={item.date}
                                        day={now.getDay() === item.day ? 'Hôm nay' : nameDay[item.day]}
                                        handleSelectDay={() => handleSelect(index, item.full)}
                                        selectDay={selectDay === index ? true : false}
                                    />
                                )}
                                ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
                            ></FlatList>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ marginVertical: 10, gap: 10 }}>
                                {showTimes.length > 0 ? (
                                    showTimes.map((item) => {
                                        return (
                                            <React.Fragment>
                                                <View
                                                    style={{
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        marginVertical: 10,
                                                    }}
                                                >
                                                    <View style={styles.line}></View>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <ImageBase
                                                        pathImg={item.film.image}
                                                        style={{ height: 200, width: 140 }}
                                                    />
                                                    <View style={{ paddingHorizontal: 5 }}>
                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                gap: 5,
                                                                alignItems: 'flex-end',
                                                            }}
                                                        >
                                                            <Text style={{ fontWeight: '500' }}>
                                                                {item.film.name.toUpperCase()}
                                                            </Text>
                                                            <Age age={item.film.age} />
                                                        </View>
                                                        <View>
                                                            {Object.entries(
                                                                item.showTimes.reduce((acc, mini) => {
                                                                    if (!acc[mini.translate]) {
                                                                        acc[mini.translate] = [];
                                                                    }
                                                                    acc[mini.translate].push(mini);
                                                                    return acc;
                                                                }, {}),
                                                            ).map(([translate, mini]) => (
                                                                <View>
                                                                    <Text
                                                                        style={{
                                                                            marginVertical: 5,
                                                                            textDecorationLine: 'underline',
                                                                        }}
                                                                    >
                                                                        {translate}
                                                                    </Text>
                                                                    <View
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            gap: 5,
                                                                            flexWrap: 'wrap',
                                                                            width: WIDTH - 20 - 140,
                                                                        }}
                                                                    >
                                                                        {mini.map((min) => (
                                                                            <TouchableWithoutFeedback
                                                                                onPress={() =>
                                                                                    min.status === statusShowTime[2] &&
                                                                                    min.test === 1 &&
                                                                                    min.late === 1 &&
                                                                                    handleSeat(min._id)
                                                                                }
                                                                            >
                                                                                <View
                                                                                    style={[
                                                                                        styles.time,
                                                                                        min.status ===
                                                                                            statusShowTime[2] &&
                                                                                        min.test === 1 &&
                                                                                        min.late === 1
                                                                                            ? styles.yes
                                                                                            : styles.no,
                                                                                    ]}
                                                                                >
                                                                                    <Text
                                                                                        style={{
                                                                                            color:
                                                                                                min.status ===
                                                                                                    statusShowTime[2] &&
                                                                                                min.test === 1 &&
                                                                                                min.late === 1
                                                                                                    ? '#3a2a62'
                                                                                                    : '#989898',
                                                                                        }}
                                                                                    >
                                                                                        {min.timeStart}
                                                                                    </Text>
                                                                                </View>
                                                                            </TouchableWithoutFeedback>
                                                                        ))}
                                                                    </View>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    </View>
                                                </View>
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <Text style={{ textAlign: 'center' }}>Chưa có suất chiếu nào!</Text>
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </React.Fragment>
        )
    );
};

export default React.memo(TheaterDetail);

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'white',
        flex: 1,
        minHeight: HEIGHT,
    },
    line: {
        width: WIDTH - 20,
        height: 1,
        backgroundColor: '#989898',
    },
    time: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderStyle: 'solid',
        borderWidth: 0.5,
        alignSelf: 'baseline',
        // marginTop: 5,
    },
    yes: {
        borderColor: '#3a2a62',
    },
    no: {
        borderColor: '#989898',
    },
});
