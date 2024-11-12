import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import ImageBase from '~/components/ImageBase/ImageBase';
import { HEIGHT, WIDTH } from '~/constants';
import { detailPopup } from '~/services/PopupService';

export const ShowUpContext = createContext();

export function ShowUpProvider({ children }) {
    const [showUp, setShowUp] = useState(true);
    const [pop, setPop] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const data = await detailPopup();
            if (data) {
                setPop(data.image);
            }
        };
        fetch();
    }, []);

    return (
        <ShowUpContext.Provider value={{ showUp, setShowUp }}>
            {pop !== null && showUp && (
                <View
                    style={{
                        width: WIDTH,
                        height: HEIGHT,
                        top: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        
                    }}
                >
                    <ImageBase
                        pathImg={pop}
                        style={{
                            width: WIDTH - 20,
                            height: HEIGHT / 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        resizeMode="contain"
                    />
                    <Ionicons
                        name="close-circle-outline"
                        size={35}
                        color="white"
                        style={{ position: 'absolute', right: 10, top: '20%' }}
                        onPress={() => setShowUp(false)}
                    />
                </View>
            )}
            {children}
        </ShowUpContext.Provider>
    );
}

export function useShowUp() {
    return useContext(ShowUpContext);
}
