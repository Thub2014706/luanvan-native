import { StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { avgComment, listCommentByFilm } from '~/services/CommentService';
import StarRating from 'react-native-star-rating-widget';
import { WIDTH } from '~/constants';
import ImageBase from '../ImageBase/ImageBase';
import { useSelector } from 'react-redux';
import { detailUserById } from '~/services/UserService';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';

const ReviewFilm = ({ id }) => {
    const [avg, setAvg] = useState(0);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await avgComment(id);
            setAvg(data);
        };
        fetch();
    }, [id]);

    useEffect(() => {
        const fetch = async () => {
            const data = await listCommentByFilm(id);
            setComments(data);
        };
        fetch();
    }, [id]);

    const handleAllComment = () => {
        router.push({ pathname: '/allComment/[film]', params: { id } });
    };

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{ fontWeight: '500', fontSize: 16 }}>Tất cả đánh giá</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Text style={{ fontWeight: '500', fontSize: 18, color: '#fdd835' }}>{avg ? avg : 0}/5</Text>
                        <StarRating
                            rating={avg}
                            maxStars={5}
                            onChange={() => {}}
                            starStyle={{ marginHorizontal: -1 }}
                            starSize={24}
                        />
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={handleAllComment}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#3a2a62' }}>Xem tất cả</Text>
                        <Ionicons name="chevron-forward-outline" size={18} color="#3a2a62" />
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <View style={styles.line}></View>
            </View>
            <View>
                {comments.length > 0 ? (
                    <View>
                        {comments.map((item, index) => {
                            return (
                                index < 3 && (
                                    <View key={index} style={{ marginTop: 10 }}>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            <ImageBase
                                                pathImg={item.user.avatar}
                                                style={{ height: 40, width: 40, borderRadius: 40 }}
                                            />
                                            <View style={{ flex: 1 }}>
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
                                )
                            );
                        })}
                    </View>
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 10, color: '#3a2a62' }}>Không có đánh giá nào</Text>
                )}
                <View style={styles.button}>
                    <Link href={{ pathname: '/write/[film]', params: { id } }}>
                        <Text style={{ color: 'white' }}>Viết đánh giá</Text>
                    </Link>
                </View>
            </View>
        </View>
    );
};

export default ReviewFilm;

const styles = StyleSheet.create({
    line: {
        width: WIDTH - 20,
        height: 0.5,
        backgroundColor: '#989898',
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 5,
        backgroundColor: '#3a2a62',
        alignSelf: 'center',
        marginTop: 20,
    },
});
