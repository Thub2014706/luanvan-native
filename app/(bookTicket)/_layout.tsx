import { Stack } from 'expo-router';

export default function HomeLayout() {
    return (
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="details/[id]" />
                <Stack.Screen name="seat/[showTime]" />
                <Stack.Screen name="comboList" />
            </Stack>
    );
}
