import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, ImageBackground } from 'react-native';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as ImagePicker from 'expo-image-picker';
const FileSystem = require('expo-file-system');

import { globalStyles } from '../assets/scripts/GlobalStyles';
import { buildPath } from '../assets/scripts/Path';

const MAX_CHARS_IN_DESC = 500;

export default function AddPostPage({ navigation }) {
    // Retrieve items from local storage
    const [userData, setUserData] = useState({});
    const [accessToken, setAccessToken] = useState('');
    useEffect(() => {
        _setUserData();
        _setAccessToken();
    }, []);

    const _setUserData = async function() {
        setUserData(JSON.parse(await AsyncStorage.getItem('userData')));
    }

    const _setAccessToken = async function() {
        setAccessToken(await AsyncStorage.getItem('accessToken'));
    }

    // For Art Info
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [message, setMessage] = useState('');

    // For Image upload
    const [filedata, setFiledata] = useState('');
    const [fileMessage, setFileMessage] = useState('');
    const pickFile = async function() {
        const img = await ImagePicker.launchImageLibraryAsync({
            base64: true
        });

        // Image upload cancelled
        if (img.assets === null) return;

        setFiledata(img.base64);
        setFileMessage('Image selected');
    }

    const post = async function() {
        if (title.trim() === '') {
            setMessage('Please add a title before posting');
            return;
        }
        if (description.length > MAX_CHARS_IN_DESC) {
            setMessage('Please limit your description to 500 characters');
            return;
        }
        if (filedata.trim() === '') {
            setMessage('Please upload an image before posting');
            return;
        }
        setMessage('');

        let obj = {
            image: filedata,
            authorID: userData._id,
            title: title,
            description: description,
            ispublic: isPublic,
            accessToken: accessToken
        };
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('/api/addPost'), {
                method:'POST', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());

            if (res.error) {
                setMessage(res.error);
                return;
            }

            await AsyncStorage.setItem('accessToken', res.accessToken);
            // TODO:
            // navigation.navigate('Home');
        }
        catch(e) {
            console.error(e);
        }
    }

    return(
        <View style={globalStyles.background}>
            {/* Header Info */}
            <View style={styles.display}>
                <Text style={styles.title}>Art Share</Text>
                <Text style={styles.header}>Add a Post</Text>
            </View>

            {/* Art Info */}
            <View style={styles.formInput}>
                <Text style={styles.label}>Title</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='Title'
                    value={title}
                    onChangeText={(val) => setTitle(val)} />

                <Text style={styles.label}>Description</Text>
                <TextInput 
                    style={styles.input}
                    multiline={true}
                    numberOfLines={6}
                    placeholder='Description'
                    value={description}
                    onChangeText={(val) => setDescription(val)} />

                <View style={styles.visibilityContainer}>
                    <Text style={styles.label}>Public</Text>
                    <RadioButton 
                        value='public'
                        status={isPublic ? 'checked' : 'unchecked'}
                        onPress={() => setIsPublic(true)}
                        style={styles.radioButton} />

                    <Text style={styles.label}>Private</Text>
                    <RadioButton 
                        value='private'
                        status={!isPublic ? 'checked' : 'unchecked'}
                        onPress={() => setIsPublic(false)}
                        style={styles.radioButton} />
                </View>

                {/* Upload Image */}
                <View style={styles.buttonContainer}>
                    <Button title='Choose File' onPress={pickFile} />
                    <Text style={styles.resultMessage}>{fileMessage}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button title='Post' onPress={post} />
                </View>

                <Text style={styles.resultMessage}>{message}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    display: {
        paddingBottom: 80
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
        paddingTop: 20,
        fontSize: 20,
        fontWeight: 'bold'
    },
    input: {
        paddingLeft: 10,
        backgroundColor: '#e3e3e3',
        height: 40,
        width: 200
    },
    visibilityContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'space-between'
    },
    radioButton: {
        padding: 10
    },
    buttonContainer: {
        paddingTop: 30,
        paddingBottom: 10
    },
    button: {
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