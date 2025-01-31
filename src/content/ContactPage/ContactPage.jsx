import React from 'react';
import { useState } from 'react';
import {
  Button,
  TextInput,
  TextArea,
  Grid,
  Column,
  Form,
  FormLabel,
} from '@carbon/react';
import './ContactPage.css';
import { useDispatch } from 'react-redux';
import { setAlert } from '../../actions/alert';

export function ContactPage() {

  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (formValues.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }
    if (!/^\S+@\S+$/.test(formValues.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    if (formValues.subject.trim().length === 0) {
      newErrors.subject = 'Subject is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const apiUrl = `${window.location.origin}/api/contact`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        dispatch(setAlert('Email sent successfully', 'success'));
      } else {
        dispatch(setAlert('Error sending email', 'error'));
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className='content-container'>
      <h2 style={{ textAlign: 'center', fontWeight: 700 }}>Get in touch</h2>

      <Grid style={{marginTop: '1rem'}}>
        <Column sm={4} md={4} lg={8}>
          <TextInput
            labelText="Name"
            id="name"
            name="name"
            placeholder="Your name"
            value={formValues.name}
            onChange={handleChange}
            invalid={!!errors.name}
            invalidText={errors.name}
          />
        </Column>
        <Column sm={4} md={4} lg={8}>
          <TextInput
            labelText="Email"
            id="email"
            name="email"
            placeholder="Your email"
            value={formValues.email}
            onChange={handleChange}
            invalid={!!errors.email}
            invalidText={errors.email}
          />
        </Column>
      </Grid>

      <Grid style={{marginTop: '1rem'}}>
        <Column sm={4} md={8} lg={16}>
          <TextInput
            labelText="Subject"
            id="subject"
            name="subject"
            placeholder="Subject"
            value={formValues.subject}
            onChange={handleChange}
            invalid={!!errors.subject}
            invalidText={errors.subject}
          />
        </Column>
      </Grid>

      <Grid style={{marginTop: '1rem'}}>
        <Column sm={4} md={8} lg={16}>
          <TextArea
            labelText="Message"
            id="message"
            name="message"
            placeholder="Your message"
            value={formValues.message}
            rows={5}
          />
        </Column>
      </Grid>


      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Button type="submit" size="lg">
          Send message
        </Button>
      </div>

      <Grid style={{marginTop:"2rem"}}>
        <Column sm={4} md={8} lg={16}>
          <h2>Contact Info</h2>
          <ul>
            <li>Email: <a href="mailto:info@kalkinso.com">info@kalkinso.com</a></li>
            <li>Address: KALKINSO SOFTWARE (OPC) PRIVATE LIMITED  , Pratapgarh, Uttar Pradesh, India</li>
          </ul>
          <br />
          <h2>Our Location</h2>
          <div style={{ border: '1px solid #ccc', padding: '16px', marginTop: '16px' }}>
          {/* Placeholder for map.
              Replace with your preferred map service (e.g., Google Maps, OpenStreetMap)
          */}
          <iframe 
            title="Our Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14373.256738784808!2d81.58541670105262!3d25.76018401299691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399ade7bb3742f6f%3A0x293ace2ca0e93e83!2sHiraganj%2C%20Jagapur%2C%20Uttar%20Pradesh%20230204!5e0!3m2!1sen!2sin!4v1731399625821!5m2!1sen!2sin" 
            style={{ border: 0, width: '100%', height: '400px' }}
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          </div>
        </Column>
      </Grid>

    </Form>
  );
}

export default ContactPage;
