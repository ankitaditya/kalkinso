import React, { useState } from 'react';
import {
  Modal,
  Grid,
  Column,
  ContentSwitcher,
  Switch,
} from '@carbon/react';
import Login from './Login';
import SignUp from '../Signup';
// import './AuthModal.scss';  // Custom styling
// import '@carbon/react/scss/styles.scss';

const AuthModal = ({ open, onClose }) => {
  const [selectedForm, setSelectedForm] = useState('login'); // State for selected form

  const handleFormSwitch = (event) => {
    setSelectedForm(event.name);
  };

  return (
    <Modal
      open={open}
      modalHeading={selectedForm === 'login' ? 'Welcome Back' : 'Welcome to Kalkinso'}
      passiveModal
      onRequestClose={onClose}
      size="lg"
      preventCloseOnClickOutside
    >
      <Grid fullWidth>
        <Column sm={4} md={8} lg={8}>
          <ContentSwitcher onChange={handleFormSwitch}>
            <Switch name="login" text="Login" />
            <Switch name="signup" text="Sign Up" />
          </ContentSwitcher>

          {selectedForm === 'login' ? (
            <Login />
          ) : (
            <SignUp />
          )}
        </Column>
      </Grid>
    </Modal>
  );
};

export default AuthModal;