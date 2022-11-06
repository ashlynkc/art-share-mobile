import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, ImageBackground } from 'react-native';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async function() {
        console.log(email);
        console.log(username);
        console.log(password);
        console.log(confirmPassword);
    }

    return(
        <View>
            <ImageBackground style={styles.background}>
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

                    <View style={styles.button}>
                        <Button 
                            title='Register' 
                            onClick={handleRegister} />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#ffa6a6'
    },
    display: {
        paddingBottom: 100
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
        fontSize: 20,
        fontWeight: 'bold'
    },
    input: {
        paddingLeft: 10,
        backgroundColor: '#e3e3e3',
        height: 40,
        width: 200
    },
    button: {
        paddingTop: 25,
        width: '50%'
    }
});