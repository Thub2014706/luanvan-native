import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { WIDTH } from '~/constants';

const PaginationSlider = ({
    item,
    paginationIndex,
    scrollX,
}: {
    item: object;
    paginationIndex: number;
    scrollX: object;
}) => {
    // console.log(typeof(scrollX));
    return (
        <View style={styles.container}>
            {item.map((_, index) => {
                const pgAnimationStyle = useAnimatedStyle(() => {
                    const dotWidth = interpolate(
                        scrollX.value,
                        [(index - 1) * WIDTH, index * WIDTH, (index + 1) * WIDTH],
                        [8, 20, 8],
                        Extrapolation.CLAMP,
                    );
                    return {
                        width: dotWidth,
                    };
                });
                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            // pgAnimationStyle,
                            { backgroundColor: paginationIndex === index ? '#222' : '#aaa' },
                        ]}
                    />
                );
            })}
        </View>
    );
};

export default PaginationSlider;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        backgroundColor: '#aaa',
        height: 8,
        width: 8,
        marginHorizontal: 2,
        borderRadius: 8,
    },
});
