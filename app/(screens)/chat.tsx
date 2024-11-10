import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { HEIGHT, WIDTH } from '~/constants';
import { Link } from 'expo-router';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { setNumberChat } from '~/redux/socket/socketSlide';

const Chat = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    // const socket = useSelector((state) => state.socket.socketConnection);
    // const numberChat = useSelector((state) => state.socket.numberChat);
    // const [number, setNumber] = useState(numberChat);
    // const dispatch = useDispatch();

    // console.log('number', number);

    // useEffect(() => {
    //     if (user && socket) {
    //         socket.emit('number', user.data.id);
    //         socket.on('numberFirst', (num) => {
    //             // console.log('aa', num);
    //             setNumber(num);
    //             dispatch(setNumberChat(num));
    //         });

    //         socket.on('removeNumber', (num) => {
    //             setNumber(num);
    //             dispatch(setNumberChat(num));
    //         });

    //         socket.on('addNumber', (num) => {
    //             // console.log('tesst1');
    //             setNumber(num);
    //             dispatch(setNumberChat(num));
    //         });
    //         // dispatch(setSocketConnection(socket));

    //         return () => {
    //             socket.off('numberFirst');
    //             socket.off('removeNumber');
    //             socket.off('addNumber');
    //             socket.disconnect();
    //         };
    //     }
    // }, [user, dispatch, socket]);
    // console.log(numberChat);

    return (
        <View style={styles.container}>
            <Text style={{ width: '70%', textAlign: 'center' }}>
                Chào bạn {user?.data.username}! Cảm ơn bạn đã quan tâm đến CineThu. Có gì thắc mắc hãy liên hệ với chúng
                tôi nhé!
            </Text>
            <Image
                source={require('~/assets/images/admin-la-gi-1-1024x576.webp')}
                style={{ height: HEIGHT / 3, width: WIDTH }}
                resizeMethod="resize"
            />
            <Link href={'/chatScreen'}>
                <View style={styles.button}>
                    <Text style={{ color: 'white', fontSize: 16 }}>Chat ngay</Text>
                </View>
                {/* <View style={styles.number}>
                    <Text style={{ color: 'white' }}>{number}</Text>
                </View> */}
            </Link>
        </View>
    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        // paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: HEIGHT,
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    button: {
        position: 'relative',
        borderRadius: 5,
        backgroundColor: '#3a2a62',
        padding: 10,
    },
    // number: {
    //     width: 20,
    //     height: 20,
    //     borderRadius: 20,
    //     backgroundColor: 'rgb(214, 44, 44)',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     position: 'absolute',
    //     marginTop: -5,
    //     marginRight: '30%',
    //     // transform: '(-50%, -50%)'
    //     top: 0,
    //     right: 20
    // },
});
