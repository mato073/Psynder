import React, { useEffect, useState } from 'react'
import socket from '../../services/socket.service'
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Text, Image } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EmojiPicker from './component/EmojiPicker'
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const Allmessage = [
    {
        author: 18,
        content: 'Salut !',
        date: new Date(),
        img: 'http://cdn0.sussexdirectories.com/rms/rms_photos/sized/82/43/134382-369395-2_320x400.jpg?pu=1426050318'
    },
    {
        author: 17,
        content: "Oui c'est pour quoi ?",
        date: new Date()
    },
    {
        author: 18,
        content: 'Tu vas bien ?',
        date: new Date(),
        img: 'http://cdn0.sussexdirectories.com/rms/rms_photos/sized/82/43/134382-369395-2_320x400.jpg?pu=1426050318'
    },
    {
        author: 17,
        content: 'Non. 😅',
        date: new Date()
    }
]

const chat = (props) => {
    const [messages, setMessages] = useState(Allmessage);
    const userId = 17

    useEffect(() => {
        socket.connect();

        return (() => {
            socket.disconnect()
        })
    }, []);

    useEffect(() => {
        socket.on('new-message', (data) => {
            const allmessages = messages;
            allmessages.push(data);
            setMessages(allmessages);
        });
        socket.on('all-messages', (data) => {
            setMessages(data);
        });

        return (() => {
            socket.on('new-message');
            socket.on('all-messages');
        })
    }, []);

    const TopBar = () => {
        return (
            <View style={styles.topBar}>
                <View style={{ marginLeft: 5 }}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Ionicons
                            name="arrow-back"
                            color={'white'}
                            size={30}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={{ color: 'white', fontSize: 19, fontWeight: "500" }}>John Doe</Text>
                </View>
                <View>
                    <SimpleLineIcons
                        name="options-vertical"
                        color={'white'}
                        size={25}
                    />
                </View>
            </View>
        )
    }
    const Chatnbar = () => {

        const [newMessage, setNewMessages] = useState("");
        const [openEmoji, setOpenEmoji] = useState(false);

        const sendMessage = (message) => {
            /* socket.emit("new-message", message) */
            setMessages((value) => {
                const data = {
                    author: 17,
                    content: message,
                    date: new Date()
                }
                return [...value, data];
            })
        }
        return (
            <View style={styles.chatBox}>
                <View style={styles.chat}>
                    <TextInput value={newMessage} onChangeText={text => setNewMessages(text)} placeholder='Nouveau message'></TextInput>
                    <View style={{display: 'flex', flexDirection: "row", alignItems: 'center' }}>
                        <TouchableOpacity style={{marginRight: 10}} onPress={() => setOpenEmoji(!openEmoji)} >
                            <SimpleLineIcons
                                name="emotsmile"
                                color={'#009387'}
                                size={20}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => sendMessage(newMessage)} >
                            <MaterialIcons name="send" size={20} color="#009387" />
                        </TouchableOpacity>
                    </View>
                </View>
                {
                   openEmoji ? <EmojiPicker messages={newMessage} setMessages={(value) => setNewMessages(value)} /> : null
                }
                {/*   <EmojiPicker messages={newMessage} setMessages={(value) => setNewMessages(value)} /> */}
            </View>
        )
    }
    const ChatFeed = ({ messages }) => {
        return (
            <View style={styles.messageList}>
                <ScrollView>
                    {
                        messages.map((message, key) => {
                            return (

                                userId === message.author ?

                                    <View key={key} style={styles.MyMessage} >
                                        <Text style={{ color: "white", fontSize: 14, padding: 10 }}>{message.content}</Text>
                                    </View>

                                    :
                                    <View key={key} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ borderRadius: 25 }}>
                                            <Image source={{ uri: message.img }} style={{ height: 30, width: 30, resizeMode: "cover", borderRadius: 150 / 2 }} />
                                        </View>
                                        <View style={styles.SenderMessage} >
                                            <Text style={{ color: "white", fontSize: 14, padding: 10 }}>{message.content}</Text>
                                        </View>
                                    </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }


    return (
        <View style={styles.chatContainer}>
            <TopBar />
            <ChatFeed messages={messages} />
            <View style={{ padding: 10 }}>
                <Chatnbar />
            </View>
        </View>
    )
}

export default chat

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    messageList: {
        flex: 5,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        marginTop: 40
    },
    MyMessage: {
        backgroundColor: '#1797e8',
        margin: 5,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        display: 'flex',
        flexWrap: 'wrap',
        alignSelf: 'flex-end'
    },
    SenderMessage: {
        backgroundColor: '#009387',
        margin: 5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        display: 'flex',
        flexWrap: 'wrap',
        alignSelf: 'flex-start'
    },
    chatBox: {
        bottom: 0,
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        margin: 10,
    },
    topBar: {
        top: 0,
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 50,
        backgroundColor: "#009387",
    },
    chat: {
        display: "flex",
        flexDirection: 'row',
        borderRadius: 10,
        borderColor: "black",
        justifyContent: 'space-between',
        padding: 5,
        borderWidth: 1,
        backgroundColor: '#F6F8FE',
        alignItems: 'center',
    }
})
