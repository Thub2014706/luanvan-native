import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { allOrderByUser } from '~/services/OrderTicketService';
import MiniTicket from '~/components/MiniTicket/MiniTicket';
import BackIcon from '~/components/BackIcon/BackIcon';
import { allTicketRefund } from '~/services/TicketRefundService';
import RefundModal from '~/components/RefundModal/RefundModal';

const History = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [orders, setOrders] = useState([]);
    const [step, setStep] = useState(1);
    const [number, setNumber] = useState(1);
    const [length, setLength] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [idRefund, setIdRefund] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            if (step === 1) {
                setNumber(1);
                const data = await allOrderByUser(user?.data.id, 1);
                setOrders(data.data);
                setLength(data.length);
            } else {
                setNumber(1);
                const data = await allTicketRefund(user?.data.id, 1);
                setOrders(data.data);
                setLength(data.length);
            }
        };
        fetch();
    }, [user, step, modalVisible]);

    const handleShow = async () => {
        const num = number + 1;
        setNumber(num);
        const data = step === 1 ? await allOrderByUser(user?.data.id, num) : await allTicketRefund(user?.data.id, num);
        setOrders((pre) => [...pre, ...data.data]);
    };

    const handleHidden = async () => {
        setNumber((pre) => pre - 1);
        const data =
            step === 1 ? await allOrderByUser(user?.data.id, number) : await allTicketRefund(user?.data.id, number);
        const remove = data.data.length;
        setOrders((prevOrders) => prevOrders.slice(0, -remove));
    };

    return (
        <React.Fragment>
            <BackIcon
                action={
                    <Text
                        style={{ fontSize: 18, fontWeight: '500', marginStart: 10 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Lịch sử giao dịch
                    </Text>
                }
            />
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.viewSelect}>
                        <TouchableWithoutFeedback onPress={() => setStep(1)}>
                            <View style={step === 1 ? styles.selectStep : styles.noStep}>
                                <Text style={{ color: step === 1 ? 'white' : 'black' }}>Vé đã hoàn tất</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => setStep(2)}>
                            <View style={step === 2 ? styles.selectStep : styles.noStep}>
                                <Text style={{ color: step === 2 ? 'white' : 'black' }}>Vé đã hoàn</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    {orders.map((item) => {
                        return (
                            <MiniTicket
                                key={item.item._id}
                                item={item}
                                handleRefund={() => {
                                    setModalVisible((pre) => !pre);
                                    setIdRefund(item.item._id);
                                }}
                            />
                        );
                    })}
                    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                        {number < length && (
                            <TouchableWithoutFeedback onPress={handleShow}>
                                <View style={styles.button}>
                                    <Text style={{ color: 'white' }}>Hiện thêm</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                        {number > 1 && (
                            <TouchableWithoutFeedback onPress={handleHidden}>
                                <View style={styles.button}>
                                    <Text style={{ color: 'white' }}>Ẩn bớt</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    </View>
                </View>
            </ScrollView>
            {idRefund !== null && (
                <RefundModal
                    modalVisible={modalVisible}
                    setModalVisible={() => setModalVisible((pre) => !pre)}
                    id={idRefund}
                />
            )}
        </React.Fragment>
    );
};

export default React.memo(History);

const styles = StyleSheet.create({
    container: {
        padding: 10,
        gap: 10,
        backgroundColor: 'white',
    },
    viewSelect: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // gap: 20,
        backgroundColor: '#f3f3f3',
        alignSelf: 'center',
        // paddingVertical: 10,
        // paddingHorizontal: 20,
        borderRadius: 5,
        padding: 4,
    },
    selectStep: {
        borderRadius: 5,
        backgroundColor: '#989898',
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    noStep: {
        backgroundColor: 'transparent',
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    button: {
        paddingHorizontal: 10,
        backgroundColor: 'gray',
        borderRadius: 5,
        alignSelf: 'center',
        paddingVertical: 5,
    },
});
