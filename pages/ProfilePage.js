import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button,Menu, Menuitem, ImageBackground, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { globalStyles } from '../assets/scripts/GlobalStyles';
import { buildPath } from '../assets/scripts/Path';
import { hash } from '../assets/scripts/HelperFunctions';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

import { Icon } from '@rneui/themed';

export default function ProfilePage({ navigation }) {
    const [userData, setUserData] = useState({});
    const [accessToken, setAccessToken] = useState('');
    useEffect(() => {
        _setUserData();
        _setAccessToken();
    }, []);

    const _setUserData = async function() {
        setUserData(JSON.parse(await AsyncStorage.getItem('userData')));
        formatIDs(setClique, JSON.parse(await AsyncStorage.getItem('userData')).Clique);
        formatIDs(setPendingRequests, JSON.parse(await AsyncStorage.getItem('userData')).PendingRequests);
        formatIDs(setSentRequests, JSON.parse(await AsyncStorage.getItem('userData')).SentRequests);
    }

    const _setAccessToken = async function() {
        setAccessToken(await AsyncStorage.getItem('accessToken'));
    }

    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const [addFriendUsername, setAddFriendUsername] = useState('');
    const [addFriendMessage, setAddFriendMessage] = useState('');

    async function formatIDs(setterFunction, idList) {
        let ret = [];


        console.log('here');
        if (!idList) return;
        console.log('it works!');

        for (let i = 0; i < idList.length; i++) {
            let obj = {userID: idList[i]};
            let jsonPayload = JSON.stringify(obj);

            try {
                let response = await fetch(buildPath('/api/getUsername'), {
                    method:'POST', body:jsonPayload, headers:{
                        'Content-Type':'application/json'
                    }
                });

                let text = await response.text();
                if (text) {
                    let obj = {id: idList[i], content: JSON.parse(text)};
                    ret.push(obj);
                }
            }
            catch(e) {
                console.error(e.message);
            }
        }

        setterFunction(ret);
    }

    const [cliqueIDs, setCliqueIDs] = useState(userData.Clique);
    const [clique, setClique] = useState([]);
    useEffect(() => {
        formatIDs(setClique, cliqueIDs);
    }, [JSON.stringify(cliqueIDs)]);

    const [pendingRequestIDs, setPendingRequestIDs] = useState(userData.PendingRequests);
    const [pendingRequests, setPendingRequests] = useState([]);
    useEffect(() => {
        formatIDs(setPendingRequests, pendingRequestIDs);
    }, [JSON.stringify(pendingRequestIDs)]);

    const [sentRequestIDs, setSentRequestIDs] = useState(userData.SentRequests);
    const [sentRequests, setSentRequests] = useState([]);
    useEffect(() => {
        formatIDs(setSentRequests, sentRequestIDs);
    }, [JSON.stringify(sentRequestIDs)]);

    const handleChanges = async function() {
        if (username.trim() !== '')
            handleChangeUsername();

        if (password.trim() !== '' || confirmPassword.trim() !== '')
            handleChangePassword();
    }

    const handleChangeUsername = async function() {
        let obj = {userID: userData._id, newUsername: username, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('/api/changeUsername'), {
                method:'PATCH', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());



            if (res.error) {
                setUsernameMessage(res.error);
                return;
            }

            setUsernameMessage('Username successfully changed!');
            setUsername('');

            await AsyncStorage.setItem('accessToken', res.accessToken);
        }
        catch(e) {
            console.error(e);
        }
    }

    const handleChangePassword = async function() {
        if (password.trim() === '' || confirmPassword.trim() === '') {
            setPasswordMessage('Please fill in both password fields');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordMessage('Your passwords do not match');
            return;
        }

        let hashedPassword = await hash(password);
        let obj = {userID: userData._id, password: hashedPassword};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('/api/resetPassword'), {
                method:'PATCH', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());
            if (res.error) {
                setPasswordMessage(res.error);
                return;
            }

            setPasswordMessage('Password successfully changed');
            setPassword('');
            setConfirmPassword('');
        }
        catch(e) {
            console.error(e);
        }
    }

    const addFriend = async event => {
        event.preventDefault();

        let obj = {username: userData.Username, friendUsername: addFriendUsername, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('/api/sendFriendRequest'), {
                method:'POST', body:jsonPayload, headers:{
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());

            if (res.error) {
                setAddFriendMessage(res.error);
                return;
            }

            setAddFriendUsername('');
            setAddFriendMessage('Friend-request sent!');

            addToSentRequestIDs(res.id);

            await AsyncStorage.setItem('accessToken', res.accessToken);
        }
        catch (e) {
            console.error(e.message);
        }
    }

    const removeFriend = async function(friendUsername) {
        let obj = {username: userData.Username, friendUsername: friendUsername, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('/api/removeFriend'), {
                method:'POST', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());

            if (res.error) {
                console.error(res.error);
                return;
            }

            removeFromCliqueIDs(res.id);

            await AsyncStorage.setItem('accessToken', res.accessToken);
        }
        catch(e) {
            console.error(e.message);
        }
    }

    const declineFriendReqeust = async function(pendingUsername) {
        let obj = {username: userData.Username, friendUsername: pendingUsername, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('/api/declineFriendRequest'), {
                method:'POST', body:jsonPayload, headers:{
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());

            if (res.error) {
                console.error(res.error);
                return;
            }

            removeFromPendingRequestIDs(res.id);

            await AsyncStorage.setItem('accessToken', res.accessToken);
        }
        catch(e) {
            console.error(e.message);
        }
    }

    const acceptFriendRequest = async function(pendingUsername) {
        let obj = {username: userData.Username, friendUsername: pendingUsername, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('/api/acceptFriendRequest'), {
                method:'POST', body:jsonPayload, headers:{
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());

            if (res.error) {
                console.error(res.error);
                return;
            }

            addToCliqueIDs(res.id);
            removeFromPendingRequestIDs(res.id);

            await AsyncStorage.setItem('accessToken', res.accessToken);
        }
        catch(e) {
            console.error(e.message);
        }
    }


    const addToCliqueIDs = async (newID) => {
        console.log(cliqueIDs);
        setCliqueIDs((cliqueIDs) => [...cliqueIDs, newID]);
        userData.Clique.push(newID);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
    }

    const removeFromCliqueIDs = async (newID) => {
        console.log(cliqueIDs);
        setCliqueIDs(cliqueIDs.filter(id => id !== newID));
        userData.Clique.splice(userData.Clique.indexOf(newID), 1);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
    };

    const addToSentRequestIDs = async (newID) => {
        console.log(sentRequestIDs);
        setSentRequestIDs((sentRequestIDs) => [...sentRequestIDs, newID]);
        userData.SentRequests.push(newID);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
    };

    const removeFromPendingRequestIDs = async (newID) => {
        console.log(pendingRequestIDs);
        setPendingRequestIDs((pendingRequestIDs.filter(id => id !== newID)));
        userData.PendingRequests.splice(userData.PendingRequests.indexOf(newID), 1);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
    }

    const navigateToHome = async function() {
        navigation.navigate('Home');
    }

    const navigateToAddPost = async function() {
        navigation.navigate('AddPost');
    }

    const navigateToProfile = async function() {
        navigation.navigate('Profile');
    }

    return(
        <View style={globalStyles.background}>
            <ScrollView>
                {/* Header Info */}
                <View style={styles.display}>
                    <Text style={styles.title}>Art Share</Text>
                    
                    <Text style={styles.header}>My Profile</Text>
                </View>

                {/* Art Info */}
                <View style={styles.formInput}>
                    <Text style={styles.label}>Change Username</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder='New Username'
                        value={username}
                        onChangeText={(val) => setUsername(val)} />

                    <Text style={styles.label}>New Password</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder='Password'
                        value={password}
                        onChangeText={(val) => setPassword(val)} />
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChangeText={(val) => setConfirmPassword(val)} />




                    <View style={styles.buttonContainer}>
                        <Button color='#b93e3e' title='Save Changes' onPress={handleChanges} />
                    </View>
                </View>

                <View style={styles.display}>
                    <Text style={styles.header}>My Clique</Text>
                </View>
                
                <ScrollView>
                    <View style={styles.formInput}>
                            {clique.map((friend) =>
                                <View key={friend.id}><Text>{friend.content}
                                <Pressable onPress={() => removeFriend(friend.content)}><Icon name='close' type='simple-line-icon' /></Pressable>
                                </Text></View>)}

            
                    </View>
                </ScrollView>

                
                <View style={styles.display}>
                    <Text style={styles.header}>Add a Friend</Text>
                </View>
                <View style={styles.formInput}>
                    <TextInput 
                        style={styles.input}
                        placeholder='Username of friend...'
                        value={addFriendUsername}
                        onChangeText={(val) => setAddFriendUsername(val)} />
                    <View style={styles.buttonContainer}>
                        <Button color='#b93e3e' title='Submit' onPress={addFriend} />
                    </View>
                    <Text style={styles.resultMessage}>{addFriendMessage}</Text>
                </View>
                
                <View style={styles.display}>
                    <Text style={styles.header}>Pending Requests</Text>
                </View>
                <ScrollView>
                    <View style={styles.formInput}>
                        {pendingRequests.map((friend) =>
                            <View>
                            <Text>{friend.content}
                            <Pressable  
                                onPress={() => declineFriendReqeust(friend.content)}><Icon name='close' type='simple-line-icon' /></Pressable>
                            <Pressable
                                onPress={() => acceptFriendRequest(friend.content)}><Icon name='check' type='simple-line-icon' /></Pressable>
                            </Text></View>)}
                    </View>
                </ScrollView>
                
                <View style={styles.display}>
                    <Text style={styles.header}>Sent Requests</Text>
                </View>
                <ScrollView>
                    <View style={styles.formInput}>
                        {sentRequests.map((friend) => <Text>{friend.content}</Text>)}
                    </View>
                </ScrollView>

                <View style={styles.navBar}>
                    {/* <Icon reverse name='home' color='#b93e3e' onPress={navigateToHome} /> */}
                    <Icon reverse name='add' color='#b93e3e' onPress={navigateToAddPost} />
                    <Icon reverse name='person' color='#b93e3e' onPress={navigateToProfile} />
                </View>
                
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    display: {
        paddingBottom: 40
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
        alignItems: 'center'
        // height: '100%'
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
    },
    navBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});