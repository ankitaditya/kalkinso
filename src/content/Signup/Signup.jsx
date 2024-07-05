import { CreateFullPage, CreateFullPageStep, usePrefix, pkg } from "@carbon/ibm-products";
import { Checkbox, Column, DefinitionTooltip, Form, FormGroup, Grid, InlineNotification, NumberInput, PasswordInput, RadioButton, RadioButtonGroup, TextInput, Toggle } from "@carbon/react";
import { Dropdown } from "carbon-components-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = ({
  ...args
}) => {
  const paymentMethods = [
    { id: 'credit-card', text: 'Credit Card' },
    { id: 'debit-card', text: 'Debit Card' },
    { id: 'paypal', text: 'PayPal' },
  ];
  const blockClass = `${pkg.prefix}--create-full-page`;
  const storyClass = 'create-full-page-stories';
  const navigate = useNavigate();
  const carbonPrefix = usePrefix();
  const [textInput, setTextInput] = useState('');
  const [upiId, setUpiId] = useState("");
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const [shouldReject, setShouldReject] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [simulatedDelay] = useState(750);
  return <>
      <style>{`.${carbonPrefix}--modal { opacity: 0; }`};</style>
      <CreateFullPage className={`${blockClass}`} {...args} 
      nextButtonText="Next" 
      backButtonText="Back" 
      cancelButtonText="Cancel" 
      submitButtonText="Sign Up"
      modalDangerButtonText="Cancel Sign Up"
      modalSecondaryButtonText="Return to form"
      modalTitle="Are you sure you want to cancel?"
      modalDescription="If you cancel, your account will not be created."
      onRequestSubmit={() => {navigate('/home')}}
      onClose={() => {navigate('/')}}
      >
        <CreateFullPageStep title="Personal Details" subtitle="One or more partitions make up a topic. A partition is an ordered list
        of messages." description="" onNext={() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // Example usage of how to prevent the next step if some kind
            // of error occurred during the `onNext` handler.
            if (shouldReject) {
              setHasSubmitError(true);
              reject();
            }
            setIsInvalid(false);
            resolve();
          }, simulatedDelay);
        });
      }} disableSubmit={!textInput}>
          <Grid fullWidth style={{ padding: '2rem' }}>
            <Column sm={4} md={6} lg={8}>
              <Form>
                <FormGroup legendText="">
                  <TextInput
                    id="first-name"
                    labelText="First Name"
                    placeholder="Enter your first name"
                    style={{marginBottom:"15px"}}
                    onChange={e => {
                      setTextInput(e.target.value);
                      setIsInvalid(false);
                    }}
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
              </Form>
            </Column>
          </Grid>
        </CreateFullPageStep>

        <CreateFullPageStep title="Payment Details" subtitle="This is how many copies of a topic will be made for high availability" description="The partitions of each topic can be replicated across a configurable number of brokers."
        >
        <Grid fullWidth style={{ padding: '2rem' }}>
            <Column sm={4} md={6} lg={8}>
            <Form>
              <TextInput id="cardholder-name" labelText="Cardholder Name" required />
              <TextInput id="card-number" labelText="Card Number" required />
              <TextInput id="expiry-date" labelText="Expiry Date (MM/YY)" required />
              <NumberInput
                id="cvv"
                label="CVV"
                min={100}
                max={999}
                step={1}
                required
              />
              <Dropdown
                id="payment-method"
                titleText="Payment Method"
                label="Select a payment method"
                items={paymentMethods}
              />
              <TextInput 
                id="upi-id" 
                labelText="UPI ID" 
                value={upiId} 
                onChange={(e) => setUpiId(e.target.value)} 
                required 
              />
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
                Please read the terms and conditions carefully. By checking the box below, you agree to the terms and conditions.
              </h6>
              <Checkbox
                  labelText={<div>I agree to the <a>terms and conditions</a></div>}
                  id="terms-conditions"
                  required
                  style={{marginBottom:"15px"}}
                />
            </Column>
          </Grid>
        </CreateFullPageStep>
      </CreateFullPage>
    </>;
}

export default SignUp;