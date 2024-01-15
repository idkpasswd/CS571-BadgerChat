import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerGuestRegister from './screens/BadgerGuestRegister';

const ChatDrawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [token, setToken] = useState('');
  // const navigation = useNavigation();

  useEffect(() => {
    fetch('https://cs571.org/api/f23/hw9/chatrooms	', {
      method: 'GET',
      headers: {
        'X-CS571-ID': 'bid_bee594268d6e8ed55ef19e2874cbb54120bd165f8cceb76aecd454c15783c5fb'
      },
    }).then(res => res.json()).then(data => setChatrooms(data));
    // for example purposes only!
  }, []);

  const getToken = async () => {
    const token = await SecureStore.getItemAsync('jwt');
    setToken(token);
  }

  function handleLogin(username, password) {
    // hmm... maybe this is helpful!
    fetch('https://cs571.org/api/f23/hw9/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CS571-ID': 'bid_bee594268d6e8ed55ef19e2874cbb54120bd165f8cceb76aecd454c15783c5fb'
      },
      body: JSON.stringify({ username, password }),
    }).then(response => {
      if (response.status === 200) {
        response.json().then(data => {
          SecureStore.setItemAsync('username', username);
          SecureStore.setItemAsync('jwt', data.token).then(() => {
            console.log("t", data.token)
            setIsLoggedIn(true);
          })
        });

        Alert.alert("Login successful!");
      } else if (response.status === 401) {
        Alert.alert("Incorrect username or password!");
      } else {
        Alert.alert("Other Error!");
      }
    })
    // I should really do a fetch to login first!
  }

  function guestLogin() {
    setIsLoggedIn(true);
  }

  function handleSignup(username, password) {
    // hmm... maybe this is helpful!
    fetch('https://cs571.org/api/f23/hw9/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CS571-ID': 'bid_bee594268d6e8ed55ef19e2874cbb54120bd165f8cceb76aecd454c15783c5fb'
      },
      body: JSON.stringify({ username, password }),
    }).then(response => {
      if (response.status === 200) {
        response.json().then(data => {
          SecureStore.setItemAsync('username', username);
          SecureStore.setItemAsync('jwt', data.token).then(() => {
            setIsLoggedIn(true);
          })
        });
      } else if (response.status === 409) {
        Alert.alert('Username is already taken');
      } else {
        Alert.alert('Other Error');
      }
    })
    // I should really do a fetch to register first!
  }

  function Logout() {
    const handleLogout = async () => {
      await SecureStore.deleteItemAsync('jwt');
      await SecureStore.deleteItemAsync('username');
      setIsLoggedIn(false);
      setIsRegistering(false);
      const token = await SecureStore.getItemAsync('jwt');
      console.log("logout", token);
    };
    handleLogout();
  }

  function toRegister() {
    setIsLoggedIn(false);
    setIsRegistering(true);
  }

  if (isLoggedIn) {
    getToken();
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} />}
              </ChatDrawer.Screen>
            })
          }
          {token === null ? (<ChatDrawer.Screen name="Signup">{(props) => <BadgerGuestRegister toRegister={toRegister} />}</ChatDrawer.Screen>
          ) : (<ChatDrawer.Screen name="Logout">{(props) => <BadgerLogoutScreen Logout={Logout} />}</ChatDrawer.Screen>
          )}
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen name="Login" handleLogin={handleLogin} setIsRegistering={setIsRegistering} guestLogin={guestLogin} />
  }
}