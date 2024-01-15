import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

function CreatePostModal({ isVisible, onClose, chatroom, refreshMessages }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const isFormValid = () => title.trim() !== '' && body.trim() !== '';

    const handlePostCreation = async () => {
        const token = await SecureStore.getItemAsync('jwt');
        fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${chatroom}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CS571-ID': 'bid_bee594268d6e8ed55ef19e2874cbb54120bd165f8cceb76aecd454c15783c5fb',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title: title, content: body }),
        })
            .then(response => {
                if (response.status===200) {
                    Alert.alert("Post Created", "Your post was successfully created.");
                    setTitle('');
                    setBody('');
                    refreshMessages();
                    onClose();
                } else {                    
                    Alert.alert("Error", "There was an error creating your post.");
                };
            })
            .catch(error => {
                console.error("Error:", error);
            });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalView}>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Body"
                    value={body}
                    onChangeText={setBody}
                    multiline
                />
                <Button
                    title="Create Post"
                    onPress={handlePostCreation}
                    disabled={!isFormValid()}
                />
                <Button title="Cancel" onPress={onClose} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%',
    }
});

export default CreatePostModal;
