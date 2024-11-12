import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { HEIGHT, icon } from '~/constants';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
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
    const scale = useSharedValue(0);
    // console.log(icon[routeName]);
    useEffect(() => {
        scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused, { duration: 350 });
    }, [scale, isFocused]);

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);
        return { opacity };
    });

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
        const top = interpolate(scale.value, [0, 1], [0, 9]);
        return {
            transform: [
                {
                    scale: scaleValue,
                },
            ],
            top,
        };
    });

    return (
        <Pressable onPress={onPress} onLongPress={onLongPress} style={[styles.tabbarItem]}>
            <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View style={animatedIconStyle}>
                    {icon[routeName] &&
                        icon[routeName]({
                            color: isFocused ? '#fff' : '#222',
                        })}
                </Animated.View>
                <Animated.Text style={[{ color: isFocused ? '#fff' : '#222' }, animatedTextStyle]}>
                    {label}
                </Animated.Text>
            </View>
            {routeName === 'chat' && numberChat > 0 && (
                <View style={styles.number}>
                    <Text style={{ color: 'white' }}>{numberChat}</Text>
                </View>
            )}
        </Pressable>
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
