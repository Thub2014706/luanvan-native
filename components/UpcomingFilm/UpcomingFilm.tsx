import { StyleSheet, View, ViewToken } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { WIDTH } from '~/constants';
import SliderItem from '../SliderItem/SliderItem';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useDerivedValue, useSharedValue, scrollTo } from 'react-native-reanimated';
import PaginationSlider from '../PaginationSlider/PaginationSlider';

const UpcomingFilm = ({ films1 }) => {
    const scrollX = useSharedValue(0);
    const [paginationIndex, setPaginationIndex] = useState(0);
    const [data, setData] = useState(films1);
    const ref = useAnimatedRef<Animated.FlatList<any>>();
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const interval = useRef<NodeJS.Timeout>();
    const offset = useSharedValue(0);

    useEffect(() => {
        if (isAutoPlay === true) {
            interval.current = setInterval(() => {
                offset.value = offset.value + WIDTH;
            }, 5000);
        } else {
            clearInterval(interval.current)
        }

        return () => {
            clearInterval(interval.current);
        };
    }, [isAutoPlay, offset, WIDTH]);

    useDerivedValue(() => {
        scrollTo(ref, offset.value, 0, true);
    });

    const onScrollHander = useAnimatedScrollHandler({
        onScroll: (e) => {
            scrollX.value = e.contentOffset.x;
        },
        onMomentumEnd: (e) => {
            offset.value = e.contentOffset.x;
        },
    });

    const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems[0].index !== undefined && viewableItems[0].index !== null) {
            setPaginationIndex(viewableItems[0].index % films1.length);
            // console.log(films1.length);
        }
    };

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };

    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

    return (
        <View style={styles.container}>
            <Animated.FlatList
                ref={ref}
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                renderItem={({ item, index }) => <SliderItem item={item} index={index} scrollX={scrollX} />}
                onScroll={onScrollHander}
                scrollEventThrottle={16}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                onEndReached={() => setData([...data, ...films1])}
                onEndReachedThreshold={0.5}
                onScrollBeginDrag={() => {
                    setIsAutoPlay(false);
                }}
                onScrollEndDrag={() => {
                    setIsAutoPlay(true);
                }}
            />
            <PaginationSlider item={films1} scrollX={scrollX} paginationIndex={paginationIndex} />
        </View>
    );
};

export default UpcomingFilm;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3a2a62',
        paddingVertical: 30,
    },
});
