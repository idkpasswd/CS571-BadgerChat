import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from '@react-navigation/native';

import * as secureStore from 'expo-secure-store';

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Please enter both username and password');
            return;
        }
        else {
            props.handleLogin(username, password);
            setUsername('');
            setPassword('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
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
            <Button color="crimson" title="Login" onPress={handleLogin} />
            <Text style={{ fontSize: 18 }}>New Here?</Text>
            <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
            <Button color="grey" title="Continue As Guest" onPress={() => props.guestLogin()} />
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

export default BadgerLoginScreen;
