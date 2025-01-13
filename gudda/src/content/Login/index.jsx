import React, { useState, useEffect } from "react";
import "./Login.css";
import {
  auth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithPhoneNumber,
  signInWithCredential,
  PhoneAuthProvider,
} from "./FirebaseConfig";
import * as THREE from "three";
import Mudda from "./Mudda";
import { register } from "../utils/users";
import { useRef } from "react";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [recaptcha, setRecaptcha] = useState(null);
  const recaptchaRef = useRef(null);

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const capchaVerified = await recaptcha.verify();
      if (!capchaVerified) {
        alert("Please verify the captcha.");
        return;
      }
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("auth", JSON.stringify(result));
      const res = await register({email: result.user.email, first_name: result.user.displayName.split(' ')[0], last_name: result.user.displayName.split(' ')[1]});
      if(res.error) {
        console.error(res.error);
      }
      window.location.href = "/#/search";
      window.location.reload();
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  // Send OTP Handler
  const sendOtp = () => {
    if (!phoneNumber.trim()) {
      alert("Please enter a valid phone number.");
      return;
    }

    signInWithPhoneNumber(auth, phoneNumber, recaptcha)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setShowOtpInput(true);
        alert("OTP sent to your phone.");
      })
      .catch((error) => {
        console.error("OTP Error:", error.message);
      });
  };

  // Verify OTP Handler
  const verifyOtp = () => {
    if (!otp.trim()) {
      alert("Please enter the OTP.");
      return;
    }

    const credential = PhoneAuthProvider.credential(verificationId, otp);
    signInWithCredential(auth, credential)
      .then((result) => {
        alert("Login successful!");
        console.log("User signed in: ", result.user);
      })
      .catch((error) => {
        console.error("OTP Verification Error:", error.message);
      });
  };

  useEffect(() => {
    if (recaptchaRef.current && !recaptcha) {
      const recaptchaLocal = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
      });
      recaptchaLocal.render().then((widgetId) => {
        // recaptchaRef.current.appendChild(widgetId);
      });
      setRecaptcha(recaptchaLocal);
    }
  }, [recaptchaRef]);

  // Three.js background effect
  useEffect(() => {
    if(window.localStorage.getItem('auth')){
        window.location.href = "/#/search";
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const backgroundContainer = document.getElementById("background-container");

    renderer.setSize(window.innerWidth, window.innerHeight);
    backgroundContainer.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(6, 32, 100, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x10a37f,
      wireframe: true,
    });
    const icosahedron = new THREE.Mesh(geometry, material);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    scene.add(icosahedron);
    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);
      icosahedron.rotation.x += 0.01;
      icosahedron.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      backgroundContainer.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
    <div id="background-container"></div>
    <div className="login-page">
      <div className="login-content">
        <h1>Welcome to M'udda</h1>

        {/* Google Login */}
        <div className="login-section">
          <button className="google-button" onClick={handleGoogleSignIn}>
            Sign in with Google
          </button>
        </div>

        {/* <hr /> */}

        {/* OTP Login */}
        {/* <div className="login-section">
          <h3>Login with OTP</h3>
          <input
            type="text"
            placeholder="Enter phone number (+911234567890)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {!showOtpInput ? (
            <button onClick={sendOtp}>Send OTP</button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={verifyOtp}>Verify OTP</button>
            </>
          )}
          <div id="recaptcha-container"></div>
        </div> */}
        <div ref={recaptchaRef} id="recaptcha-container"></div>
      </div>
    </div>
    <Mudda />
    </>
  );
};

export default Login;
