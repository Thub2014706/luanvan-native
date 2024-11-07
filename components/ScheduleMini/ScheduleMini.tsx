import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';

const ScheduleMini = ({ date, day, handleSelectDay, selectDay }) => {
    return (
        <TouchableWithoutFeedback onPress={handleSelectDay}>
            <View style={[styles.container, { borderColor: selectDay ? '#3a2a62' : '#989898' }]}>
                <View style={[styles.headerContain, selectDay ? styles.select : styles.none]}>
                    <Text style={[styles.header, { color: selectDay ? 'white' : 'black' }]}>{date}</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 28 }}>
                    <Text style={{ color: selectDay ? '#3a2a62' : '#989898' }}>{day}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ScheduleMini;

const styles = StyleSheet.create({
    container: {
        height: 80,
        width: 70,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 6,
        alignItems: 'center',
    },
    select: {
        backgroundColor: '#3a2a62',
        borderColor: '#3a2a62',
    },
    none: {
        backgroundColor: '#e1e1e1',
        borderColor: '#989898',
    },
    headerContain: {
        borderBottomColor: '#989898',
        borderBottomWidth: 1,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
        alignItems: 'center',
    },
    header: {
        fontWeight: '500',
        fontSize: 20,
        color: '#3a2a62',
    },
});
