import React, { useEffect } from 'react';
import './Landing.css';
import { Button, Tile, Grid, Column } from '@carbon/react';
import * as THREE from 'three';

const Landing = () => {
  const trendingMudda = [
    { id: 1, title: 'Water Crisis in Gali 24', description: 'Residents face severe water shortage this week.' },
    { id: 2, title: 'Community Cleanliness Drive', description: 'Local youth organize a successful cleanup drive.' },
    { id: 3, title: 'Festival Celebration in XYZ Nagar', description: 'The neighborhood comes together for Diwali!' },
  ];

  useEffect(() => {
    // Three.js setup for Hero Banner background
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    const heroBanner = document.getElementById('hero-banner');
    renderer.setSize(window.innerWidth, window.innerHeight);
    heroBanner.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(15, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x10a37f, wireframe: true });
    const sphere = new THREE.Mesh(geometry, material);

    scene.add(sphere);
    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      heroBanner.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Banner */}
      <section id="hero-banner" className="hero-banner">
        <div className="hero-content">
          <h1>M'udda: Galiyon Ka Mudda</h1>
          <p>Your voice, your platform! Raise issues, share stories, and be heard.</p>
          <Button
            kind="ghost"
            style={{
                color: '#ffffff',
                borderColor: '#ffffff',
                marginTop: '1rem',
            }}
            size="lg"
            onClick={() => {
              window.location.href = `${window.location.origin}/#/login`;
            }}
          >
            Join the Conversation
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose M'udda?</h2>
        <Grid>
            <Column className='feature' sm={4} md={2} lg={4}>
              <Tile onClick={() => window.location.href = `${window.location.origin}/#/feed`}>
                <h3>📸 Share Content</h3>
                <p>Upload photos, videos, and topics about your neighborhood issues.</p>
              </Tile>
            </Column>
            <Column className='feature' sm={4} md={2} lg={4}>
              <Tile onClick={() => window.location.href = `${window.location.origin}/#/search`}>
                <h3>🔎 Search Engine</h3>
                <p>Find summarized content easily with our smart search engine.</p>
              </Tile>
            </Column>
            <Column className='feature' sm={4} md={2} lg={4}>
              <Tile onClick={() => window.location.href = `${window.location.origin}/#/release`}>
                <h3>📰 Release Section</h3>
                <p>Get news, updates, and shows about collective issues.</p>
              </Tile>
            </Column>
            <Column className='feature' sm={4} md={2} lg={4}>
              <Tile onClick={() => window.location.href = `${window.location.origin}/#/release`}>
                <h3>📰 Write Section</h3>
                <p>Get news, updates, and shows about collective issues.</p>
              </Tile>
            </Column>
        </Grid>
      </section>

      {/* Trending Mudda Section */}
      <section className="trending-mudda-section">
        <h2>🔥 Trending Mudda</h2>
        <div className="trending-list">
          {trendingMudda.map((mudda) => (
            <Tile
              key={mudda.id}
              onClick={() => window.location.href = `${window.location.origin}/#/release`}
              className="trending-item"
            >
              <h3>{mudda.title}</h3>
              <p>{mudda.description}</p>
            </Tile>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
