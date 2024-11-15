import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ImageBase from '~/components/ImageBase/ImageBase';
import { useLocalSearchParams } from 'expo-router';
import { detailEvent } from '~/services/EventService';
import Loading from '~/components/Loading/Loading';
import { HEIGHT, WIDTH } from '~/constants';
import { ScrollView } from 'react-native';
import BackIcon from '~/components/BackIcon/BackIcon';
import RenderHTML from 'react-native-render-html';

const EventDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const data = await detailEvent(id);
            setEvent(data);
        };
        fetch();
    }, [id]);

    // useEffect(() => {
    //     const paragraphs = document.querySelectorAll('p');
    //     paragraphs.forEach((p) => {
    //         p.classList.add('mb-0');
    //     });
    // }, [event?.content]);

    return event !== null ? (
        <React.Fragment>
            <BackIcon
                action={
                    <Text
                        style={{ fontSize: 18, fontWeight: '500', marginHorizontal: 10 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {event.title}
                    </Text>
                }
            />
            <ScrollView>
                <View style={styles.container}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <ImageBase
                            pathImg={event.image}
                            style={{ height: WIDTH / 2, width: WIDTH / 2, borderRadius: 10 }}
                        />
                    </View>
                    <Text style={{ fontWeight: '500', fontSize: 18, textAlign: 'center', marginTop: 10 }}>
                        {event.title}
                    </Text>
                    <RenderHTML
                        contentWidth={WIDTH}
                        source={{ html: event.content }}
                        tagsStyles={{
                            p: { textAlign: 'justify', fontWeight: '300', marginTop: 5, marginBottom: 0 },
                        }}
                    />
                </View>
            </ScrollView>
        </React.Fragment>
    ) : (
        <Loading />
    );
};

export default EventDetail;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'white',
        flex: 1,
        minHeight: HEIGHT,
    },
});
