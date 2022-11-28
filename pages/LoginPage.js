import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { globalStyles } from '../assets/scripts/GlobalStyles';
import { buildPath } from '../assets/scripts/Path';
import { hash } from '../assets/scripts/HelperFunctions';

export default function LoginPage({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    const handleLogin = async function() {
        if (username.trim() === '' || password.trim() === '') {
            setLoginMessage('Please fill in all fields');
            return;
        }

        let hashedPassword = await hash(password);
        let obj = {username: username, password: hashedPassword};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('/api/login'), {
                method:'POST', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());
            if (res.error) {
                setLoginMessage(res.error);
                return;
            }

            await AsyncStorage.setItem('userData', JSON.stringify(res.user));
            await AsyncStorage.setItem('accessToken', res.accessToken);
            navigation.navigate('Home');
        }
        catch(e) {
            console.error(e);
        }
    }

    return(
        <View>
            <ImageBackground style={globalStyles.background}>
                <View style={styles.display}>
                    <Text style={styles.title}>Art Share</Text>
                    <Text style={styles.header}>Log In</Text>
                </View>

                <View style={styles.formInput}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Username'
                        value={username}
                        onChangeText={(val) => setUsername(val)} />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Password'
                        value={password}
                        onChangeText={(val) => setPassword(val)}
                        secureTextEntry={true} />
                    <View style={styles.buttonPadding}>
                        <Button
                            title='Log In'
                            color='#b93e3e'
                            onPress={handleLogin} />
                    </View>
                    <Text style={styles.resultMessage}>{loginMessage}</Text>
                    <View>
                        <Button
                            title='Register an Account'
                            color='#b93e3e'
                            onPress={() => navigation.navigate('Register')} />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    display: {
        paddingBottom: 60
    },
    title: {
        textAlign: 'center',
        fontSize: 45,
        fontWeight: 'bold',
        color: '#b93e3e',
        paddingTop: 40
    },
    header: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
    formInput: {
        display: 'flex',
        alignItems: 'center',
        height: '100%'
    },
    label: {
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 5,
        fontSize: 20,
        fontWeight: 'bold'
    },
    input: {
        paddingLeft: 10,
        backgroundColor: '#e3e3e3',
        height: 40,
        width: 200
    },
    buttonPadding: {
        paddingTop: 25,
        width: '50%'
    },
    resultMessage: {
        textAlign: 'center',
        width: '70%',
        paddingTop: 15,
        fontSize: 20,
        fontWeight: 'bold'
    }
});
