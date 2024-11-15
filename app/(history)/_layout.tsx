import { Stack } from 'expo-router';

export default function HistoryLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ticket/[order]" />
            {/* <Stack.Screen name="details/[order]" /> */}
            <Stack.Screen name="history" />
        </Stack>
    );
}
