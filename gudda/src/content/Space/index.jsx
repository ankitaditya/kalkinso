import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import './Dashboard.scss';
import * as THREE from "three";

const Space = () => {
    // Three.js background effect
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
        );
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        const backgroundContainer = document.getElementById("threejs-canvas");

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
        <Navbar />
        <Dashboard />
        </>
    );
};

export default Space;