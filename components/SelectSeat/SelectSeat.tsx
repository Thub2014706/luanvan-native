import { Alert, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import ImageBase from '../ImageBase/ImageBase';
import { Ionicons } from '@expo/vector-icons';
import { HEIGHT, signAge, standardAge, typeSeatEnum, WIDTH } from '~/constants';
import { Image } from 'expo-image';

const SelectSeat = ({ selectSeat, setSelectSeat, selled, seats, film }) => {
    const rows = [...new Set(seats.map((item) => item.row))];

    const handleSelectSeat = async (seat) => {
        if (!selectSeat.includes(seat)) {
            const seatArray = [...selectSeat, seat];
            const allSameType = seatArray.every((item) => item.type === seatArray[0].type);

            if (!allSameType) {
                Alert.alert('Lỗi chọn ghế', 'Hãy chọn ghế cùng loại!', [
                    { text: 'Đóng', onPress: () => console.log('OK Pressed') },
                ]);
            } else {
                setSelectSeat(seatArray);
            }
        } else {
            setSelectSeat(selectSeat.filter((item) => item !== seat));
        }
    };

    const handleSelectSeatCouple = (seat) => {
        const arrayRow = seats.filter((item) => item.row === seat.row);
        const seatIndex = arrayRow.indexOf(seat);
        const nextChair = arrayRow[seatIndex].col % 2 === 0 ? arrayRow[seatIndex - 1] : arrayRow[seatIndex + 1];

        if (!selectSeat.includes(seat && nextChair)) {
            const seatArray = [...selectSeat, seat, nextChair];
            // console.log(seatArray);
            const allSameType = seatArray.every((item) => item.type === seatArray[0].type);

            if (!allSameType) {
                Alert.alert('Lỗi chọn ghế', 'Hãy chọn ghế cùng loại!', [
                    { text: 'Đóng', onPress: () => console.log('OK Pressed') },
                ]);
            } else {
                setSelectSeat(seatArray);
            }
        } else {
            setSelectSeat(selectSeat.filter((item) => item !== seat && item !== nextChair));
        }
    };
    return (
        <ScrollView>
            <View style={styles.container}>
                <View>
                    <View style={styles.containerInfo}>
                        <ImageBase pathImg={film.image} style={{ width: 70, height: 100 }} />
                        <View style={styles.contentMain}>
                            <Text style={{ fontWeight: '500', marginBottom: 5, marginEnd: 10 }}>
                                {film.name} [{signAge[standardAge.findIndex((mini) => mini === film.age)]}]
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 2 }}>
                                <Ionicons name="location-outline" size={18} color="gray" />
                                <Text>
                                    {theater.name} - Phòng: {room.name} ({room.type})
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 2, marginTop: 10 }}>
                                <Ionicons name="time-outline" size={18} color="gray" />
                                <Text>
                                    Suất chiếu: {showTime.timeStart} - {moment(showTime.date).format('DD/MM/YYYY')}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ position: 'relative', marginTop: 20 }}>
                        <Image
                            source={require('~/assets/images/screen.svg')}
                            contentFit="contain"
                            // resizeMode='contain'
                            style={{ height: 30, width: WIDTH - 30, alignItems: 'center' }}
                        />
                        <Text
                            style={{
                                // textAlign: 'center',
                                transform: [{ translateX: -25 }, { translateY: 0 }],
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                            }}
                        >
                            MÀN HÌNH
                        </Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ height: 'auto' }}>
                        <View style={styles.table}>
                            {rows.map((row) => {
                                return (
                                    <View key={row} style={styles.row}>
                                        {seats
                                            .filter((seat) => seat.row === row)
                                            .map((seat) => {
                                                return (
                                                    !seat.isDelete && (
                                                        <TouchableWithoutFeedback
                                                            key={seat._id}
                                                            onPress={() =>
                                                                !selled.includes(seat._id) &&
                                                                !hold.includes(seat._id) &&
                                                                seat.status === true &&
                                                                (seat.type !== typeSeatEnum[2]
                                                                    ? handleSelectSeat(seat)
                                                                    : handleSelectSeatCouple(seat))
                                                            }
                                                        >
                                                            <View
                                                                style={[
                                                                    styles.col,
                                                                    seat.type === typeSeatEnum[0] && styles.standard,
                                                                    seat.type === typeSeatEnum[1] && styles.vip,
                                                                    seat.type === typeSeatEnum[2] && styles.couple,
                                                                    !seat.status && styles.inaction,
                                                                    selectSeat.find((item) => item === seat) &&
                                                                        styles.select,
                                                                    (selled.includes(seat._id) ||
                                                                        hold.includes(seat._id)) &&
                                                                        styles.selled,
                                                                    {
                                                                        marginBottom: seat.bottom * 20,
                                                                        marginLeft: seat.left * 22.5,
                                                                        marginRight: seat.right * 22.5,
                                                                    },
                                                                ]}
                                                            >
                                                                <Text
                                                                    style={[
                                                                        seat.type === typeSeatEnum[0] && styles.color1,
                                                                        seat.type === typeSeatEnum[1] && styles.color1,
                                                                        seat.type === typeSeatEnum[2] && styles.color2,
                                                                        !seat.status && styles.color3,
                                                                        selectSeat.find((item) => item === seat) &&
                                                                            styles.color2,
                                                                        (selled.includes(seat._id) ||
                                                                            hold.includes(seat._id)) &&
                                                                            styles.color3,
                                                                        { fontWeight: '500' },
                                                                    ]}
                                                                >
                                                                    {String.fromCharCode(64 + row)}
                                                                    {seat.col}
                                                                </Text>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    )
                                                );
                                            })}
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                    <View
                        style={{
                            marginTop: 20,
                            flexDirection: 'row',
                            gap: 20,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <View
                                style={[styles.standard, { height: 20, width: 20, borderRadius: 20, marginEnd: 5 }]}
                            ></View>
                            <Text style={{ fontWeight: '300' }}>Ghế thường</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View
                                style={[styles.vip, { height: 20, width: 20, borderRadius: 20, marginEnd: 5 }]}
                            ></View>
                            <Text style={{ fontWeight: '300' }}>Ghế VIP</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View
                                style={[styles.couple, { height: 20, width: 20, borderRadius: 20, marginEnd: 5 }]}
                            ></View>
                            <Text style={{ fontWeight: '300' }}>Ghế Couple</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View
                                style={[styles.inaction, { height: 20, width: 20, borderRadius: 20, marginEnd: 5 }]}
                            ></View>
                            <Text style={{ fontWeight: '300' }}>Ghế đang bảo trì</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View
                                style={[styles.selled, { height: 20, width: 20, borderRadius: 20, marginEnd: 5 }]}
                            ></View>
                            <Text style={{ fontWeight: '300' }}>Ghế đã mua</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View
                                style={[styles.select, { height: 20, width: 20, borderRadius: 20, marginEnd: 5 }]}
                            ></View>
                            <Text style={{ fontWeight: '300' }}>Ghế chọn</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default SelectSeat;

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'flex-start',
        // alignItems: 'center',
        padding: 10,
        // flex: 1,
        // justifyContent: 'flex-start',
        height: HEIGHT - 20,
    },
    row: {
        flexDirection: 'row',
        gap: 5,
    },
    col: {
        // padding: 4,
        height: 40,
        width: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    table: {
        gap: 5,
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    standard: {
        backgroundColor: '#b196f5',
    },
    vip: {
        backgroundColor: '#3a2a62',
    },
    couple: {
        backgroundColor: '#dc9bd2',
    },
    inaction: {
        backgroundColor: '#0f1b07',
    },
    select: {
        backgroundColor: '#f3ea28',
    },
    selled: {
        backgroundColor: '#48566a',
    },
    color1: {
        color: 'white',
    },
    color2: {
        color: '#663399',
    },
    color3: {
        color: 'rgb(167, 167, 167)',
    },
    containerInfo: {
        width: WIDTH - 20,
        // borderRadius: 10,
        flexDirection: 'row',
    },
    contentMain: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        width: WIDTH - 120,
        // flex: 2,
    },
});
