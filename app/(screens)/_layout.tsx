import { TabBar } from '~/components/TabBar/TabBar';
import { Tabs } from 'expo-router';
import { ShowUpProvider } from '../showUp';

export default function ScreensLayout() {
    return (
        <ShowUpProvider>
            <Tabs tabBar={(props) => <TabBar {...props} />}>
                <Tabs.Screen name="index" options={{ headerShown: false, title: 'Trang chủ' }} />
                <Tabs.Screen name="chat" options={{ headerShown: false, title: 'Chat' }} />
                <Tabs.Screen name="account" options={{ headerShown: false, title: 'Tài khoản' }} />
            </Tabs>
        </ShowUpProvider>
    );
}
