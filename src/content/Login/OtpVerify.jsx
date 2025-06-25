import React, { useEffect, useState } from 'react';
import * as THREE from "three";
import {
  TextInput,
  Grid,
  Column,
} from '@carbon/react';
import { useDispatch } from 'react-redux';
import { otpLogin, registerWithEmail, sendVerificationLogin, setLoading } from '../../actions/auth';
import { ButtonGroup, ButtonOr, Button as SemanticButton, Form as SemanticForm } from 'semantic-ui-react';
import { InputOtp } from 'primereact/inputotp';
import {
  auth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPopup,
} from "./FirebaseConfig";
import { useRef } from 'react';
import logo from "./logo-new.png";
import './VerifyLogin.css';  // Custom styling

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [sendOtp, setSendOtp] = useState(false);
  const [resend, setResend] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState(null);
  const [recaptcha, setRecaptcha] = useState(null);
  const recaptchaRef = useRef(null);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [registerRecaptchaToken, setRegisterRecaptchaToken] = useState(null);
  const backgroundContainerRef = useRef(null);

  useEffect(() => {
    // Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const backgroundContainer = backgroundContainerRef.current;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.border = "none";
    renderer.domElement.style.outline = "none";
    renderer.domElement.style.display = "block";
    backgroundContainer.appendChild(renderer.domElement);

    // Lighting for the scene
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Create a Globe with the Logo Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(logo, (texture) => {
      const globeGeometry = new THREE.BoxGeometry(6, 6, 6);
      const globeMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        // wireframe: true,
        });
      // const globeMaterial = new THREE.MeshBasicMaterial({
      //   map: texture,
      //   transparent: true,
      // });
      const globe = new THREE.Mesh(globeGeometry, globeMaterial);
      scene.add(globe);

      // Add a rotating torus
      const torusGeometry = new THREE.TorusGeometry(8, 0.5, 16, 100);
      const torusMaterial = new THREE.MeshStandardMaterial({ 
        wireframe: true,
        });
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      scene.add(torus);

      // Position camera
      camera.position.z = 25;

      // Animation Loop
      const animate = () => {
        requestAnimationFrame(animate);
        // globe.rotation.x += 0.005;
        globe.rotation.y += 0.01;
        // torus.rotation.x += 0.005;
        torus.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
    });

    // Cleanup on unmount
    return () => {
      backgroundContainer.removeChild(renderer.domElement);
    };
  }, []);

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("auth", JSON.stringify(result));
      const res = await registerWithEmail({email: result.user.email, first_name: result.user.displayName.split(' ')[0], last_name: result.user.displayName.split(' ')[1]});
      if(res.error) {
        console.error(res.error);
      }
      window.location.href = "/#/home/create";
      window.location.reload();
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  useEffect(() => {
    if (recaptchaRef.current && !recaptcha && recaptchaRef.current.childNodes.length === 0) {
      const recaptchaLocal = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
      });
      recaptchaLocal.render().then((widgetId) => {
        // recaptchaRef.current.appendChild(widgetId);
      });
      setRecaptcha(recaptchaLocal);
      recaptchaLocal.verify();
    }
  }, [recaptchaRef]);

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

  const handleVerify = (register) => {
    if(register){
    dispatch(setLoading(true));
    dispatch(otpLogin({[sendOtp]:sendOtp==="mobile"?"+91"+emailOrMobile:emailOrMobile,otp: otp}));
    } else {
      recaptcha.verify().then((captch) => {
        if(!registerRecaptchaToken) setRegisterRecaptchaToken(captch);
      });
    }
  };

  useEffect(() => {
    if(recaptchaToken){
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
      }
    }, [recaptchaToken]);

  useEffect(() => {
    if(registerRecaptchaToken){
      // Add form submission logic here
        handleGoogleSignIn();
    }
  }, [registerRecaptchaToken]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = validate(emailOrMobile);
    if (!payload){
      setError("Invalid Email or Mobile");
      return;
    }
      recaptcha.verify().then((captch) => {
        if(!recaptchaToken) setRecaptchaToken(captch);
      });
  };

  return (
    <div className="login-form">
      <div id="background-container" style={{
        position: "absolute",
        top: "0px",
        right: "-100px",
      }} ref={backgroundContainerRef}></div>
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
              {sendOtp&&!registerRecaptchaToken&&<InputOtp 
                    value={otp} 
                    onChange={(e) => setOtp(e.value)} 
                    integerOnly 
                    length={6} 
                    marginBottom
                />}
              <div ref={recaptchaRef} id="recaptcha-container"></div>
              <ButtonGroup style={{marginTop:"15px"}}>
                <SemanticButton className="submit-button form-item" disabled={resend} secondary>
                  {resend&&!registerRecaptchaToken?`Resend OTP ${timer}s`:(sendOtp&&!registerRecaptchaToken?"Resend OTP":"Send OTP")}
                </SemanticButton>
                <ButtonOr style={{zIndex: 0}} />
                <SemanticButton type="button" onClick={()=>handleVerify(sendOtp&&!registerRecaptchaToken)} className="submit-button form-item" disabled={sendOtp?otp.length!==6:false} primary>
                  {sendOtp&&!registerRecaptchaToken?"Verify OTP":"Register"}
                </SemanticButton>
              </ButtonGroup>
            </SemanticForm>
          </Column>
      </Grid>
    </div>
  );
};

export default VerifyOtp;