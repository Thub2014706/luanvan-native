import { BackHandler, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useNavigation } from 'expo-router';

const BackIcon = () => {
    // const navigation = useNavigation();

    // useEffect(() => {
    //     const backAction = () => {
    //         navigation.goBack(); 
    //         return true; 
    //     };

    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    //     return () => backHandler.remove();
    // }, [navigation]);

    const handleBackPress = () => {
        router.back();
    };

    return (
        <TouchableOpacity onPress={handleBackPress} style={styles.container}>
            <Ionicons name="arrow-back" size={32} color="gray" />
        </TouchableOpacity>
    );
};

export default BackIcon;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        // position: 'absolute',
        width: '100%',
        padding: 10,
        // height: 52,
        zIndex: 1,
    },
});
