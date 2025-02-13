import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
// Import components from Carbon React Native
import { Button, TextInput } from '@carbon/react-native';
import { Text } from 'react-native';
// If your Carbon version does not have `Text`, 
// you can use React Native's built-in Text component.

interface LoginScreenProps {
  navigation: any; // or use typed navigation if you have a RootStackParamList
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Add your login logic here
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <View style={styles.container}>
      {/* Brand Logo */}
      <Image
        source={require('../assets/images/logo-new.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome Back</Text>

      {/* Email Input */}
      <TextInput
        label="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        label="Password"
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <Button
        onPress={handleLogin}
        style={styles.button}
        // If your version of Button doesn't accept "title", remove it 
        // and just wrap text inside the children or check docs
        text="Login"
      />

      {/* Link to Sign Up */}
      <Text style={styles.bottomText}>
        Don’t have an account?{' '}
        <Text 
          style={styles.linkText}
          onPress={() => navigation.navigate('Signup')}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 80,
    alignSelf: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: '#0f62fe', // IBM/Carbon primary color, adjust to your brand
  },
  input: {
    marginBottom: 16,
    // Additional input styles if desired
  },
  button: {
    marginVertical: 16,
    // Additional button styles
  },
  bottomText: {
    marginTop: 16,
    textAlign: 'center',
  },
  linkText: {
    color: '#0f62fe',
    fontWeight: '600',
  },
});
