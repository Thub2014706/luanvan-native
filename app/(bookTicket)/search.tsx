import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import BackIcon from '~/components/BackIcon/BackIcon';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { pushData, removeAllData, removeData } from '~/redux/search/search';
import { HEIGHT } from '~/constants';

const Search = () => {
    const search = useSelector((state) => state.search.data);
    const [searchs, setSearchs] = useState(search);
    const [searchChange, setSearchChange] = useState('');
    const dispatch = useDispatch();
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSearch = () => {
        router.push({ pathname: '/resultSearch', params: { search: searchChange } });
        dispatch(pushData(searchChange));
        setSearchs((pre) => [searchChange, ...pre.filter((mini) => mini !== searchChange)]);
    };

    const handleClose = (item) => {
        dispatch(removeData(item));
        setSearchs((pre) => pre.filter((mini) => item !== mini));
    };

    const handleCloseAll = () => {
        dispatch(removeAllData());
        setSearchs([]);
    };

    const handleSearchOld = (item) => {
        router.push({ pathname: '/resultSearch', params: { search: item } });
        dispatch(pushData(item));
        setSearchs((pre) => [item, ...pre.filter((mini) => mini !== item)]);
    };

    return (
        <React.Fragment>
            <BackIcon
                action={
                    <View style={styles.searchContant}>
                        <TextInput
                            ref={inputRef}
                            style={styles.input}
                            onChangeText={(value) => setSearchChange(value)}
                            value={searchChange}
                            placeholder="Tìm kiếm phim, rạp..."
                            placeholderTextColor="#aaa"
                            enterKeyHint={'enter'}
                        />
                        <Ionicons name="search-outline" size={18} color="gray" onPress={handleSearch} />
                    </View>
                }
            />
            <ScrollView>
                <View style={styles.container}>
                    {searchs.map((item) => {
                        return (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <TouchableWithoutFeedback onPress={() => handleSearchOld(item)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 }}>
                                        <Ionicons name="time-sharp" size={18} color="gray" onPress={handleSearch} />
                                        <Text key={item}>{item}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <Ionicons
                                    name="close-outline"
                                    size={18}
                                    color="gray"
                                    onPress={() => handleClose(item)}
                                />
                            </View>
                        );
                    })}
                    {searchs.length > 1 && (
                        <TouchableWithoutFeedback onPress={() => handleCloseAll()}>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ color: 'gray', textAlign: 'center' }}>Xoá tất cả</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </View>
            </ScrollView>
        </React.Fragment>
    );
};

export default Search;

const styles = StyleSheet.create({
    input: {
        color: 'black',
        // position: 'relative',
        flex: 1,
    },
    searchContant: {
        width: 80,
        // margin: 10,
        borderWidth: 1,
        // paddingVertical: 1,
        borderColor: '#aaa',
        borderRadius: 20,
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5,
        paddingHorizontal: 10,
        marginHorizontal: 20,
        height: 40
    },
    container: {
        minHeight: HEIGHT,
        padding: 10,
        backgroundColor: 'white',
        flex: 1,
        gap: 20,
    },
});
