import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { listCommentByFilm } from '~/services/CommentService';
import ImageBase from '~/components/ImageBase/ImageBase';
import StarRating from 'react-native-star-rating-widget';
import moment from 'moment';
import { HEIGHT, WIDTH } from '~/constants';
import BackIcon from '~/components/BackIcon/BackIcon';

const AllComment = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await listCommentByFilm(id);
            setComments(data);
        };
        fetch();
    }, [id]);

    return (
        <React.Fragment>
            <BackIcon
                action={
                    <Text
                        style={{ fontSize: 18, fontWeight: '500', marginHorizontal: 10 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Tất cả đánh giá
                    </Text>
                }
            />
            <ScrollView>
                <View style={styles.container}>
                    {comments.length > 0 ? (
                        <View>
                            {comments.map((item) => {
                                return (
                                    <View style={{ marginTop: 10 }}>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            <ImageBase
                                                pathImg={item.user.avatar}
                                                style={{ height: 40, width: 40, borderRadius: 40 }}
                                            />
                                            <View style={{flex: 1}}>
                                                <View
                                                    style={{
                                                        justifyContent: 'space-between',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <View style={{ height: 40, justifyContent: 'space-between' }}>
                                                        <Text>
                                                            {item.user.username.length <= 2 ? (
                                                                <Text>{item.user.username}</Text>
                                                            ) : (
                                                                <Text>
                                                                    {item.user.username.charAt(0)}
                                                                    {'*'.repeat(item.user.username.length - 2)}
                                                                    {item.user.username.charAt(
                                                                        item.user.username.length - 1,
                                                                    )}
                                                                </Text>
                                                            )}
                                                        </Text>
                                                        <StarRating
                                                            rating={item.star}
                                                            maxStars={5}
                                                            onChange={() => {}}
                                                            starStyle={{ marginHorizontal: -1 }}
                                                            starSize={18}
                                                        />
                                                    </View>
                                                    <Text style={{ color: 'gray' }}>
                                                        {moment(item.createdAt).format('DD/MM/YYYY')}
                                                    </Text>
                                                </View>
                                                <Text style={{ marginTop: 10 }}>{item.text}</Text>
                                            </View>
                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                            <View style={styles.line}></View>
                                        </View>
                                    </View>
                                );
                            })}
                            <Text style={{ textAlign: 'center', marginTop: 10, color: '#3a2a62' }}>
                                Không còn đánh giá nào
                            </Text>
                        </View>
                    ) : (
                        <Text style={{ textAlign: 'center', marginTop: 10, color: '#3a2a62' }}>
                            Không có đánh giá nào
                        </Text>
                    )}
                </View>
            </ScrollView>
        </React.Fragment>
    );
};

export default React.memo(AllComment);

const styles = StyleSheet.create({
    line: {
        width: WIDTH - 20,
        height: 0.5,
        backgroundColor: '#989898',
    },
    container: {
        padding: 10,
        backgroundColor: 'white',
        flex: 1,
        minHeight: HEIGHT,
    },
});
