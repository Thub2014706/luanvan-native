import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import { WIDTH } from '~/constants';

const PayContainer = ({selectSeat, priceSeat, handleNext}) => {
    return (
        <View style={styles.payContant}>
            <View style={{ width: '60%' }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginEnd: 5 }}>{selectSeat.length} Ghế: </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {selectSeat.map((seat, index) => {
                            return (
                                <Text style={{ fontWeight: '500' }} key={seat._id}>
                                    {String.fromCharCode(64 + seat.row)}
                                    {seat.col}
                                    {index < selectSeat.length - 1 && ', '}
                                </Text>
                            );
                        })}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{ marginEnd: 5 }}>Tổng cộng: </Text>
                    <Text style={{ color: '#3a2a62', fontWeight: '500' }}>{priceSeat.toLocaleString('it-IT')} VNĐ</Text>
                </View>
            </View>
            <View style={{ margin: 10, marginEnd: 0 }}>
                <TouchableWithoutFeedback onPress={handleNext}>
                    <View style={styles.button}>
                        <Text style={{ color: 'white' }}>Tiếp theo</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

export default PayContainer;

const styles = StyleSheet.create({
    payContant: {
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: 'white',
        elevation: 5,
        padding: 10,
        // position: 'absolute',
        bottom: 0,
        // width: WIDTH - 20,
        // marginHorizontal: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        padding: 10,
        backgroundColor: '#3a2a62',
        borderRadius: 10,
    },
});
