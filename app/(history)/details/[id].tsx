import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ticketRefundByOrder } from '~/services/TicketRefundService';
import Barcode from "react-native-barcode-builder";
import { detailOrderTicket } from '../../../services/OrderTicketService';
// import {ART} from 'react-native';
// const {Surface, Shape} = ART;
import {Surface, Shape} from '@react-native-community/art';

const DetailTicket = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [order, setOrder] = useState(null);
    const [refund, setRefund] = useState();

    useEffect(() => {
        const fetch = async () => {
            // if (status === 2) {
            const data = await detailOrderTicket(id);
            setOrder(data);
            // }
            console.log(data);
        };
        fetch();
    }, [id]);

    useEffect(() => {
        const fetch = async () => {
            if (order !== null) {
                const data = await ticketRefundByOrder(order._id);
                setRefund(data);
            }
        };
        fetch();
    }, [order]);

    return (
        order !== null && (
            <View>
                <View>
                    <Barcode value={id} height={50} width={1} fontSize={10} fontOptions="Courier New, monospace" />
                </View>
            </View>
        )
    );
};

export default DetailTicket;

const styles = StyleSheet.create({});
