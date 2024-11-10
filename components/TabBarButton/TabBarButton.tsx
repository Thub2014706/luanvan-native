import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { HEIGHT, icon } from '~/constants';
import { useSharedValue } from 'react-native-reanimated';
import { useSelector } from 'react-redux';

const TabBarButton = ({
    onPress,
    onLongPress,
    isFocused,
    routeName,
    color,
    label,
}: {
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    routeName: string;
    color: string;
    label: string;
}) => {
    const numberChat = useSelector((state) => state.socket.numberChat);
    // const scale = useSharedValue(0);
    // console.log(icon[routeName]);

    return (
        // <View>
        <Pressable onPress={onPress} onLongPress={onLongPress} style={[styles.tabbarItem, isFocused && styles.select]}>
            <View style={{ position: 'relative' }}>
                {icon[routeName] &&
                    icon[routeName]({
                        color: isFocused ? 'white' : '#222',
                    })}
                <Text style={{ color: isFocused ? 'white' : '#222' }}>{label}</Text>
            </View>
            {routeName === 'chat' && numberChat > 0 && (
                <View style={styles.number}>
                    <Text style={{ color: 'white' }}>{numberChat}</Text>
                </View>
            )}
        </Pressable>
        // </View>
    );
};

export default TabBarButton;

const styles = StyleSheet.create({
    tabbarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    select: {
        backgroundColor: '#673ab7',
        borderRadius: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    number: {
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: 'rgb(214, 44, 44)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        marginTop: -5,
        marginRight: '30%',
        top: 0,
        right: 0,
    },
});
