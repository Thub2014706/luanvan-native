import { TabBar } from '~/components/TabBar/TabBar';
import { Tabs } from 'expo-router';

export default function ScreensLayout() {
    return (
        <Tabs tabBar={(props) => <TabBar {...props} />}>
            <Tabs.Screen name="index" options={{ headerShown: false, title: 'Home' }} />
            <Tabs.Screen name="account" options={{ headerShown: false, title: 'Account' }} />
        </Tabs>
    );
}
