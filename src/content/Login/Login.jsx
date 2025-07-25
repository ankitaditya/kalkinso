import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, login, setLoading } from '../../actions/auth';
import { ButtonGroup, ButtonOr, Divider, Button as SemanticButton, Form as SemanticForm } from 'semantic-ui-react';
// import './Login.css';  // Custom styling

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(login(email, password));
    }, 2000);
    // console.log('Email:', email);
    // console.log('Password:', password);
  };

  return (
    <div className="login-form">
      <Grid>
          <Column sm={4} md={6} lg={8} className="login-container">
            <SemanticForm className='login-form-main' onSubmit={handleSubmit} style={{margin:"15px"}}>
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
                // style={{marginBottom:"15px"}}
              />
              <ButtonGroup style={{marginTop:"15px"}}>
                <SemanticButton type="submit" className="submit-button form-item" primary>
                  Login
                </SemanticButton>
                <ButtonOr style={{zIndex: 0}} />
                <SemanticButton className="submit-button form-item" href='/#/register' secondary>
                  Register
                </SemanticButton>
              </ButtonGroup>
            </SemanticForm>
            <Divider style={{margin:"15px", marginBottom:"25px", paddingTop:"25px", paddingBottom:"25px"}}>
                Or login with
            </Divider>
            <SemanticForm className='login-form-main' onSubmit={handleSubmit} style={{margin:"15px"}}>
                <SemanticButton className="submit-button form-item" href='/#/login/otp' primary>
                  OTP Login
                </SemanticButton>
            </SemanticForm>
          </Column>
          {/* <Column md={8} lg={16} className="login-container">
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
          </Column> */}
      </Grid>
    </div>
  );
};

export default Login;