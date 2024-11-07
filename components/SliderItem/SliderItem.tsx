import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ImageBase from '../ImageBase/ImageBase';
import { signAge, standardAge, WIDTH } from '~/constants';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { Link } from 'expo-router';

const SliderItem = ({ item, index, scrollX }) => {
    const rnAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        scrollX.value,
                        [(index - 1) * WIDTH, index * WIDTH, (index + 1) * WIDTH],
                        [-WIDTH * 0.25, 0, WIDTH * 0.25],
                        Extrapolation.CLAMP,
                    ),
                },
                {
                    scale: interpolate(
                        scrollX.value,
                        [(index - 1) * WIDTH, index * WIDTH, (index + 1) * WIDTH],
                        [0.9, 1, 0.9],
                        Extrapolation.CLAMP,
                    ),
                },
            ],
        };
    });

    // console.log(item);
    
    return (
        <Link href={{ pathname: '/(bookTicket)/details/[id]', params: { id: item._id } }}>
            <Animated.View style={[styles.container, rnAnimatedStyle]}>
                <ImageBase pathImg={item.image} style={{ width: 300, height: 500 }} />
                <View>
                    <Text style={styles.title}>
                        {item.name} ({signAge[standardAge.findIndex((mini) => mini === item.age)]})
                    </Text>
                    {/* <Text></Text> */}
                </View>
            </Animated.View>
        </Link>
    );
};

export default SliderItem;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        width: WIDTH,
    },
    title: {
        color: 'white',
        fontWeight: '400',
    },
});
