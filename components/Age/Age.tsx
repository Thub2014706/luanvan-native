import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { signAge, standardAge } from '~/constants'

const Age = ({age}) => {
  return (
    <View style={styles.container}>
      <Text style={{fontWeight: '600'}}>{signAge[standardAge.findIndex((mini) => mini === age)]}</Text>
    </View>
  )
}

export default Age

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical:3,
        backgroundColor: '#d99a00',
        borderRadius: 5,
        alignSelf: 'flex-start',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    }
})