import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';

const Loading = () => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Progress.Circle size={30} indeterminate={true} color='#3a2a62' />
        </View>
    );
};

export default Loading;

const styles = StyleSheet.create({});
