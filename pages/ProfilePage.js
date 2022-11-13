import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { globalStyles } from '../assets/scripts/GlobalStyles';
import { buildPath } from '../assets/scripts/Path';

export default function ProfilePage({ navigation }) {
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

    return(
        <View>
            <ImageBackground style={globalStyles.background}>
                <Text>{userData.Username}</Text>
            </ImageBackground>
        </View>
    );
}