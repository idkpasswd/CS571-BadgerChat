import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Button, Alert } from "react-native";
import BadgerChatMessage from '../helper/BadgerChatMessage';
import CreatePostModal from '../helper/BadgerModel';
import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 4;
    const [isModalVisible, setModalVisible] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        fetchMessages(currentPage);
        getToken();
    }, [props.chatroom, currentPage]);

    const getToken = async () => {
        const token = await SecureStore.getItemAsync('jwt');
        setToken(token);
    }

    const fetchMessages = (page) => {
        fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${props.name}&page=${page}`, {
            method: 'GET',
            headers: {
                'X-CS571-ID': 'bid_bee594268d6e8ed55ef19e2874cbb54120bd165f8cceb76aecd454c15783c5fb'
            },
        })
            .then(res => res.json())
            .then(data => {
                setMessages(data.messages);
            });
    };

    const refreshMessages = () => {
        fetchMessages(1);
        setCurrentPage(1);
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <View>
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <BadgerChatMessage key={message.id} message={message} refreshMessages={refreshMessages} />
                        ))
                    ) : (
                        <Text>There's nothing here!</Text>
                    )}
                </View>
            </ScrollView>
            <View style={styles.paginationContainer}>
                <Button
                    title="Previous"
                    onPress={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                <Text>Page {currentPage}</Text>
                <Button
                    title="Next"
                    onPress={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages || messages.length === 0}
                />
            </View>
            {token === null ? (<View></View>) : (
                <View>
                    <Button title="Create Post" onPress={() => setModalVisible(true)} />
                    <CreatePostModal
                        isVisible={isModalVisible}
                        onClose={() => setModalVisible(false)}
                        chatroom={props.name}
                        refreshMessages={refreshMessages}
                    />
                </View>)}
        </View>
    );
}

const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    }
});

export default BadgerChatroomScreen;
