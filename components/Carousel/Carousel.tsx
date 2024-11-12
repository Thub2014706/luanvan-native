import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import ImageBase from '../ImageBase/ImageBase';
import { SPACING, WIDTH } from '~/constants';
import Animated, {
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { transform } from '@babel/core';
import Age from '../Age/Age';
import { Link } from 'expo-router';

const Carousel = ({ data }) => {
    const [newData, setNewData] = useState([{ key: 'spacer-left' }, ...data, { key: 'spacer-right' }]);
    const x = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler({
        onScroll: (e) => {
            x.value = e.contentOffset.x;
        },
    });

    return (
        <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={16}
            snapToInterval={WIDTH * 0.8}
            decelerationRate="fast"
            onScroll={onScroll}
        >
            {newData.map((item, index) => {
                const style = useAnimatedStyle(() => {
                    const scale = interpolate(
                        x.value,
                        [(index - 2) * (WIDTH * 0.8), (index - 1) * (WIDTH * 0.8), index * (WIDTH * 0.8)],
                        [0.8, 1, 0.8],
                    );
                    return {
                        transform: [{ scale }],
                    };
                });
                if (!item.image) {
                    return <View style={{ width: SPACING }} key={index} />;
                }
                return (
                    <View key={index}>
                        <Link href={{ pathname: '/(bookTicket)/details/[id]', params: { id: item._id } }}>
                            <Animated.View style={style}>
                                <ImageBase pathImg={item.image} style={{ width: WIDTH * 0.8, height: 500 }} />
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontWeight: '500', fontSize: 18, color: 'white' }}>{item.name}</Text>
                                    <View style={styles.inline}>
                                        {item.genre.map((mini, index) => (
                                            <Text key={item} style={{ color: 'white', marginBottom: 5 }}>
                                                {mini}
                                                {index < item.genre.length - 1 && ', '}
                                            </Text>
                                        ))}
                                    </View>
                                    <Age age={item.age} />
                                </View>
                            </Animated.View>
                        </Link>
                    </View>
                );
            })}
        </Animated.ScrollView>
    );
};

export default Carousel;

const styles = StyleSheet.create({
    inline: {
        flexDirection: 'row',
    },
});
