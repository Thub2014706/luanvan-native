import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { WIDTH } from '~/constants';

const InputChat = ({ addMessage }) => {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        addMessage(message);
        setMessage('');
    };
    // console.log(message);

    return (
        <View style={styles.container}>
            <TextInput
                multiline={true}
                numberOfLines={3}
                style={styles.input}
                onChange={(e) => setMessage(e.nativeEvent.text)}
                value={message}
                placeholder="Nhập tin nhắn"
            />
            <Ionicons name="send" size={24} onPress={sendMessage} color="#aec7fa" />
        </View>
    );
};

export default InputChat;

const styles = StyleSheet.create({
    input: {
        // height: 35,
        // borderWidth: 1,
        padding: 10,
        width: '90%',
        // borderRadius: 5,
        height: 40,
        // maxHeight: 120,
        textAlignVertical: 'top',
        // borderColor: 'gray',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        bottom: 0,
        // position: 'absolute',
        // marginHorizontal: 10,
        backgroundColor: 'white',
        width: WIDTH,
        padding: 10,
    },
});
