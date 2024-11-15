import {  ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { HEIGHT, WIDTH } from '~/constants';
import ImageBase from '../ImageBase/ImageBase';
import { listAdvertisement } from '~/services/AdvertisementService';

const SlideImage = () => {
    const [banner, setBanner] = useState([]);
    const [numberImg, setNumberImg] = useState(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchBanner = async () => {
            const data = await listAdvertisement();
            setBanner([...data, data[0]]); // Thêm ảnh đầu tiên vào cuối
        };
        fetchBanner();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setNumberImg((prevIndex) => (prevIndex + 1) % banner.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [banner]);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            x: WIDTH * numberImg,
            animated: true,
        });

        if (numberImg === banner.length - 1) {
            setTimeout(() => {
                scrollRef.current?.scrollTo({ x: 0, animated: false });
                setNumberImg(0);
            }, 3000);
        }
    }, [numberImg]);

    return (
        <View style={styles.container}>
            {/* {banner.length > 0 && (
                <ImageBase pathImg={banner[numberImg].image} style={styles.backgroundImage} blurRadius={50} />
            )} */}
            <ScrollView
                ref={scrollRef}
                onMomentumScrollEnd={(e) => {
                    const scrollPosition = e.nativeEvent.contentOffset.x;
                    const currentIndex = Math.round(scrollPosition / WIDTH);
                    setNumberImg(currentIndex);
                }}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                horizontal
                bounces={false} // Tắt bounces
                scrollEventThrottle={16} // Tăng độ mượt của cuộn
                decelerationRate="fast"
            >
                {banner.map((item, index) => (
                    <ImageBase key={item.id} pathImg={item.image} style={styles.wrap} resizeMode='contain' />
                ))}
            </ScrollView>
            <View style={styles.wrapDot}>
                {banner.slice(0, -1).map((_, index) => (
                    <View
                        key={index}
                        style={index === numberImg % (banner.length - 1) ? styles.dotActive : styles.dot}
                    ></View>
                ))}
            </View>
        </View>
    );
};

export default React.memo(SlideImage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // paddingVertical: 20,
        // paddingHorizontal: 30,
        // marginBottom: 20,
        backgroundColor: '#3a2a62'
    },
    backgroundImage: {
        position: 'absolute',
        width: WIDTH,
        height: HEIGHT * 0.21,
        // resizeMode: 'contain',
    },
    wrap: {
        width: WIDTH,
        height: HEIGHT * 0.15,
    },
    wrapDot: {
        position: 'absolute',
        bottom: 8,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    dotActive: {
        width: 7,
        height: 7,
        borderRadius: 20,
        backgroundColor: '#3a2a62',
        marginHorizontal: 2,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 20,
        backgroundColor: 'gray',
        marginHorizontal: 2,
    },
});
