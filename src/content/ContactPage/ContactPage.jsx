import React from 'react';
import { 
  Content, 
  TextInput, 
  TextArea, 
  Button, 
  Grid, 
  Row, 
  Column 
} from '@carbon/react';

const ContactPage = () => {
  return (
    <Grid className="contact-page" fullWidth>
        <Column lg={16} md={8} sm={4}>
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Please fill out the form below and we will get in touch with you as soon as possible.</p>

        <TextInput
        id="name"
        labelText="Name"
        placeholder="John Doe"
        required
        />
        
        <TextInput
        id="email"
        type="email"
        labelText="Email"
        placeholder="johndoe@example.com"
        required
        />

        <TextInput
        id="subject"
        labelText="Subject"
        placeholder="Subject"
        />

        <TextArea
        id="message"
        labelText="Message"
        placeholder="Your message"
        required
        style={{marginBottom: '16px'}}
        />

        <Button kind="primary" type="submit">Send Message</Button>
    </Column>
    
    <Column lg={16} md={8} sm={4}>
        <h2>Our Location</h2>
        <p>1234 Example St, Sample City, EX 12345</p>

        <div style={{ border: '1px solid #ccc', padding: '16px', marginTop: '16px' }}>
        {/* Placeholder for map.
            Replace with your preferred map service (e.g., Google Maps, OpenStreetMap)
        */}
        <iframe
            title="Our Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345094318!2d144.95373631589643!3d-37.816279679751555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf57766e771e9a1!2sFlinder%20Street%20Station%2C%20Melbourne%20VIC%203009%2C%20Australia!5e0!3m2!1sen!2sus!4v1633402975339!5m2!1sen!2sus"
            style={{ border: 0, width: '100%', height: '400px' }}
            allowFullScreen=""
            loading="lazy"
        ></iframe>
        </div>
    </Column>
      </Grid>
  );
};

export default ContactPage;