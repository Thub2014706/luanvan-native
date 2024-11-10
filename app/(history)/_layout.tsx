import { Stack } from 'expo-router';

export default function HistoryLayout() {
    return (
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="history" />
                <Stack.Screen name="details/[id]" />
            </Stack>
    );
}
