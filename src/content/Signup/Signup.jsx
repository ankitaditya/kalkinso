import {
  CreateFullPage,
  CreateFullPageStep,
  usePrefix,
  pkg
} from "@carbon/ibm-products";
import {
  Button,
  Checkbox,
  Column,
  DefinitionTooltip,
  FluidForm,
  Form,
  FormGroup,
  Grid,
  InlineNotification,
  Loading,
  NumberInput,
  PasswordInput,
  RadioButton,
  RadioButtonGroup,
  RadioTile,
  Row,
  Select,
  SelectItem,
  TextInput,
  TileGroup,
  Toggle,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  ToggletipLabel,
  Tooltip
} from "@carbon/react";
import { InputOtp } from "primereact/inputotp";
import { Checkmark, Close, Information, Subtract } from "@carbon/react/icons";
import { Dropdown, Modal } from "carbon-components-react";
import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { createProfile } from "../../actions/profile";
import { register, sendVerification, verifyOtp, setVerified, setOpenOtpModal, setLoading, loadUser, verifyUpi } from "../../actions/auth";
import { setAlert } from "../../actions/alert";
import { connect, useDispatch, useSelector } from "react-redux";
import NoDataIllustration from "./assets/NoDataIllustration";
import OtpInput from 'react-otp-input';

