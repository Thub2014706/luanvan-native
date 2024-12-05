import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import { Image } from 'react-native';
import { HEIGHT, WIDTH } from '~/constants';

const ChatList = ({ chats, user }) => {
    // console.log(chats);
    const scrollViewRef = useRef();

    useEffect(() => {
        scrollToBottom();
    }, [chats]);

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <ScrollView ref={scrollViewRef} onContentSizeChange={() => scrollToBottom()}>
            <View style={styles.container}>
                {user && chats.length > 0 ? (
                    chats.map(
                        (item, index) =>
                            item.user === user.data.id &&
                            (item.senderType === true ? (
                                <React.Fragment>
                                    {(!chats[index - 1] ||
                                        momentTimezone
                                            .tz(chats[index - 1].createdAt, 'Asia/Ho_Chi_Minh')
                                            .add(30, 'minutes')
                                            .isBefore(momentTimezone.tz(item.createdAt, 'Asia/Ho_Chi_Minh'))) && (
                                        <View style={styles.timeBig}>
                                            <Text style={{ color: 'gray' }}>
                                                {moment(item.createdAt).format('HH:mm DD/MM/YYYY')}
                                            </Text>
                                        </View>
                                    )}
                                    <View style={styles.chatSender}>
                                        <Text>{item.message}</Text>
                                        {((chats[index + 1] &&
                                            (!chats[index + 1].senderType ||
                                                momentTimezone
                                                    .tz(item.createdAt, 'Asia/Ho_Chi_Minh')
                                                    .add(30, 'minutes')
                                                    .isBefore(
                                                        momentTimezone.tz(
                                                            chats[index + 1].createdAt,
                                                            'Asia/Ho_Chi_Minh',
                                                        ),
                                                    ))) ||
                                            !chats[index + 1]) && (
                                            <Text style={{ color: 'gray', fontSize: 12 }}>
                                                {moment(item.createdAt).format('HH:mm')}
                                            </Text>
                                        )}
                                    </View>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {/* thoi gian center */}
                                    {(!chats[index - 1] ||
                                        momentTimezone
                                            .tz(chats[index - 1].createdAt, 'Asia/Ho_Chi_Minh')
                                            .add(30, 'minutes')
                                            .isBefore(momentTimezone.tz(item.createdAt, 'Asia/Ho_Chi_Minh'))) && (
                                        <View style={styles.timeBig}>
                                            <Text style={{ color: 'gray' }}>
                                                {moment(item.createdAt).format('HH:mm DD/MM/YYYY')}
                                            </Text>
                                        </View>
                                    )}

                                    {/* chat */}
                                    <View style={{ flexDirection: 'row' }}>
                                        <View>
                                            {(chats[index - 1] &&
                                                (chats[index - 1].senderType ||
                                                    momentTimezone
                                                        .tz(chats[index - 1].createdAt, 'Asia/Ho_Chi_Minh')
                                                        .add(30, 'minutes')
                                                        .isBefore(
                                                            momentTimezone.tz(item.createdAt, 'Asia/Ho_Chi_Minh'),
                                                        ))) ||
                                            !chats[index - 1] ? (
                                                <Image
                                                    source={require('~/assets/images/admin.jpg')}
                                                    style={{ height: 40, width: 40, borderRadius: 40, marginEnd: 5 }}
                                                />
                                            ) : (
                                                <View style={{ width: 45 }}></View>
                                            )}
                                        </View>
                                        <View style={styles.chatReceiver}>
                                            <Text>{item.message}</Text>
                                            {((chats[index + 1] &&
                                                (chats[index + 1].senderType ||
                                                    momentTimezone
                                                        .tz(item.createdAt, 'Asia/Ho_Chi_Minh')
                                                        .add(30, 'minutes')
                                                        .isBefore(
                                                            momentTimezone.tz(
                                                                chats[index + 1].createdAt,
                                                                'Asia/Ho_Chi_Minh',
                                                            ),
                                                        ))) ||
                                                !chats[index + 1]) && (
                                                <Text style={{ color: 'gray', fontSize: 12 }}>
                                                    {moment(item.createdAt).format('HH:mm')}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </React.Fragment>
                            )),
                    )
                ) : (
                    <View></View>
                    // <div className="px-4 pt-5">
                    //     {/* <img src={img1} className="d-block mx-auto mb-1" height={110} alt="" /> */}
                    //     <p className="text-center">
                    //         Chào bạn {user.data.username}! Cảm ơn bạn đã quan tâm đến CineThu. Có gì thắc mắc hãy liên hệ
                    //         với chúng tôi nhé!
                    //     </p>
                    // </div>
                )}
            </View>
        </ScrollView>
    );
};

export default ChatList;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 10,
    },
    timeBig: {
        borderRadius: 10,
        backgroundColor: 'rgb(219, 219, 219)',
        justifyContent: 'center',
        paddingHorizontal: 15,
        alignItems: 'center',
        width: 'auto',
        alignSelf: 'center',
        marginVertical: 10,
    },
    chatSender: {
        maxWidth: '60%',
        backgroundColor: '#d8c3f5',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignSelf: 'flex-end',
        borderRadius: 10,
        marginVertical: 5,
    },
    chatReceiver: {
        maxWidth: '60%',
        backgroundColor: 'rgb(219, 219, 219)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignSelf: 'flex-start',
        borderRadius: 10,
        marginVertical: 5,
    },
});
