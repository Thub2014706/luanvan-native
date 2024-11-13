import { BackHandler, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useNavigation } from 'expo-router';

const BackIcon = ({ action, handle }) => {
    const handleBackPress = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <Ionicons name="arrow-back" size={32} onPress={handle ? handle : handleBackPress} color="gray" />
            {action}
        </View>
    );
};

export default BackIcon;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10,
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
