import React from 'react';
import { Button } from '@carbon/react';
import { auth, GoogleAuthProvider, signInWithPopup } from './FirebaseConfig';
import { useDispatch } from 'react-redux';
import { registerWithEmail } from '../../actions/auth';

const GoogleLoginButton = () => {
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Store the authentication result locally
      localStorage.setItem("auth", JSON.stringify(result));
      
      // Dispatch registration action using the obtained user data
      dispatch(registerWithEmail({
        email: result.user.email,
        first_name: result.user.displayName.split(' ')[0],
        last_name: result.user.displayName.split(' ')[1],
        token: result?.user?.stsTokenManager?.accessToken
      }));
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  return (
    <Button kind="primary" onClick={handleGoogleSignIn}>
      Sign in with Google
    </Button>
  );
};

export default GoogleLoginButton;
