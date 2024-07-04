import React from 'react';
import {
  Grid,
  Column,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Form,
  FormGroup,
} from '@carbon/react';

const SignUpPage = () => {
  return (
    <Grid fullWidth style={{ padding: '2rem' }}>
      <Column sm={4} md={6} lg={8}>
        <h2 style={{marginBottom:"15px"}}>Welcome to Kalkinso</h2>
        <Form>
          <FormGroup legendText="">
            <TextInput
              id="first-name"
              labelText="First Name"
              placeholder="Enter your first name"
              style={{marginBottom:"15px"}}
            />
            <TextInput
              id="last-name"
              labelText="Last Name"
              placeholder="Enter your last name"
              style={{marginBottom:"15px"}}
            />
            <TextInput
              id="email"
              labelText="Email"
              type="email"
              placeholder="Enter your email"
              style={{marginBottom:"15px"}}
            />
            <TextInput
              id="mobile-number"
              labelText="Mobile Number"
              type="tel"
              placeholder="Enter your mobile number"
              style={{marginBottom:"15px"}}
            />
            <PasswordInput
              id="password"
              labelText="Password"
              placeholder="Enter your password"
              style={{marginBottom:"15px"}}
            />
            <PasswordInput
              id="confirm-password"
              labelText="Confirm Password"
              placeholder="Confirm your password"
              style={{marginBottom:"15px"}}
            />
            <TextInput
              id="pan-card"
              labelText="PAN Card Number"
              placeholder="Enter your PAN card number"
              style={{marginBottom:"15px"}}
            />
          </FormGroup>

          <Checkbox
            labelText="I agree to the terms and conditions"
            id="terms-conditions"
            required
            style={{marginBottom:"15px"}}
          />

          <Button kind="primary" href='/#/home' tabIndex={0} type="submit" style={{marginTop:"15px"}}>
            Sign Up
          </Button>
        </Form>
      </Column>
    </Grid>
  );
};

export default SignUpPage;