import React from "react";
import { Accordion, AccordionItem } from "@carbon/react";
import "./TermsNConditions.scss";

const TermsAndConditions = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>
      <p className="mb-4">
        These Terms & Conditions outline the rules and regulations for the use of our
        website and services. By accessing this website and using our platform, you
        agree to comply with and be bound by the following terms. If you do not agree
        with any part of these terms, please do not use our services.
      </p>
      
      <Accordion>
        <AccordionItem title="1. Eligibility">
          <p>
            By using our platform, you represent and warrant that you are at least 18 years old
            or have the permission of a legal guardian. If you are under the age of 18, you must
            have the consent of a parent or guardian to use our services.
          </p>
        </AccordionItem>

        <AccordionItem title="2. Account Registration">
          <p>
            To access certain features of the platform, you may be required to create an account.
            You agree to provide accurate, current, and complete information during the registration
            process and to update such information to keep it accurate, current, and complete.
            You are responsible for safeguarding your account password and for any activities
            or actions under your account.
          </p>
        </AccordionItem>

        <AccordionItem title="3. User Responsibilities">
          <ul className="list-disc pl-5">
            <li>Users must provide accurate and complete information when placing an order.</li>
            <li>
              Users are responsible for ensuring the safety and legality of the food products
              they purchase from vendors.
            </li>
            <li>
              Users agree not to misuse the platform, including but not limited to spamming,
              hacking, or engaging in any illegal activities.
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem title="4. Payments and Fees">
          <p>
            All payments for orders are processed through our third-party payment processors.
            By placing an order, you agree to pay all applicable fees and charges associated with
            your order. Prices and availability of products are subject to change without notice.
          </p>
          <p>
            <strong>Cancellations and Modifications:</strong> Orders may be canceled or modified
            according to the cancellation policy of the respective vendor. KALKINSO is not
            responsible for any disputes arising from cancellations or modifications of orders.
          </p>
        </AccordionItem>

        <AccordionItem title="5. Limitation of Liability">
          <p>
            KALKINSO is not liable for any indirect, incidental, special, consequential, or
            punitive damages, including loss of profits, data, use, goodwill, or other
            intangible losses resulting from your access to or use of the service.
          </p>
        </AccordionItem>

        <AccordionItem title="6. Intellectual Property">
          <p>
            All content, trademarks, service marks, logos, and other intellectual property on the
            platform are the property of KALKINSO or its licensors. You may not use, reproduce,
            distribute, or create derivative works without our express written consent.
          </p>
        </AccordionItem>

        <AccordionItem title="7. Termination">
          <p>
            We may terminate or suspend your account and access to the platform at our discretion,
            without notice, for conduct that we believe violates these Terms & Conditions or is
            harmful to other users of the platform, us, or third parties, or for any other reason.
          </p>
        </AccordionItem>

        <AccordionItem title="8. Changes to Terms">
          <p>
            We reserve the right to modify these Terms & Conditions at any time. We will notify you
            of any changes by posting the new terms on this page and updating the "Effective Date"
            at the top of these terms. Your continued use of the platform after any modifications
            constitutes acceptance of the new terms.
          </p>
        </AccordionItem>

        <AccordionItem title="9. Governing Law">
          <p>
            These Terms & Conditions are governed by and construed in accordance with the laws of
            India, without regard to its conflict of law principles. Any disputes arising from these
            terms shall be resolved in the courts of India.
          </p>
        </AccordionItem>
        <div class="section-divider"></div>
        <h2>35. CONTACT US</h2>
        <p><br /></p>
        <p>In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:</p>
        <p><br /></p>
        <p><strong>KALKINSO SOFTWARE (OPC) PRIVATE LIMITED  </strong></p>
        <p><strong>KALKINSO SOFTWARE (OPC) PRIVATE LIMITED  , SHUKL PURE NANHA SHUKAL AINDHA PRATAPGARH UP</strong></p>
        <p><strong>PRATAPGARH, Uttar Pradesh 230204</strong></p>
        <p><strong>India</strong></p>
        <p><strong>info@kalkinso.com</strong></p>
      </Accordion>
    </div>
  );
};

export default TermsAndConditions;
