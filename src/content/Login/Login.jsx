import React, { useState } from 'react';
import {
  Form,
  TextInput,
  Checkbox,
  Button,
//   SwitcherDivider as Divider,
  Grid,
  Row,
  Column,
  PasswordInput,
} from '@carbon/react';
import { LogoFacebook, LogoLinkedin, LogoGithub } from '@carbon/icons-react';
// import './Login.css';  // Custom styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Terms accepted:', terms);
  };

  return (
    <div className="login-form">
      <Grid>
          <Column sm={4} md={6} lg={8} className="login-container">
            <Form className='login-form-main' onSubmit={handleSubmit} style={{margin:"15px"}}>
              <h2 className='form-item' style={{marginBottom:"15px"}}>Login Form</h2>
              <TextInput
                id="email"
                labelText="Email"
                className='form-item'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{marginBottom:"15px"}}
              />
              <PasswordInput
                id="password"
                labelText="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{marginBottom:"15px"}}
              />
              <Checkbox
                labelText="I agree to the terms and conditions"
                id="terms"
                className='form-item'
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                style={{marginTop:"15px"}}
              />
              <Button type="submit" kind="primary" className="submit-button form-item" href='/#/home' style={{marginTop:"15px"}}>
                Login
              </Button>
            </Form>
          </Column>
          <Column md={8} lg={16} className="login-container">
          <div className="divider" style={{margin:"15px", marginBottom:"25px"}}>
                Or login with
            </div>
            <div className="social-buttons" style={{margin:"15px"}}>
              <Button
                renderIcon={LogoGithub}
                kind="secondary"
                onClick={() => alert('Login with Github')}
              >
                Github
              </Button>
              <Button
                renderIcon={LogoLinkedin}
                kind="ghost"
                onClick={() => alert('Login with LinkedIn')}
              >
                LinkedIn
              </Button>
              <Button
                renderIcon={LogoFacebook}
                kind="primary"
                onClick={() => alert('Login with Facebook')}
              >
                Facebook
              </Button>
            </div>
          </Column>
      </Grid>
    </div>
  );
};

export default Login;