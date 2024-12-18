import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Mudda = () => {
  const globeContainerRef = useRef(null);

  useEffect(() => {
    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const container = globeContainerRef.current;
    container.appendChild(renderer.domElement);

    // Create Globe
    const globeGeometry = new THREE.SphereGeometry(8, 32, 32);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 'black',
      wireframe: true,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Add Light
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Animation for Raising Mudda
    const points = [];
    for (let i = 0; i < 10; i++) {
      const point = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );
      point.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      points.push(point);
      scene.add(point);
    }

    const animate = () => {
      requestAnimationFrame(animate);

      globe.rotation.y += 0.002;

      points.forEach((point) => {
        point.position.y += 0.05; // Raise animation
        if (point.position.y > 6) point.position.y = -6; // Reset position
      });

      renderer.render(scene, camera);
    };

    camera.position.z = 15;
    animate();

    // Cleanup
    return () => {
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={globeContainerRef}
      className="globe-container"
    ></div>
  );
};

export default Mudda;
