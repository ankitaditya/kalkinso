import React, { useState, useEffect } from "react";
import "./Search.css";
import * as THREE from "three";
import {
    Loading
} from "@carbon/react"

const Search = () => {
  const [loading, setLoading] = useState(false);
  const mockResults = [
    {
      id: 1,
      title: "Water Crisis in Gali No. 7",
      content:
        "Residents have reported severe water shortages due to broken pipelines. Authorities are yet to respond.",
      tags: ["#WaterCrisis", "#Gali7"],
    },
    {
      id: 2,
      title: "Cleanliness Drive Success",
      content:
        "Community members joined hands to clean Gali No. 10. Over 50 people participated, and waste was collected.",
      tags: ["#CleanGali10", "#CommunityWork"],
    },
    {
      id: 3,
      title: "Local Diwali Celebration",
      content:
        "Diwali celebrations in XYZ Nagar saw beautiful decorations and a strong sense of unity among residents.",
      tags: ["#DiwaliFestival", "#XYZNagar"],
    },
  ];

  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearch = () => {
    if (!searchInput.trim()) {
        setFilteredResults([]);
        return;
    }
    setLoading(true);
    setTimeout(() => {
        const results = mockResults
      .filter((item) =>
        item.title.toLowerCase().includes(searchInput.toLowerCase())
      )
      .map((item) => ({
        ...item,
        summary: item.content.length > 100 ? item.content.slice(0, 100) + "..." : item.content,
      }));

    setFilteredResults(results);
    setLoading(false);
    }, 200);
  };

  useEffect(() => {
    // Three.js Background Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const backgroundContainer = document.getElementById("background-container");

    renderer.setSize(window.innerWidth, window.innerHeight);
    backgroundContainer.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(20, 32,32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x10a37f,
      wireframe: true,
    });
    const dodecahedron = new THREE.Mesh(geometry, material);
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);

    scene.add(dodecahedron);
    scene.add(light);
    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);
      dodecahedron.rotation.x += 0.01;
      dodecahedron.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      backgroundContainer.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
    {loading && <Loading className="loader" />}
    <div className="search-page">
      {/* Three.js Background */}
      <div id="background-container"></div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Mudda..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search Results */}
      <div className="search-results">
        {filteredResults.length > 0 ? (
          filteredResults.map((result) => (
            <div key={result.id} className="result-card">
              <h3>{result.title}</h3>
              <p>{result.summary}</p>
              <div className="tags">
                {result.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : 
          (<p className="no-results">No results found. Try searching something else.</p>)
        }
      </div>
    </div>
    </>
  );
};

export default Search;
