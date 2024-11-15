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
import { loadUser, otpLogin, sendVerificationLogin, setLoading } from '../../actions/auth';
import { ButtonGroup, ButtonOr, Button as SemanticButton, Form as SemanticForm } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { InputOtp } from 'primereact/inputotp';
// import './Login.css';  // Custom styling

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [sendOtp, setSendOtp] = useState(false);
  const [resend, setResend] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setResend(false);
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const validate = (value) => {
    setEmailOrMobile(value);
    const validateEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3})+$/
    const validateMobile = /^[0-9]{10}$/
    if (validateEmail.test(value)){
        setSendOtp('email');
        return {email: value}
    } else if (validateMobile.test(value)){
        setSendOtp('mobile');
        return {mobile: "+91"+value}
    }
    return null;
  };

  const handleVerify = () => {
    dispatch(setLoading(true));
    dispatch(otpLogin({[sendOtp]:sendOtp==="mobile"?"+91"+emailOrMobile:emailOrMobile,otp: otp}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    const payload = validate(emailOrMobile);
    if (payload){
        dispatch(setLoading(true));
        dispatch(sendVerificationLogin(payload));
        setTimer(30);
        setResend(true);
        setError(null);
    } else {
        setError("Invalid Email or Mobile");
    }
    // console.log('Email:', email);
    // console.log('Password:', password);
  };

  return (
    <div className="login-form">
      <Grid>
          <Column sm={4} md={6} lg={8} className="login-container">
            <SemanticForm className='login-form-main' onSubmit={handleSubmit} style={{margin:"15px"}}>
              <h2 className='form-item' style={{marginBottom:"15px"}}>Login With OTP</h2>
              <TextInput
                    id="email-or-mobile"
                    labelText="Email or Mobile"
                    className='form-item'
                    type="text"
                    disabled={sendOtp}
                    value={emailOrMobile}
                    invalidText={error}
                    invalid={error}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    required
                    style={{marginBottom:"15px"}}
              />
              {sendOtp&&<InputOtp 
                    value={otp} 
                    onChange={(e) => setOtp(e.value)} 
                    integerOnly 
                    length={6} 
                    marginBottom
                />}
              <ButtonGroup style={{marginTop:"15px"}}>
                <SemanticButton className="submit-button form-item" disabled={resend} secondary>
                  {resend?`Resend OTP ${timer}s`:(sendOtp?"Resend OTP":"Send OTP")}
                </SemanticButton>
                {sendOtp&&(<>
                <ButtonOr style={{zIndex: 0}} />
                <SemanticButton type="button" onClick={handleVerify} className="submit-button form-item" disabled={otp.length!==6} primary>
                  {"Verify"} OTP
                </SemanticButton></>)}
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

export default VerifyOtp;