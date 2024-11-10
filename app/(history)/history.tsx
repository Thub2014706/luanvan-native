import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { allOrderByUser } from '~/services/OrderTicketService';
import MiniTicket from '~/components/MiniTicket/MiniTicket';

const History = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [orders, setOrders] = useState([]);
    const [showDetail, setShowDetail] = useState(false);
    const [detail, setSetail] = useState();
    const [showRefund, setShowRefund] = useState(false);
    const [idRefund, setIdRefund] = useState(false);
    const [step, setStep] = useState(1);
    const [number, setNumber] = useState(1);
    const [length, setLength] = useState();
    const [showTicket, setShowTicket] = useState(false);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            if (step === 1) {
                setNumber(1);
                const data = await allOrderByUser(user?.data.id, 1);
                setOrders(data.data);
                setLength(data.length);
            }
            // else {
            //     setNumber(1);
            //     const data = await allTicketRefund(user?.data.id, 1);
            //     setOrders(data.data);
            //     setLength(data.length);
            // }
        };
        fetch();
    }, [user, step]);
    // console.log(orders);

    // const handleShowDetail = (item) => {
    //     setShowDetail(true);
    //     setSetail(item);
    // };

    // const handleCloseDetail = () => {
    //     setShowDetail(false);
    //     setSetail();
    // };

    // const handleShowRefund = (idRefund) => {
    //     setIdRefund(idRefund);
    //     setShowRefund(true);
    //     handleCloseDetail();
    // };

    // const handleCloseRefund = () => {
    //     setIdRefund();
    //     setShowRefund(false);
    // };

    // const handleNumber = async (num) => {
    //     setNumber(num);
    //     window.scrollTo({
    //         top: 0,
    //         behavior: 'smooth',
    //     });
    //     const data = step === 1 ? await allOrderByUser(user?.data.id, num) : await allTicketRefund(user?.data.id, num);
    //     setOrders(data.data);
    //     setLength(data.length);
    // };

    // const handleShowTicket = (item) => {
    //     setOrder(item);
    //     setShowTicket(true);
    // };

    // const handleCloseTicket = () => {
    //     setOrder(null);
    //     setShowTicket(false);
    // };

    return (
        <ScrollView>
            <View style={styles.container}>
                {orders.map((item) => {
                    return <MiniTicket key={item.item._id} item={item} />;
                })}
            </View>
        </ScrollView>
    );
};

export default React.memo(History);

const styles = StyleSheet.create({
    container: {
        padding: 10,
        gap: 10,
        backgroundColor: 'white'
    },
});
