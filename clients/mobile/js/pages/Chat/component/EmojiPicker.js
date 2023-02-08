import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { smile } from './emojis.json'

const EmojiPicker = ({ messages, setMessages }) => {

    const selectEmoji = (emoji) => {
        setMessages(messages.concat(emoji));
    }

    return (
        <View style={styles.EmojiContainer}>
            <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                {
                    smile.map((item, key) => {
                        return <TouchableOpacity key={key} onPress={() => selectEmoji(item)} ><Text style={{ fontSize: 15 }}>{item}</Text></TouchableOpacity>
                    })
                }
            </View>
        </View>
    )
}

export default EmojiPicker

const styles = StyleSheet.create({
    EmojiContainer: {
        display: "flex",
        flex: 2,
        padding: 20
    }
})