const SignUp = (props) => {
  const blockClass = `${pkg.prefix}--create-full-page`;
  const dispatch = useDispatch();

  const [information, setInformation] = useState({
    step0: {
      category: ""
    },
    step1: {
      first_name: "",
      last_name: "",
      email: "",
      mobile: "+91 ",
      password: "",
      confirm_password: "",
      adhar: "",
    },
    step2: {
      upi: "",
      terms_conditions: false
    }
  });
  const carbonPrefix = usePrefix();
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const { verification } = useSelector(state => state.auth);
  const [ selectedCategory, setSelectedCategory ] = useState('');
  const [shouldReject, setShouldReject] = useState(false);
  const [ otpOpen, setOtpOpen ] = useState('');
  const [isInvalid, setIsInvalid] = useState({
    first_name: null,
    last_name: null,
    email: null,
    mobile: null,
    password: null,
    confirm_password: null,
    adhar: null,
    upi: null,
    terms_conditions: null
  });
  const { verified, openOtpModal } = useSelector(state => state.auth);
  const [simulatedDelay] = useState(750);

  const [timer, setTimer] = useState(30);
  const [ token, setToken ] = useState();
  const [ resend, setResend ] = useState(false);
  const [ verifyLoader, setVerifyLoader ] = useState(null);

  useEffect(() => {
    if(verification?.adhar?.data?.data?.message?.includes("Invalid")) {
      setIsInvalid({...isInvalid, adhar: true});
      setToken('');
      setResend(false);
      setOtpOpen('');
      setVerifyLoader(null);
    }
    if(verification?.upi?.data?.data?.message?.includes("Invalid")) {
      setIsInvalid({...isInvalid, adhar: true});
      setToken('');
      setResend(false);
      setOtpOpen('');
      setVerifyLoader(null);
    }
  }, [verification]);

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

  const ResendOtp = (label) => {
    // console.log("Resend otp clicked!");
    if(label === "Email" && isInvalid.email === false) {
      props.sendVerification({email: information.step1.email});
      props.setAlert(`Verification OTP sent to ${information.step1.email}!`, "info")
      setTimer(30);
      setResend(true);
    } else if(label === "Mobile Number" && isInvalid.mobile === false){
      props.sendVerification({mobile: information.step1.mobile});
      props.setAlert(`Verification OTP sent to ${information.step1.mobile}!`, "info")
      setTimer(30);
      setResend(true);
    } else if(label === "Adhar Card Number" && isInvalid.adhar === false){
      props.sendVerification({adhar: information.step1.adhar});
      props.setAlert(`Verification OTP sent to your registered mobile number!`, "info")
      setTimer(30);
      setResend(true);
    } else if(label === "UPI ID" && isInvalid.upi === false){
      props.verifyUpi({upi: information.step2.upi, name: information.step1.first_name+" "+information.step1.last_name});
      setToken('');
      setVerifyLoader(null);
    }
  }

  const handleSubmit = (label) => {
    // console.log("submit clicked!");
    let key  = ""
    let value = null
    if(label === "Email" && isInvalid.email === false) {
      key = "email";
    } else if(label === "Mobile Number" && isInvalid.mobile === false){
      key = "mobile";
    } else if(label === "Adhar Card Number" && isInvalid.adhar === false){
      key = "adhar";
      value = verification?.adhar?.data?.data?.reference_id;
    } else if(label === "UPI ID" && isInvalid.upi === false){
      key = "upi";
      value = verification?.adhar?.data?.data?.reference_id;
    }
    if (key === "" || isInvalid.mobile===true) {
      props.setAlert("Problem in verifying OTP: "+label, "error");
      // console.log("THIS IS INVALID: ",isInvalid)
      return;
    } else {
      props.verifyOtp({[key]: value?value:information.step1[key], otp:token})
      setToken('');
      setVerifyLoader(null);
    }
  }

  const ToggleTip = (label, isClickedDefault=false, props) => {
    const user = useSelector((state) => state.auth);
    const [ token, setToken ] = useState();
    const [ isClicked, setIsClicked ] = useState(isClickedDefault);
    const [ open, setOpen ] = useState(false);
    const [ resend, setResend ] = useState(false);
    const [timer, setTimer] = useState(30);
    const [ keyGlobal, setKeyGlobal ] = useState('');
    const CheckmarkInfo = () => <Tooltip label={`${label} is verified`} align="top-left">
      <Checkmark className="sb-tooltip-trigger" style={{color: 'green'}} size={12} />
  </Tooltip>;
  useEffect(() => {
    if(!user.isAuthenticated&&localStorage.getItem('token')) {
    dispatch(setLoading(true));
    dispatch(loadUser({token: localStorage.getItem('token')}))
    }
  },[])
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
    

  const handleSubmit = () => {
    // console.log("submit clicked!");
    let key  = ""
    if(label === "Email" && isInvalid.email === false) {
      key = "email";
      setKeyGlobal("Email");
    } else if(label === "Mobile Number" && isInvalid.mobile === false){
      key = "mobile";
      setKeyGlobal("Mobile");
    } else if(label === "Adhar Card Number" && isInvalid.adhar === false){
      key = "adhar";
      setKeyGlobal("Adhar");
    } else if(label === "UPI ID" && isInvalid.upi === false){
      key = "upi";
      setKeyGlobal("Upi");
    }
    if (key === "" || isInvalid.mobile===true) {
      props.setAlert("Problem in verifying OTP: "+label, "error");
      // console.log("THIS IS INVALID: ",isInvalid)
      return;
    } else {
      props.verifyOtp({[key]: information.step1[key], otp:token})
    }
  }

  useEffect(() => {
    let key  = ""
    if(label === "Email" && isInvalid.email === false) {
      key = "email";
    } else if(label === "Mobile Number" && isInvalid.mobile === false){
      key = "mobile";
    } else if(label === "Adhar Card Number" && isInvalid.adhar === false){
      key = "adhar";
    } else if(label === "UPI ID" && isInvalid.upi === false){
      key = "upi";
    }
    if(verified[key]) {
      setIsClicked(true);
    } else if (verified[key] === null) {
      props.setAlert("Invalid otp entered", "error");
    }
  }, [verified]);

  useEffect(() => {
    if(!openOtpModal) {
      setOpen(openOtpModal);
    }
  }, [openOtpModal]);

  const handleVerifyClick = () => {
    // console.log("Verify clicked!");
    setVerifyLoader(true)
    if(label === "Email" && isInvalid.email === false) {
      props.sendVerification({email: information.step1.email});
      setTimeout(() => {
        setOtpOpen('Email')
        setVerifyLoader(false)
      }, 1000);
    } else if(label === "Mobile Number" && isInvalid.mobile === false){
      props.sendVerification({mobile: information.step1.mobile});
      setTimeout(() => {
        setOtpOpen('Mobile')
        setVerifyLoader(false)
      }, 1000);
    } else if(label === "Adhar Card Number" && isInvalid.adhar === false){
      props.sendVerification({adhar: information.step1.adhar.replace(' ', '')});
      setTimeout(() => {
        setOtpOpen('Adhar')
        setVerifyLoader(false)
      }, 1000);
    } else if(label === "UPI ID" && isInvalid.upi === false){
      props.verifyUpi({upi: information.step2.upi, name: information.step1.first_name+" "+information.step1.last_name});
      setTimeout(() => {
        setToken('');
        setVerifyLoader(null);
      }, 1000);
    } else {
      props.setAlert("Please enter a valid "+label, "error");
    }
  }

  const ResendOtp = () => {
    // console.log("Resend otp clicked!");
    if(label === "Email" && isInvalid.email === false) {
      props.sendVerification({email: information.step1.email});
      props.setAlert(`Verification OTP sent to ${information.step1.email}!`, "info")
      setTimer(30);
      setResend(true);
    } else if(label === "Mobile Number" && isInvalid.mobile === false){
      props.sendVerification({mobile: information.step1.mobile});
      props.setAlert(`Verification OTP sent to ${information.step1.mobile}!`, "info")
      setTimer(30);
      setResend(true);
    } else if(label === "Adhar Card Number" && isInvalid.adhar === false){
      props.sendVerification({adhar: information.step1.adhar});
      props.setAlert(`Verification OTP sent to your registered mobile number!`, "info")
      setTimer(30);
      setResend(true);
    } else if(label === "UPI ID" && isInvalid.upi === false){
      props.sendVerification({upi: information.step1.upi});
      props.setAlert(`Verification OTP sent to your registered mobile number!`, "info")
      setTimer(30);
      setResend(true);
    }
  }
  return <>
  <ToggletipLabel>{label}</ToggletipLabel>
  <Toggletip align="top-left">
  {isClicked? <CheckmarkInfo />:<ToggletipButton label={`Verify ${label}`} style={{color: 'red'}} onClick={()=>handleVerifyClick()}>
       {verifyLoader&&keyGlobal===otpOpen?<Loading withOverlay={true} active={true} small />:verifyLoader===null&&" verify"}
    </ToggletipButton>}
    <ToggletipContent>
      <p>{label} is verified</p>
    </ToggletipContent>
  </Toggletip>
  {/* <Modal open={open} onRequestClose={() => { setOpen(false); setIsClicked(true); }}  closeButtonLabel="close" passiveModal modalHeading="You have been successfully signed out" /> */}
  <Modal open={open} onRequestClose={() => setOpen(false)} onRequestSubmit={()=>handleSubmit()} modalHeading={`Verify otp for your ${label}`} modalLabel="Two Step Verification" primaryButtonText="Verify">
          <InputOtp value={token} onChange={(e) => setToken(e.value)} integerOnly length={6} marginBottom/> 
          {/* <OtpInput
            value={token}
            onChange={setToken}
            numInputs={6}
            // renderSeparator={<span>-</span>}
            // inputType=""
            placeholder="------"
            renderInput={(props) => <TextInput {...props} />}
          /> */}
          <Button style={{marginTop:"1rem"}} disabled={resend} kind="ghost" onClick={()=>ResendOtp()}>{resend?`${timer} s`:"Resend"}</Button>
  </Modal>
</>};

  const validate = (step, name, value) => {
    if (step === 1) {
      if (name === "first_name") {
        setInformation({
          ...information,
          step1: { ...information.step1, first_name: value }
        });
        return value.length === 0 || value.length > 20;
      } else if (name === "last_name") {
        setInformation({
          ...information,
          step1: { ...information.step1, last_name: value }
        });
        return value.length === 0 || value.length > 20;
      } else if (name === "email") {
        setInformation({
          ...information,
          step1: { ...information.step1, email: value }
        });
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(value) === false;
      } else if (name === "mobile") {
        setInformation({
          ...information,
          step1: { ...information.step1, mobile: value.replaceAll(/\s+/gi,'') }
        });
        return value?.replaceAll(/\s+/gi,'')?.length === 0 || value?.replaceAll(/\s+/gi,'')?.length < 13 || isNaN(value);
      } else if (name === "password") {
        /* Write a good password validation logic */
        const regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_@.#$!%*?&^])[A-Za-z\d_@.#$!%*?&]{8,15}$/;
        setInformation({
          ...information,
          step1: { ...information.step1, password: value }
        });
        return regex.test(value) === false;
      } else if (name === "confirm_password") {
        setInformation({
          ...information,
          step1: { ...information.step1, confirm_password: value }
        });
        return value !== information.step1.password;
      } else if (name === "adhar") {
        setInformation({
          ...information,
          step1: { ...information.step1, adhar: value }
        });
        const regex = /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/;
        // if(regex.test(value) === true) {
        //   props.setVerified({...verified,adhar: true});
        // }
        return regex.test(value) === false;
      }
    } else if (step === 2) {
      if (name === "upi") {
        const regex = /^[\w.-]+@[\w.-]+$/;
        setInformation({
          ...information,
          step2: { ...information.step2, upi: value }
        });
        // if(regex.test(value) === true) {
        //   props.setVerified({...verified,upi: true});
        // }
        return regex.test(value) === false;
      } else if (name === "terms_conditions") { 
        setInformation({
          ...information,
          step2: { ...information.step2, terms_conditions: value }
        });
        // console.log("This is terms conditions", value);
        return value === false;
      }
    }
  };

  const onSubmit = (e) => {
    // console.log("SUBMIT CLICKED:",information.step1, information.step2)
    props.register({...information.step1, ...information.step2, "user_role": selectedCategory});
  }

  return (
    <React.Fragment>
      <style>
        {`.${carbonPrefix}--modal { opacity: 0; }`};
      </style>
      <CreateFullPage
        className={`${blockClass}`}
        {...props}
        nextButtonText="Next"
        backButtonText="Back"
        cancelButtonText="Cancel"
        submitButtonText="Sign Up"
        modalDangerButtonText="Cancel Sign Up"
        modalSecondaryButtonText="Return to form"
        modalTitle="Are you sure you want to cancel?"
        modalDescription="If you cancel, your account will not be created."
        onRequestSubmit={(e) => onSubmit(e)}
        onClose={() => {
          // navigate("/");
        }}
      >
        <CreateFullPageStep
          title="Select Your Path"
          subtitle="Choose the path that aligns with your interests."
          description={
            <>
              If you're unsure, you can select the&nbsp;
              <strong>"Explore"</strong> option, and we'll guide you through the available options to help you make an informed decision. By continuing, you confirm that you have read and agree to our&nbsp;
              <a href="https://www.kalkinso.com/#/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a> 
              &nbsp;and&nbsp;
              <a href="https://www.kalkinso.com/#/terms-n-conditions" target="_blank" rel="noopener noreferrer">
                Terms and Conditions
              </a>.
            </>
          }
          onNext={() => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                // Example usage of how to prevent the next step if some kind
                // of error occurred during the `onNext` handler.
                if (shouldReject) {
                  setHasSubmitError(true);
                  reject();
                }
                // setIsInvalid(false);
                resolve();
              }, simulatedDelay);
            });
          }}
          disableSubmit={
            !selectedCategory
          }
          introStep
        >
          <TileGroup
            defaultSelected={selectedCategory}
            legend=""
            name="Select a category"
            onChange={(value) => setSelectedCategory(value)}
            valueSelected={selectedCategory}
          >
            <RadioTile
              // className={`${pkg.prefix}--tearsheet-create-multi-step--custom-tile`}
              value="Professional"
              id="tile-1"
              tabIndex={selectedCategory === 'Professional' ? 0 : -1}
            >
              <NoDataIllustration variant="pro" size="lg" />
              <span
                // className={`${pkg.prefix}--tearsheet-create-multi-step--custom-tile-label`}
              >
                Professionals
              </span>
            </RadioTile>
            <RadioTile
              className={`${pkg.prefix}--tearsheet-create-multi-step--custom-tile`}
              value="Fresher"
              id="tile-2"
              tabIndex={selectedCategory === 'Fresher' ? 0 : -1}
            >
              <NoDataIllustration variant="ent" size="lg" />
              <span
                className={`${pkg.prefix}--tearsheet-create-multi-step--custom-tile-label`}
              >
                
                Fresher
              </span>
            </RadioTile>
            <RadioTile
              className={`${pkg.prefix}--tearsheet-create-multi-step--custom-tile`}
              value="Administrator"
              id="tile-3"
              tabIndex={selectedCategory === 'Administrator' ? 0 : -1}
            >
              <NoDataIllustration variant="fre" size="lg" />
              <span
                className={`${pkg.prefix}--tearsheet-create-multi-step--custom-tile-label`}
              >
                Administrators
              </span>
            </RadioTile>
            <RadioTile
              className={`${pkg.prefix}--tearsheet-create-multi-step--custom-tile`}
              value="Explorer"
              id="tile-4"
              tabIndex={selectedCategory === 'Explorer' ? 0 : -1}
            >
              <NoDataIllustration variant="exp" size="lg" />
              <span
                className={`${pkg.prefix}--tearsheet-create-multi-step--custom-tile-label`}
              >
                Explorer
              </span>
            </RadioTile>
          </TileGroup>
        </CreateFullPageStep>
        <CreateFullPageStep
          title="Personal Details"
          subtitle="Fill out the form below to get started."
          description={
            <>
              Before submitting, please confirm that you have read and agree to our&nbsp;
              <a href="https://www.kalkinso.com/#/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a> 
              &nbsp;and&nbsp;
              <a href="https://www.kalkinso.com/#/terms-n-conditions" target="_blank" rel="noopener noreferrer">
                Terms and Conditions
              </a>. We ensure that your personal data will be securely handled to protect your privacy.
            </>
          }          
          onNext={() => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                // Example usage of how to prevent the next step if some kind
                // of error occurred during the `onNext` handler.
                if (shouldReject) {
                  // console.log("SHOULD REJECT: ",shouldReject)
                  // console.log("IS INVALID: ",isInvalid)
                  setHasSubmitError(true);
                  reject();
                }
                // setIsInvalid(false);
                resolve();
              }, simulatedDelay);
            });
          }}
          disableSubmit={
            isInvalid.first_name ||
            isInvalid.last_name ||
            isInvalid.email ||
            isInvalid.mobile ||
            isInvalid.password ||
            isInvalid.confirm_password ||
            isInvalid.adhar ||
            isInvalid.first_name === null ||
            isInvalid.last_name === null ||
            isInvalid.email === null ||
            isInvalid.mobile === null ||
            isInvalid.password === null ||
            isInvalid.confirm_password === null ||
            isInvalid.adhar === null || !(
              verified.email && verified.mobile && verified.adhar
            )
          }
        >
          <Grid fullWidth style={{ padding: "2rem" }}>
            <Column sm={4} md={6} lg={8}>
              <Form>
                <FormGroup legendText="">
                  <TextInput
                    id="first-name"
                    labelText={ToggleTip('First Name', true, props)}
                    placeholder="Enter your first name"
                    style={{ marginBottom: "15px" }}
                    onChange={e => {
                      setIsInvalid({
                        ...isInvalid,
                        first_name: validate(1, "first_name", e.target.value)
                      });
                      setShouldReject(
                        isInvalid.first_name ||
                          isInvalid.last_name ||
                          isInvalid.email ||
                          isInvalid.mobile ||
                          isInvalid.password ||
                          isInvalid.confirm_password ||
                          isInvalid.adhar
                      );
                    }}
                    invalid={
                      isInvalid.first_name && isInvalid.first_name !== null
                    }
                    invalidText="This is a required field"
                    required
                  />
                  <TextInput
                    id="last-name"
                    labelText={ToggleTip('Last Name', true, props)}
                    placeholder="Enter your last name"
                    style={{ marginBottom: "15px" }}
                    onChange={e => {
                      setIsInvalid({
                        ...isInvalid,
                        last_name: validate(1, "last_name", e.target.value)
                      });
                      setShouldReject(
                        !(
                          information.step1.first_name ||
                          information.step1.last_name ||
                          information.step1.email ||
                          information.step1.mobile ||
                          information.step1.password ||
                          information.step1.confirm_password ||
                          information.step1.adhar
                        )
                      );
                    }}
                    invalid={isInvalid.last_name && isInvalid.last_name !== null}
                    invalidText="This is a required field"
                    required
                  />
                  <TextInput
                    id="email"
                    labelText={ToggleTip('Email', false, props)}
                    type="email"
                    disabled={verified.email}
                    placeholder="Enter your email"
                    style={{ marginBottom: "15px" }}
                    onChange={e => {
                      setIsInvalid({
                        ...isInvalid,
                        email: validate(1, "email", e.target.value)
                      });
                      setShouldReject(
                        !(
                          information.step1.first_name ||
                          information.step1.last_name ||
                          information.step1.email ||
                          information.step1.mobile ||
                          information.step1.password ||
                          information.step1.confirm_password ||
                          information.step1.adhar
                        )
                      );
                    }}
                    invalid={isInvalid.email && isInvalid.email !== null}
                    invalidText="Please enter a valid email address"
                    required
                  />
                  {otpOpen==='Email'&&!verified?.email&&(<div style={{marginTop:"0.5rem"}}>
                    <InputOtp value={token} onChange={(e) => setToken(e.value)} integerOnly length={6} marginBottom/>
                    <FluidForm>
                      <Button disabled={resend} kind="ghost" onClick={()=>ResendOtp('Email')}>{resend?`${timer} s`:"Resend"}</Button>
                      <Button disabled={token?.length<6} kind="ghost" onClick={()=>handleSubmit('Email')}>{"Verify"}</Button>
                    </FluidForm>
                  </div>)}
                  <TextInput
                    id="mobile-number"
                    labelText={ToggleTip('Mobile Number', false, props)}
                    disabled={verified.mobile}
                    type="tel"
                    value={information.step1.mobile}
                    placeholder="Enter your mobile number"
                    style={{ marginBottom: "15px" }}
                    onChange={e => {
                      const regex = /^[\+\s0-9\b]+$/;
                      if (e.target.value.length < 4 || !regex.test(e.target.value)) {
                        return
                      }
                      setIsInvalid({
                        ...isInvalid,
                        mobile: validate(
                          1,
                          "mobile",
                          e.target.value
                        )
                      });
                      setShouldReject(
                        isInvalid.first_name ||
                          isInvalid.last_name ||
                          isInvalid.email ||
                          isInvalid.mobile ||
                          isInvalid.password ||
                          isInvalid.confirm_password ||
                          isInvalid.adhar
                      );
                    }}
                    invalid={
                      isInvalid.mobile && isInvalid.mobile !== null
                    }
                    invalidText="This is a required field"
                    required
                  />
                  {otpOpen==='Mobile'&&!verified?.mobile&&(<div style={{marginTop:"0.5rem"}}>
                    <InputOtp value={token} onChange={(e) => setToken(e.value)} integerOnly length={6} marginBottom/>
                    <FluidForm>
                      <Button disabled={resend} kind="ghost" onClick={()=>ResendOtp('Mobile Number')}>{resend?`${timer} s`:"Resend"}</Button>
                      <Button disabled={token?.length<6} kind="ghost" onClick={()=>handleSubmit('Mobile Number')}>{"Verify"}</Button>
                    </FluidForm>
                  </div>)}
                  <PasswordInput
                    id="password"
                    labelText="Password"
                    placeholder="Enter your password"
                    style={{ marginBottom: "15px" }}
                    onChange={e => {
                      setIsInvalid({
                        ...isInvalid,
                        password: validate(1, "password", e.target.value)
                      });
                      setShouldReject(
                        isInvalid.first_name ||
                          isInvalid.last_name ||
                          isInvalid.email ||
                          isInvalid.mobile ||
                          isInvalid.password ||
                          isInvalid.confirm_password ||
                          isInvalid.adhar
                      );
                    }}
                    invalid={isInvalid.password}
                    invalidText={<ul><li>At least one lowercase alphabet i.e. [a-z]</li>
                      <li>At least one uppercase alphabet i.e. [A-Z]</li>
                      <li>At least one Numeric digit i.e. [0-9]</li>
                      <li>At least one special character i.e. [‘@’, ‘$’, ‘.’, ‘#’, ‘!’, ‘%’, ‘*’, ‘?’, ‘&’, ‘^’]</li>
                      <li>Also, the total length must be in the range [8-15]</li></ul>}
                    required
                  />
                  <PasswordInput
                    id="confirm-password"
                    labelText="Confirm Password"
                    placeholder="Confirm your password"
                    style={{ marginBottom: "15px" }}
                    onChange={e => {
                      setIsInvalid({
                        ...isInvalid,
                        confirm_password: validate(
                          1,
                          "confirm_password",
                          e.target.value
                        )
                      });
                      setShouldReject(
                        isInvalid.first_name ||
                          isInvalid.last_name ||
                          isInvalid.email ||
                          isInvalid.mobile ||
                          isInvalid.password ||
                          isInvalid.confirm_password ||
                          isInvalid.adhar
                      );
                    }}
                    invalid={
                      isInvalid.confirm_password &&
                      isInvalid.confirm_password !== null
                    }
                    invalidText="Passwords do not match"
                    required
                  />
                  <TextInput
                    id="adhar-card"
                    labelText={ToggleTip('Adhar Card Number', false, props)}
                    placeholder="Enter your Adhar card number"
                    disabled={verified.adhar}
                    style={{ marginBottom: "15px" }}
                    value={information.step1.adhar}
                    onKeyDown={(e) => {
                      if ((e.key.charCodeAt(0) >= 48 && e.key.charCodeAt(0) <= 57)||e.key === "Backspace") {
                        if ((information.step1.adhar.length === 3 || information.step1.adhar.length === 8)&&information.step1.adhar.length<=14&&!(e.key === "Backspace")) {
                          setIsInvalid({
                            ...isInvalid,
                            adhar: validate(1, "adhar", information.step1.adhar + e.key + " ")
                          });
                        } else if (information.step1.adhar.length <= 14&&!(e.key === "Backspace")) {
                          setIsInvalid({
                            ...isInvalid,
                            adhar: validate(1, "adhar", information.step1.adhar+e.key)
                          });
                        } else if (e.key === "Backspace") {
                          setIsInvalid({
                            ...isInvalid,
                            adhar: validate(1, "adhar", information.step1.adhar.slice(0, -1))
                          });
                        }
                      }
                    }}
                    onChange={e => {
                      setShouldReject(
                        isInvalid.first_name ||
                          isInvalid.last_name ||
                          isInvalid.email ||
                          isInvalid.mobile ||
                          isInvalid.password ||
                          isInvalid.confirm_password ||
                          isInvalid.adhar
                      );
                    }}
                    invalid={isInvalid.adhar && isInvalid.adhar !== null}
                    invalidText="This is a required field"
                    required
                  />
                  {otpOpen==='Adhar'&&!verified?.adhar&&(<div style={{marginTop:"0.5rem"}}>
                    <InputOtp value={token} onChange={(e) => setToken(e.value)} integerOnly length={6} marginBottom/>
                    <FluidForm>
                      <Button disabled={resend} kind="ghost" onClick={()=>ResendOtp('Adhar Card Number')}>{resend?`${timer} s`:"Resend"}</Button>
                      <Button disabled={token?.length<6} kind="ghost" onClick={()=>handleSubmit('Adhar Card Number')}>{"Verify"}</Button>
                    </FluidForm>
                  </div>)}
                </FormGroup>
              </Form>
            </Column>
          </Grid>
        </CreateFullPageStep>

        <CreateFullPageStep
          title="Payment Details"
          subtitle="Please provide your payment information to proceed."
          description={
            <>
              Your payment details are required to complete this transaction. By proceeding, you confirm that you have read and agree to our&nbsp;
              <a href="https://www.kalkinso.com/#/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a> 
              &nbsp;and&nbsp;
              <a href="https://www.kalkinso.com/#/terms-n-conditions" target="_blank" rel="noopener noreferrer">
                Terms and Conditions
              </a>. 
              Your payment data will be securely processed in accordance with these policies to ensure your privacy and security.
            </>
          }
          disableSubmit={
            isInvalid.upi ||
            isInvalid.upi === null ||
            isInvalid.terms_conditions ||
            isInvalid.terms_conditions === null || 
            !verified.upi
          }
          onRequestSubmit={() => {
            // return new Promise((resolve, reject) => {
            //   setTimeout(() => {
            //     if (shouldReject) {
            //       setHasSubmitError(true);
            //       reject();
            //     }
            //     setIsInvalid(false);
            //     register({...information.step1, ...information.step2});
            //   }, simulatedDelay);
            // });
            register({...information.step1, ...information.step2});
          }}
        >
          <Grid fullWidth style={{ padding: "2rem" }}>
            <Column sm={4} md={6} lg={8}>
              <Form>
                <TextInput
                  id="upi-id"
                  labelText={ToggleTip('UPI ID', false, props)}
                  placeholder="Enter your upi id"
                  disabled={verified.upi}
                  onChange={e => {
                    setIsInvalid({
                      ...isInvalid,
                      upi: validate(2, "upi", e.target.value)
                    });
                    setShouldReject(
                      isInvalid.upi ||
                        isInvalid.upi === null ||
                        isInvalid.terms_conditions ||
                        isInvalid.terms_conditions === null
                    );
                  }}
                  invalid={isInvalid.upi && isInvalid.upi !== null}
                  invalidText="This is a required field"
                  required
                />
                {otpOpen==='Upi'&&!verified?.upi&&(<div style={{marginTop:"0.5rem"}}>
                    <InputOtp value={token} onChange={(e) => setToken(e.value)} integerOnly length={6} marginBottom/>
                    <FluidForm>
                      <Button disabled={resend} kind="ghost" onClick={()=>ResendOtp('UPI ID')}>{resend?`${timer} s`:"Resend"}</Button>
                      <Button disabled={token?.length<6} kind="ghost" onClick={()=>handleSubmit('UPI ID')}>{"Verify"}</Button>
                    </FluidForm>
                  </div>)}
              </Form>
            </Column>
          </Grid>

          <span className={`${blockClass}__section-divider`} />

          <Grid>
            <Column span={50}>
              <h5 className={`${blockClass}__step-title`}>
                Terms and Conditions
              </h5>

              <h6 className={`${blockClass}__step-subtitle`}>
                Please read the terms and conditions carefully. By checking the
                box below, you agree to the terms and conditions.
              </h6>
              <Checkbox
                labelText={
                  <div>
                    I agree to the <a href={`${window.location.origin}/#/terms-n-conditions`} target="_blank">terms and conditions</a>
                  </div>
                }
                id="terms-conditions"
                onChange={e => {
                  // console.log(e.target.checked);
                  setIsInvalid({
                    ...isInvalid,
                    terms_conditions: validate(
                      2,
                      "terms_conditions",
                      e.target.checked
                    )
                  });
                  setShouldReject(
                    isInvalid.upi ||
                      isInvalid.upi === null ||
                      isInvalid.terms_conditions ||
                      isInvalid.terms_conditions === null
                  );
                }}
                invalid={
                  isInvalid.terms_conditions &&
                  isInvalid.terms_conditions === null
                }
                invalidText="This is a required field"
                required
                defaultValue={false}
                style={{ marginBottom: "15px" }}
              />
            </Column>
          </Grid>
        </CreateFullPageStep>
      </CreateFullPage>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, { register, sendVerification, verifyOtp, setVerified, setAlert, setOpenOtpModal, verifyUpi })(SignUp)
