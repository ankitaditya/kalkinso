import ReactDOM from 'react';
import './PrivacyPolicy.scss';

const PrivacyPolicy = () => {
    return (
        <div class="tnc-container">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last updated: November 11, 2024</p>

        <p>This Privacy Policy is designed to comply with global privacy laws, including:</p>
        <ul>
            <li><strong>CalOPPA</strong> - California Online Privacy Protection Act</li>
            <li><strong>GDPR</strong> - EU General Data Protection Regulation</li>
            <li><strong>CCPA (CPRA)</strong> - California Consumer Privacy Act</li>
            <li>Other applicable international privacy laws</li>
        </ul>

        <div class="section-divider"></div>

        <h2>Compliance with Privacy Laws</h2>
        <h3>CalOPPA Compliance</h3>
        <p>Under the California Online Privacy Protection Act, we are required to disclose how we collect, use, and share your information, and we provide you with the ability to opt-out of data collection.</p>
        <ul>
            <li>Users can visit our site anonymously.</li>
            <li>We include a link to our Privacy Policy on our home page and other key sections of our website.</li>
            <li>Users will be notified of any Privacy Policy changes on this page.</li>
        </ul>

        <h3>GDPR Compliance</h3>
        <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights. These include the right to:</p>
        <ul>
            <li>Access, update, or delete the personal information we have on you.</li>
            <li>Request the correction of incorrect or incomplete information.</li>
            <li>Object to our processing of your personal data.</li>
            <li>Request the transfer of your data to another organization.</li>
        </ul>

        <h3>CCPA Compliance</h3>
        <p>In compliance with the California Consumer Privacy Act (CCPA), we inform California residents of their rights:</p>
        <ul>
            <li>The right to know the categories of personal data we collect.</li>
            <li>The right to request deletion of their personal data.</li>
            <li>The right to opt-out of the sale of their personal data.</li>
        </ul>

        <div class="section-divider"></div>

        <h2>Third-Party Services and Data Sharing</h2>
        <p>We may use the following third-party services to enhance our Service:</p>
        <h3>Analytics</h3>
        <ul>
            <li>We use analytics tools such as Google Analytics to understand user behavior. Google Analytics uses cookies to collect data on how users interact with our website.</li>
        </ul>

        <h3>Email Marketing</h3>
        <ul>
            <li>We may use email marketing platforms like MailChimp to send promotional emails. Your email will only be used for marketing purposes with your consent.</li>
        </ul>

        <h3>Ads</h3>
        <ul>
            <li>We may partner with advertising networks like Google Ads to display ads on our website. These networks may use cookies to personalize ads based on your browsing behavior.</li>
        </ul>

        <h3>Payments</h3>
        <ul>
            <li>We use payment processors such as PayPal to handle transactions securely. We do not store your payment information on our servers.</li>
        </ul>

        <div class="section-divider"></div>

        <h2>Data Security and Retention</h2>
        <p>We take data security seriously and implement measures to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.</p>
        <p>We will retain your personal data only as long as necessary for legal and business purposes.</p>

        <h3>Data Deletion</h3>
        <p>You may request the deletion of your personal data by contacting us at <a href="mailto:info@kalkinso.com">info@kalkinso.com</a>.</p>

        <div class="section-divider"></div>

        <h2>Contact Us</h2>
        <p>If you have any questions regarding this Privacy Policy, please contact us:</p>
        <ul>
            <li>Email: <a href="mailto:info@kalkinso.com">info@kalkinso.com</a></li>
            <li>Website: <a href="https://www.kalkinso.com/contact" target="_blank" rel="noreferrer">https://www.kalkinso.com/contact</a></li>
            <li>Address: KALKINSO SOFTWARE (OPC) PRIVATE LIMITED  , Pratapgarh, Uttar Pradesh, India</li>
        </ul>

        <h1> Other Policies </h1>

        <p style={{ color: '#555' }}>
                Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard 
                your information when you visit our website and use our services. Please read this policy carefully. If you do 
                not agree with the terms of this Privacy Policy, please do not access the site.
            </p>

            <h2 style={{ color: '#333' }}>1. Information We Collect</h2>

            <h3 style={{ color: '#333' }}>1.1 Personal Information</h3>
            <p style={{ color: '#555' }}>We may collect personal information that you provide to us, such as:</p>
            <ul style={{ color: '#555' }}>
                <li><strong>Contact Information:</strong> Name, email address, phone number.</li>
                <li><strong>Account Information:</strong> Username, password, and other registration details.</li>
                <li><strong>Location Information:</strong> When you use our services to find nearby vendors, we may collect your location data.</li>
            </ul>

            <h3 style={{ color: '#333' }}>1.2 Usage Data</h3>
            <p style={{ color: '#555' }}>We automatically collect certain information when you visit our site, including:</p>
            <ul style={{ color: '#555' }}>
                <li><strong>Device Information:</strong> Information about your device, including IP address, browser type, and operating system.</li>
                <li><strong>Usage Information:</strong> Details about your interactions with our website, such as pages visited, time spent on the site, and other diagnostic data.</li>
            </ul>

            <h3 style={{ color: '#333' }}>1.3 Cookies and Tracking Technologies</h3>
            <p style={{ color: '#555' }}>
                We use cookies and similar tracking technologies to track the activity on our website and store certain information. 
                You can control the use of cookies through your browser settings.
            </p>

            <h2 style={{ color: '#333' }}>2. How We Use Your Information</h2>
            <p style={{ color: '#555' }}>We use the information we collect for various purposes, including:</p>
            <ul style={{ color: '#555' }}>
                <li><strong>To Provide and Maintain Our Service:</strong> To connect you with nearby vendors based on your location.</li>
                <li><strong>To Manage Your Account:</strong> To manage your registration as a user and facilitate your access to the services.</li>
                <li><strong>To Communicate with You:</strong> To send updates, notifications, and information related to your account or orders.</li>
                <li><strong>For Marketing Purposes:</strong> To provide you with news, special offers, and general information about other goods, services, and events unless you have opted not to receive such information.</li>
                <li><strong>To Improve Our Services:</strong> To understand how our services are used and to improve our offerings.</li>
            </ul>
    </div>
    )
}

export default PrivacyPolicy;