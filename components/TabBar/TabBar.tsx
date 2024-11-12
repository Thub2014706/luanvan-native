import { View, Text, TouchableOpacity, StyleSheet, LayoutChangeEvent } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarButton from '../TabBarButton/TabBarButton';
import { useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const [dimentions, setDimentions] = useState({ height: 0, width: 100 });
    const buttonWidth = dimentions.width / state.routes.length;

    const onTabbarLayout = (e: LayoutChangeEvent) => {
        setDimentions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        });
    };

    const tabPositionX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: tabPositionX.value }],
        };
    });

    return (
        <View onLayout={onTabbarLayout} style={[styles.tabbar]}>
            <Animated.View
                style={[
                    animatedStyle,
                    {
                        position: 'absolute',
                        backgroundColor: '#723feb',
                        borderRadius: 30,
                        marginHorizontal: 5,
                        height: dimentions.height - 15,
                        width: buttonWidth - 10,
                    },
                ]}
            />
            {state.routes.map((route, index) => {
                // console.log(route);

                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    tabPositionX.value = withSpring(buttonWidth * index, { duration: 1500 });
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                // const newRoute = route.name.replace(/[()]/g, '');

                return (
                    <TabBarButton
                        key={route.name}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabbarItem}
                        isFocused={isFocused}
                        routeName={route.name}
                        color={isFocused ? '#fff' : '#222'}
                        label={label}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        shadowOpacity: 0.1,
        elevation: 15,
    },
});
