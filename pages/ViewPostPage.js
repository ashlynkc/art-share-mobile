import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { globalStyles } from '../assets/scripts/GlobalStyles';
import { buildPath } from '../assets/scripts/Path';
import { hash } from '../assets/scripts/HelperFunctions';

export default function ViewPostPage({ navigation }) {

    return(
        <View>

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
