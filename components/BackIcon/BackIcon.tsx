import { BackHandler, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useNavigation } from 'expo-router';

const BackIcon = ({ action }) => {
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
        <View style={styles.container}>
            <Ionicons name="arrow-back" size={32} onPress={handleBackPress} color="gray" />
            {/* <Text style={{ fontSize: 18, fontWeight: '500', marginStart: 10 }} numberOfLines={1} ellipsizeMode="tail">
                {item}
            </Text> */}
            {action}
            {/* <View>{action}</View> */}
        </View>
    );
};

export default BackIcon;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        // position: 'absolute',
        // width: '100%',
        padding: 10,
        // height: 52,
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
