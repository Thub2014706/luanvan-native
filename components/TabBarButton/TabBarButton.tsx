import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { HEIGHT, icon } from '~/constants';
import { useSharedValue } from 'react-native-reanimated';

const TabBarButton = ({
    onPress,
    onLongPress,
    isFocused,
    routeName,
    color,
    label,
}: {
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    routeName: string;
    color: string;
    label: string;
}) => {
    // const scale = useSharedValue(0);
    // console.log(icon[routeName]);
    
    return (
        <Pressable onPress={onPress} onLongPress={onLongPress} style={[styles.tabbarItem, isFocused && styles.select]}>
            {icon[routeName] &&
                icon[routeName]({
                    color: isFocused ? 'white' : '#222',
                })}
            <Text style={{ color: isFocused ? 'white' : '#222' }}>{label}</Text>
        </Pressable>
    );
};

export default TabBarButton;

const styles = StyleSheet.create({
    tabbarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    select: {
        backgroundColor: '#673ab7',
        borderRadius: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
