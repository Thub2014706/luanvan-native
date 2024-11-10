import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarButton from '../TabBarButton/TabBarButton';
import { useState } from 'react';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    // const [dimentions, setDimentions] = useState({ height: 20, width: 100 });
    // const buttonWidth = dimentions.width / state.routes.length;
    return (
        <View style={styles.tabbar}>
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
                        color={isFocused ? '#673ab7' : '#222'}
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
        marginHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        shadowOpacity: 0.1,
    },
});
