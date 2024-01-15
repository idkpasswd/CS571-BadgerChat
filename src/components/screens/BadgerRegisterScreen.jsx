import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as SecureStore from 'expo-secure-store';

function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (!username || !password || !confirmPassword) {
            Alert.alert('Please fill in all fields');
        }
        else if (password !== confirmPassword) {
            Alert.alert('Passwords do not match');
        } else {
            props.handleSignup(username, password);
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
            />
            <Button color="crimson" title="Signup" onPress={handleRegister} />
            <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%',
    },
    error: {
        color: 'red',
    }
});

export default BadgerRegisterScreen;
