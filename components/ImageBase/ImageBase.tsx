import { Image, StyleSheet, Text, View } from 'react-native';
// import { Image } from 'expo-image';
import { getImage } from '../../services/FilmService';
import { useEffect, useState } from 'react';

const ImageBase = ({ pathImg, style, blurRadius, resizeMode }) => {
    const [img, setImg] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const data = await getImage(pathImg);
            setImg(data);
        };
        fetch();
    }, [pathImg]);
    // console.log(img);

    return img !== null ? (
        <Image source={{ uri: img }} style={style} resizeMode={resizeMode} blurRadius={blurRadius} />
    ) : (
        <View style={[style, {backgroundColor: '#e1e1e1'}]}></View>
        // <Text>Loading...</Text>
    );
};

export default ImageBase;

const styles = StyleSheet.create({});
