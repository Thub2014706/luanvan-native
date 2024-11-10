import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { persistor, store } from '~/redux/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SocketProvider } from './SocketContext';

const RootLayout = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SocketProvider>
                    <SafeAreaProvider>
                        <SafeAreaView style={{ flex: 1 }}>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="(screens)" />
                                <Stack.Screen name="(bookTicket)" />
                                <Stack.Screen name="(account)" />
                            </Stack>
                        </SafeAreaView>
                    </SafeAreaProvider>
                </SocketProvider>
            </PersistGate>
        </Provider>
    );
};

export default RootLayout;

const styles = StyleSheet.create({});
