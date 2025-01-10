import React, { useState, useEffect } from "react";
import "./Search.css";
import * as THREE from "three";
import {
    Loading
} from "@carbon/react"
import { news } from "../utils/news"
import { getPlace } from "../utils";
import axios from "axios";

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const newResults = news.map((item, index) => {
    return {
      id: index+1,
      title: item.title,
      content: item.snippet,
      image: item.pagemap.cse_image,
      link: item.link
    };
  })

  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearch = () => {
    if(!location || !location.address || !location.pincode){
      alert("Location not found. Please enable location services and try again.");
      return;
    }
    if (!searchInput.trim()) {
        setFilteredResults([]);
        return;
    }
    
    axios.get(`https://www.kalkinso.com/api/news/mudda?q=${encodeURIComponent(searchInput.toLocaleLowerCase())}&address=${location.address}&pincode=${location.pincode}`).then((res) => {
      setFilteredResults(res.data.map((item, index) => {
        return {
          ...item.news,
          id: index+1,
          summary: item.news.content.length > 100 ? item.news.content.slice(0, 100) + "..." : item.news.content,
        };
      }));
      localStorage.setItem('searchResultsNews', JSON.stringify(res.data.map((item, index) => {
        return {
          ...item.news,
          id: index+1,
          summary: item.news.content.length > 100 ? item.news.content.slice(0, 100) + "..." : item.news.content,
        };
      })));
      setLoading(false);
    }).catch((err) => {
        console.log(err);
    });
    window.location.href = window.location.href.split('?')[0]+`?q=${encodeURIComponent(searchInput.toLocaleLowerCase())}`;
    setLoading(true);
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

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getPlace(position.coords.latitude, position.coords.longitude, true).then((res) => {
          setLocation(res);
        });
      },
      () => alert("Unable to fetch location")
    );
  },[])

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
            <div key={result.id} className="result-card" onClick={()=>{
              window.location.href = `/#/feed/${result.id}`;
              // window.location.reload();
            }}>
              <img src={result?.image[0]?.src?result?.image[0]?.src:result?.image[0]} height={100} alt="thumbnail" />
              <h3>{result.title}</h3>
              <p>{result.summary}</p>
              {/* <div className="tags">
                {result.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div> */}
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
