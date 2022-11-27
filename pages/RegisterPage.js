import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, ImageBackground } from 'react-native';

import { buildPath } from '../assets/scripts/Path';
import { hash } from '../assets/scripts/HelperFunctions';
import { globalStyles } from '../assets/scripts/GlobalStyles';

export default function RegisterPage({ navigation }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registrationMessage, setRegistrationMessage] = useState('');

    const handleRegister = async function() {
        if (email.trim() === '' || username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
            setRegistrationMessage('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            setRegistrationMessage('Your passwords do not match');
            return;
        }

        let hashedPassword = await hash(password);
        let obj = {
            email: email,
            username: username,
            password: hashedPassword
        };
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('/api/register'), {
                method:'POST', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());
            if (res.error) {
                setRegistrationMessage(res.error);
                return;
            }

            setEmail('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setRegistrationMessage('A confirmation link has been sent to your email');
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
                    <Text style={styles.header}>Register</Text>
                </View>

                <View style={styles.formInput}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Email'
                        value={email}
                        onChangeText={(val) => setEmail(val)} />

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

                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChangeText={(val) => setConfirmPassword(val)}
                        secureTextEntry={true} />

                    <View style={styles.buttonPadding}>
                        <Button
                            title='Register'
                            color='#b93e3e'
                            onPress={handleRegister} />
                    </View>
                    <Text style={styles.resultMessage}>{registrationMessage}</Text>
                    <View>
                        <Button
                            title='Back to log in'
                            color='#b93e3e'
                            onPress={() => navigation.navigate('Login')} />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    display: {
        paddingBottom: 30
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
