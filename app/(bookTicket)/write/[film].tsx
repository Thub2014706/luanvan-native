import { Alert, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import StarRating from 'react-native-star-rating-widget';
import { router, useLocalSearchParams } from 'expo-router';
import { detailFilm } from '~/services/FilmService';
import { WIDTH } from '~/constants';
import Age from '~/components/Age/Age';
import { detailGenre } from '~/services/GenreService';
import ImageBase from '~/components/ImageBase/ImageBase';
import BackIcon from '~/components/BackIcon/BackIcon';
import { addComment } from '~/services/CommentService';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

const WriteReview = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const { id } = useLocalSearchParams<{ id: string }>();
    const [film, setFilm] = useState(null);
    const [text, setText] = useState('');
    const [star, setStar] = useState(5);
    // console.log(id);

    useEffect(() => {
        const fetch = async () => {
            const data = await detailFilm(id);
            const arrayGenre = await Promise.all(data.genre.map(async (item) => (await detailGenre(item)).name));
            setFilm({ data, arrayGenre });
        };
        fetch();
    }, [id]);
    // console.log(film);

    const handleSubmit = async () => {
        if (text === '') {
            Toast.show({
                type: 'error',
                text1: 'Hãy viết đánh giá!',
                // text2: null,
            });
        } else {
            const newComment = await addComment({ star, text, user: user.data.id, film: id });

            if (newComment) {
                Toast.show({
                    type: 'success',
                    text1: 'Đã gửi đánh giá!',
                    // text2: null,
                });
                router.back();
            }
        }
    };

    const handleBack = () => {
        Alert.alert('Bạn muốn rời trang này?', 'Nếu bạn rời trang, những thay đổi của bạn sẽ không được lưu.', [
            {
                text: 'Rời trang',
                onPress: () => router.back(),
            },
            {
                text: 'Ở lại trang',
                onPress: () => console.log('okk'),
            },
        ]);
    };

    return (
        <React.Fragment>
            <View style={{ zIndex: 999 }}>
                <Toast topOffset={20} />
            </View>
            <BackIcon
                action={
                    <Text
                        style={{ fontSize: 18, fontWeight: '500', marginHorizontal: 10 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Viết đánh giá
                    </Text>
                }
                handle={handleBack}
            />
            {film !== null && (
                <View style={styles.container}>
                    <View style={styles.containerInfo}>
                        <ImageBase pathImg={film.data.image} style={{ width: 90, height: 140 }} />
                        <View style={styles.contentMain}>
                            <Text style={styles.title}>{film.data.name}</Text>
                            <Text style={styles.text}>Quốc gia: {film.data.nation}</Text>
                            <Text style={styles.text}>Thời lượng: {film.data.time} phút</Text>
                            <View style={styles.inline}>
                                {film.arrayGenre.map((item, index) => (
                                    <Text key={item._id} style={styles.text}>
                                        {item}
                                        {index < film.arrayGenre.length - 1 && ', '}
                                    </Text>
                                ))}
                            </View>
                            <Age age={film.data.age} />
                        </View>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Text>Chất lượng phim:</Text>
                            <StarRating
                                rating={star}
                                maxStars={5}
                                onChange={(value) => setStar(value)}
                                starStyle={{ marginHorizontal: -1 }}
                                starSize={30}
                                enableHalfStar={false}
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => setText(value)}
                            value={text}
                            placeholder="Viết đánh giá"
                            placeholderTextColor="#aaa"
                            // enterKeyHint={'enter'}
                            numberOfLines={5}
                            maxLength={250}
                            multiline
                            editable
                        />
                    </View>
                    <TouchableWithoutFeedback onPress={handleSubmit}>
                        <View style={styles.button}>
                            <Text style={{ color: 'white' }}>Gửi đánh giá</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )}
        </React.Fragment>
    );
};

export default WriteReview;

const styles = StyleSheet.create({
    input: {
        color: 'black',
        // flex: 1,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderStyle: 'solid',
        padding: 8,
        borderRadius: 5,
        // width: 100
        marginTop: 10,
    },
    container: {
        padding: 10,
        backgroundColor: 'white',
        flex: 1,
    },
    containerInfo: {
        // marginTop: 40,
        width: WIDTH - 20,
        borderRadius: 10,
        flexDirection: 'row',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: 'white',
        elevation: 5,
        // justifyContent: 'center'
    },
    contentMain: {
        padding: 10,
        width: WIDTH - 120,
    },
    title: {
        fontWeight: '500',
        marginBottom: 5,
    },
    text: {
        fontWeight: '300',
    },
    inline: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        backgroundColor: '#3a2a62',
        alignSelf: 'center',
        marginTop: 20,
    },
});
