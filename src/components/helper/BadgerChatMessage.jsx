import { Text, Button, Alert } from "react-native";
import BadgerCard from "./BadgerCard"
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from "react";

function BadgerChatMessage(props) {
    const [isOwnedByUser, setIsOwnedByUser] = useState(false);

    useEffect(() => {

        const getUserName = async () => {
            let userName = await SecureStore.getItemAsync('username');
            if (userName !== null) {
                setIsOwnedByUser(props.message.poster.toLowerCase() === userName.toLowerCase());
            }

        };

        getUserName();

    }, [props.message]);

    const dt = new Date(props.message.created);

    const handleDelete = async (messageId) => {
        const token = await SecureStore.getItemAsync('jwt');

        fetch(`https://cs571.org/api/f23/hw9/messages?id=${messageId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CS571-ID': 'bid_bee594268d6e8ed55ef19e2874cbb54120bd165f8cceb76aecd454c15783c5fb',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (response.status) {
                    Alert.alert("Post Deleted", "Your post was successfully deleted.");
                    props.refreshMessages();
                } else {
                    Alert.alert("Error", "There was an error deleting your post.");
                }
            });
    };

    return <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: 600 }}>{props.message.title}</Text>
        <Text style={{ fontSize: 12 }}>by {props.message.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
        <Text></Text>
        <Text>{props.message.content}</Text>
        {isOwnedByUser && (
            <Button
                title="Delete"
                color="red"
                onPress={() => handleDelete(props.message.id)}
            />
        )}
    </BadgerCard>
}

export default BadgerChatMessage;