import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Checkbox from 'expo-checkbox';
import { addTicketRefund } from '~/services/TicketRefundService';
import { useSelector } from 'react-redux';

const RefundModal = ({ setModalVisible, modalVisible, id }) => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [isChecked, setChecked] = useState(false);

    const handleSubmit = async () => {
        if (isChecked) {
            await addTicketRefund({ order: id, user: user?.data.id });
            setModalVisible(!modalVisible);
        }
    };
    return (
        <View>
            <Modal
                animationType="sTextde"
                transparent={true}
                visible={modalVisible}
                // onRequestClose={() => {
                //     Alert.alert('Modal has been closed.');
                //     setModalVisible(!modalVisible);
                // }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontWeight: '500', fontSize: 16, marginBottom: 10 }}>
                            Điều kiện và điều khoản
                        </Text>
                        <Text>
                            - Bạn chỉ có thể hoàn vé tối đa 2 lần/tháng nếu ở cấp độ Member hoặc 5 lần/tháng nếu ở cấp
                            độ VIP.
                        </Text>
                        <Text>- Bạn có thể yêu cầu hoàn vé trước 60 PHÚT suất chiếu diễn ra.</Text>
                        <Text>- Giao dịch có sử dụng khuyến mãi sẽ không được hoàn vé.</Text>
                        <Text>- Giao dịch có sử dụng điểm thưởng sẽ được hoàn lại tương ứng.</Text>
                        <Text>- Không hỗ trợ hoàn vé đối với các giao dịch đã được in vé tại rạp.</Text>
                        <Text>- Số tiền đã thanh toán sẽ được hoàn lại tương ứng vào số điểm.</Text>
                        <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
                            <Checkbox value={isChecked} onValueChange={setChecked} />
                            <Text>Tôi đồng ý với điều khoản</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 10,
                            }}
                        >
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>Đóng</Text>
                            </Pressable>
                            <Pressable style={[styles.button, styles.buttonSubmit]} onPress={() => handleSubmit()}>
                                <Text style={styles.textStyle}>Đồng ý</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default RefundModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        aTextgnItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        aTextgnItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 5,
        paddingVertical: 10,
        elevation: 2,
        paddingHorizontal: 15,
    },
    buttonSubmit: {
        backgroundColor: '#3a2a62',
    },
    buttonClose: {
        backgroundColor: 'gray',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textATextgn: 'center',
    },
    modalText: {
        marginBottom: 15,
        textATextgn: 'center',
    },
});
