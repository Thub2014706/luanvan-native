import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { HEIGHT } from '~/constants';
import ChatList from '~/components/ChatList/ChatList';
import InputChat from '~/components/InputChat/InputChat';
import { useDispatch, useSelector } from 'react-redux';
import BackIcon from '~/components/BackIcon/BackIcon';
import { SocketContext } from './SocketContext';

const chatScreen = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [chats, setChats] = useState([]);
    // const socket = useSelector((state) => state.socket.socketConnection);
    const socket = useContext(SocketContext);
    // console.log(socket);
    
    useEffect(() => {
        if (user && socket) {
            socket.emit('join', user.data.id);

            socket.on('chat', (listChat) => {
                setChats(listChat);
            });

            socket.on('message', (msg) => {
                setChats((prevChats) => [...prevChats, msg]);
            });

            // Cleanup socket khi component unmount
            return () => {
                socket.off('chat');
                socket.off('message');
                socket.emit('leave', user.data.id);
                // socket.disconnect()
            };
        } else {
            setChats([]);
        }
    }, [user, socket]);

    const addMessage = (chat) => {
        if (chat && chat !== '' && socket) {
            const newChat = { user: user?.data.id, message: chat, senderType: true };
            socket.emit('newMessage', newChat);
        }
    };

    return (
        <React.Fragment>
            <BackIcon
                action={
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: '500', marginStart: 10 }}>CineThu</Text>
                    </View>
                }
            />
            <View style={styles.container}>
                <View>
                    {/* <h5 className="mb-0">CineThu</h5>
                        <div>
                            <FontAwesomeIcon
                                icon={faXmark}
                                size="lg"
                                onClick={handleClose}
                                style={{ cursor: 'pointer' }}
                            />
                        </div> */}
                </View>
                <View style={{ flex: 1, padding: 10 }}>
                    <ChatList chats={chats} user={user} />
                </View>
                <View>
                    <InputChat addMessage={addMessage} />
                </View>
            </View>
        </React.Fragment>
    );
};

export default chatScreen;

const styles = StyleSheet.create({
    container: {
        minHeight: HEIGHT,
        flex: 1,
    },
});
