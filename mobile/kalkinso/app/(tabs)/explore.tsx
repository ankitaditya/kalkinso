import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Checkbox, TextInput } from '@carbon/react-native';
import { Text } from 'react-native';

interface SignupScreenProps {
  navigation: any; 
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accept, setAccept] = useState(false);

  const handleSignup = () => {
    // TODO: Add sign-up logic here
    console.log('Full Name:', fullName, 'Email:', email, 'Password:', password);
  };

  return (
    <View style={styles.container}>
      {/* Brand Logo */}
      <Image
        source={require('../../assets/images/logo-new.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Create an Account</Text>

      {/* Full Name Input */}
      <TextInput
        label="Full Name"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

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

      <Checkbox checked={accept} style={styles.button} id="loadSite" onPress={setAccept} label="Accept Terms & Conditions" />

      {/* Sign Up Button */}
      <Button
        onPress={handleSignup}
        style={styles.button}
        text="Sign Up"
      />

      {/* Link back to Login */}
      <Text style={styles.bottomText}>
        Already have an account?{' '}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate('Login')}
        >
          Log in
        </Text>
      </Text>
    </View>
  );
};

export default SignupScreen;

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
    color: '#0f62fe',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 16,
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
