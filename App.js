import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import LoginPage from './frontend/pages/LoginPage';
import RegisterPage from './frontend/pages/RegisterPage';

export default function App() {
  return (
    <View>
      <LoginPage />
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
});
