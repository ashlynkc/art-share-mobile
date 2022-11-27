import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AddPostPage from './pages/AddPostPage';
import ViewPostPage from './pages/ViewPostPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginPage} />
        <Stack.Screen name='Register' component={RegisterPage} />
        <Stack.Screen name='Home' component={HomePage} />
        <Stack.Screen name='Profile' component={ProfilePage} />
        <Stack.Screen name='AddPost' component={AddPostPage} />
        <Stack.Screen name='ViewPost' component={ViewPostPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
