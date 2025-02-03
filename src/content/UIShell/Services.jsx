import React from 'react';

const services = [
  { icon: '🌐', title: 'Web Development', price: '₹1,499/- per page', description: 'Custom websites, portals & e-commerce stores.' },
  { icon: '🤖', title: 'AI & AI Tools Development', price: '₹999/- per module', description: 'Chatbots, automation, ML models & AI-powered tools.' },
  { icon: '🔬', title: 'Research Tools & Experiments', price: '₹3,999/-', description: 'Custom software & automation for research.' },
  { icon: '🎓', title: 'College Projects', price: '₹2,499/- onwards', description: 'AI, IoT, software & final-year projects with reports.' },
  { icon: '🛠️', title: 'Gadget Development', price: '₹5,999/-', description: 'IoT devices, embedded systems & smart automation.' },
  { icon: '📊', title: 'Presentation Development', price: '₹999/-', description: 'Professional PPTs, pitch decks & animated slides.' },
  { icon: '👗', title: 'Fashion Designing', price: '₹1,999/-', description: 'AI-assisted apparel design & virtual prototypes.' },
  { icon: '⚙️', title: 'Tools Designing', price: '₹3,499/-', description: 'CAD modeling, industrial tools & 3D prototyping.' },
];

const Services = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🚀 KALKINSO - Build What You Want, Pay As You Go!</h1>
      <p style={styles.intro}>At KALKINSO, we give you the freedom to develop at your own pace with our Pay As You Go model. No upfront costs—just affordable, scalable solutions for businesses, researchers, and students!</p>
      
      <h2 style={styles.subHeader}>🔥 Services & Flexible Pricing</h2>
      <div style={styles.servicesGrid}>
        {services.map((service, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.icon}>{service.icon}</div>
            <h3 style={styles.serviceTitle}>{service.title}</h3>
            <p style={styles.price}>{service.price}</p>
            <p style={styles.description}>{service.description}</p>
          </div>
        ))}
      </div>

      <h2 style={styles.subHeader}>🌟 Why Choose Us?</h2>
      <ul style={styles.benefitsList}>
        <li>✅ No Upfront Cost – Pay only for what you need</li>
        <li>✅ Scale Anytime – Start small, grow as required</li>
        <li>✅ Affordable & Fast – Budget-friendly pricing for all</li>
      </ul>

      <div style={styles.offer}>🎁 First-Time Users Get ₹500/- Off!</div>
      <div style={styles.contact}>📞 Contact Us Now – Your Ideas, Your Budget! 🚀</div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '2em',
    color: '#333',
    marginBottom: '10px',
  },
  intro: {
    fontSize: '1.1em',
    color: '#555',
    marginBottom: '20px',
  },
  subHeader: {
    fontSize: '1.5em',
    color: '#222',
    margin: '20px 0 10px',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  icon: {
    fontSize: '2.5em',
    marginBottom: '10px',
  },
  serviceTitle: {
    fontSize: '1.2em',
    color: '#333',
    marginBottom: '5px',
  },
  price: {
    fontSize: '1em',
    color: '#007bff',
    marginBottom: '5px',
  },
  description: {
    fontSize: '0.95em',
    color: '#555',
  },
  benefitsList: {
    listStyleType: 'none',
    padding: 0,
    color: '#444',
    fontSize: '1em',
  },
  offer: {
    fontSize: '1.2em',
    color: '#d9534f',
    marginTop: '20px',
    textAlign: 'center',
  },
  contact: {
    fontSize: '1.2em',
    color: '#5cb85c',
    marginTop: '10px',
    textAlign: 'center',
  },
};

export default Services;
