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
import { loadUser, reset, setLoading } from '../../actions/auth';
import { ButtonGroup, ButtonOr, Button as SemanticButton, Form as SemanticForm } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
// import './Login.css';  // Custom styling

const PasswordReset = () => {
  const dispatch = useDispatch();
  const [password2, setPassword2] = useState('');
  const [password, setPassword] = useState('');
  const { token } = useParams();

  useEffect(() => {
    dispatch(loadUser({token}));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(reset(password, password2));
    }, 2000);
    // console.log('Email:', email);
    // console.log('Password:', password);
  };

  return (
    <div className="login-form">
      <Grid>
          <Column sm={4} md={6} lg={8} className="login-container">
            <SemanticForm className='login-form-main' onSubmit={handleSubmit} style={{margin:"15px"}}>
              <h2 className='form-item' style={{marginBottom:"15px"}}>Reset Your Password</h2>
              <TextInput
                id="password"
                labelText="Password"
                className='form-item'
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{marginBottom:"15px"}}
              />
              <PasswordInput
                id="password2"
                labelText="Confirm Password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                // style={{marginBottom:"15px"}}
              />
              <ButtonGroup style={{marginTop:"15px"}}>
                <SemanticButton type="submit" className="submit-button form-item" primary>
                  Reset
                </SemanticButton>
              </ButtonGroup>
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

export default PasswordReset;