import React, { useEffect } from "react";
import "./Release.css";
import * as THREE from "three";

const Release = () => {
  const releases = [
    {
      id: 1,
      title: "Water Shortage in Gali No. 12",
      description:
        "Residents are facing a major water crisis due to a pipeline issue. Local authorities have promised repairs soon.",
      date: "2024-06-17",
      image: "https://images.hindustantimes.com/img/2022/06/09/550x309/eda3a116-e821-11ec-a635-885b646977d8_1654799429939.jpg",
      author: "Admin",
    },
    {
      id: 2,
      title: "Community Cleanliness Drive Success",
      description:
        "Over 100 residents joined hands to clean the neighborhood. The event was a great success!",
      date: "2024-06-15",
      image: "https://c.ndtvimg.com/2024-10/4u7nt09g_pm-modi-broom_625x300_02_October_24.jpeg",
      author: "Community Leader",
    },
    {
      id: 3,
      title: "Upcoming Youth Festival in XYZ Nagar",
      description:
        "A three-day youth festival is scheduled with cultural events, sports competitions, and more.",
      date: "2024-06-10",
      image: "https://scontent.fixr3-3.fna.fbcdn.net/v/t39.30808-6/270251463_4602154226571331_3600365023107507544_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=eqGhjcqM7JwQ7kNvgHRDpm8&_nc_zt=23&_nc_ht=scontent.fixr3-3.fna&_nc_gid=AlbwyDdd91plZHULsGDTkEB&oh=00_AYBGW0nOsUe_SAZx_uJWi-9Ye_jM6npPqCZxHK62hHuCWw&oe=676853F4",
      author: "Youth Organizer",
    },
    {
        id: 4,
        title: "Water Shortage in Gali No. 12",
        description:
          "Residents are facing a major water crisis due to a pipeline issue. Local authorities have promised repairs soon.",
        date: "2024-06-17",
        image: "https://images.hindustantimes.com/img/2022/06/09/550x309/eda3a116-e821-11ec-a635-885b646977d8_1654799429939.jpg",
        author: "Admin",
      },
      {
        id: 5,
        title: "Community Cleanliness Drive Success",
        description:
          "Over 100 residents joined hands to clean the neighborhood. The event was a great success!",
        date: "2024-06-15",
        image: "https://c.ndtvimg.com/2024-10/4u7nt09g_pm-modi-broom_625x300_02_October_24.jpeg",
        author: "Community Leader",
      },
      {
        id: 6,
        title: "Upcoming Youth Festival in XYZ Nagar",
        description:
          "A three-day youth festival is scheduled with cultural events, sports competitions, and more.",
        date: "2024-06-10",
        image: "https://scontent.fixr3-3.fna.fbcdn.net/v/t39.30808-6/270251463_4602154226571331_3600365023107507544_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=eqGhjcqM7JwQ7kNvgHRDpm8&_nc_zt=23&_nc_ht=scontent.fixr3-3.fna&_nc_gid=AlbwyDdd91plZHULsGDTkEB&oh=00_AYBGW0nOsUe_SAZx_uJWi-9Ye_jM6npPqCZxHK62hHuCWw&oe=676853F4",
        author: "Youth Organizer",
      },
      {
        id: 7,
        title: "Community Cleanliness Drive Success",
        description:
          "Over 100 residents joined hands to clean the neighborhood. The event was a great success!",
        date: "2024-06-15",
        image: "https://c.ndtvimg.com/2024-10/4u7nt09g_pm-modi-broom_625x300_02_October_24.jpeg",
        author: "Community Leader",
      },
      {
        id: 8,
        title: "Upcoming Youth Festival in XYZ Nagar",
        description:
          "A three-day youth festival is scheduled with cultural events, sports competitions, and more.",
        date: "2024-06-10",
        image: "https://scontent.fixr3-3.fna.fbcdn.net/v/t39.30808-6/270251463_4602154226571331_3600365023107507544_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=eqGhjcqM7JwQ7kNvgHRDpm8&_nc_zt=23&_nc_ht=scontent.fixr3-3.fna&_nc_gid=AlbwyDdd91plZHULsGDTkEB&oh=00_AYBGW0nOsUe_SAZx_uJWi-9Ye_jM6npPqCZxHK62hHuCWw&oe=676853F4",
        author: "Youth Organizer",
      },
  ];

  // Three.js Background Setup
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const backgroundContainer = document.getElementById("background-container-release");

    renderer.setSize(window.innerWidth, window.innerHeight);
    backgroundContainer.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(10, 32,42, 42);
    const material = new THREE.MeshBasicMaterial({
      color: 0x10a37f,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);

    scene.add(sphere);
    scene.add(light);
    camera.position.z = 40;

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      backgroundContainer.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="release-body">
      {/* Three.js Background */}
        <h1 className="page-title">Latest Releases</h1>
        <div id="background-container-release"></div>
        <div className="release-container">
            {releases.map((release) => (
            <div key={release.id} className="release-card">
                <img
                height={600}
                width={300}
                src={release.image}
                alt={release.title}
                className="release-image"
                />
                <div className="release-content">
                <h2 className="release-title">{release.title}</h2>
                <p className="release-description">{release.description}</p>
                <div className="release-footer">
                    <span className="release-date">{release.date}</span>
                    <span className="release-author">By {release.author}</span>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
  );
};

export default Release;
