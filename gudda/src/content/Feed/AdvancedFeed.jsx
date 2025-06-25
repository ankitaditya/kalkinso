import React, { useState, useEffect } from "react";
import "./AdvancedFeed.css";
import { Button, Tile, TextArea, TextInput, Grid, Column, Theme } from "@carbon/react";
import * as THREE from "three";
import Footer from "../Landing/Footer";

const AdvancedFeed = () => {
  const [notifications, setNotifications] = useState([]);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "John Doe",
      content: "Water crisis in Gali 7 needs urgent action!",
      geoTag: "Gali 7, XYZ Nagar",
      views: 120,
      reactions: 50,
      reports: 0,
    },
    {
      id: 2,
      user: "Jane Smith",
      content: "Cleanliness drive a success in Gali 10 🧹",
      geoTag: "Gali 10, ABC Colony",
      views: 250,
      reactions: 90,
      reports: 0,
    },
  ]);
  const [postInput, setPostInput] = useState("");
  const [location, setLocation] = useState("");

  const handlePost = () => {
    if (!postInput.trim()) return;

    const newPost = {
      id: posts.length + 1,
      user: "You",
      content: postInput,
      geoTag: location || "Not Tagged",
      views: 0,
      reactions: 0,
      reports: 0,
    };

    setPosts([newPost,...posts]);
    setPostInput("");
    setLocation("");

    setNotifications((prev) => [
      { id: prev.length + 1, message: "Your post was successfully created!" },
    //   ...prev,
    ]);
  };

  const handleReport = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, reports: post.reports + 1 } : post
      )
    );

    setNotifications((prev) => [
      { id: prev.length + 1, message: "Post reported for moderation!" },
    //   ...prev,
    ]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotification = {
        id: notifications.length + 1,
        message: "Trending issue: Water Crisis in Gali 7! 🚨",
      };
      setNotifications((prev) => [randomNotification]);
    }, 10000);

    return () => clearInterval(interval);
  }, [notifications]);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    const backgroundContainer = document.getElementById("background-container-feed");

    renderer.setSize(window.innerWidth, window.innerHeight+100);
    renderer.setClearColor(0xffffff); // White background
    backgroundContainer.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x10a37f,
      wireframe: true,
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    camera.position.z = 40;

    const animate = () => {
      requestAnimationFrame(animate);
      torusKnot.rotation.x += 0.01;
      torusKnot.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      backgroundContainer.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
    <div id="background-container-feed"></div>
    <div className="advanced-feed">
      {/* Three.js Background */}

      {/* Notifications */}
      <div className="notifications">
        <h3>🔔 Notifications</h3>
        <ul>
          {notifications.map((note) => (
            <li key={note.id}>{note.message}</li>
          ))}
        </ul>
      </div>

      {/* Create Post Section */}
      <Theme theme="white" style={{
        background: "none",
      }}>
      {/* Feed Section */}
      <div className="feed">
        <h2>📢 Popular Posts</h2>
        <Grid>
            {posts
            //   .sort((a, b) => b.views + b.reactions - (a.views + a.reactions))
              .map((post) => (
                <Column key={post.id} sm={4} md={8} lg={16} style={{
                    margin: "20px",
                    background: "none",
                    color: "black",
                }}>
                  <Tile style={{
                    marginBottom: "20px",
                    background: "none",
                    color: "black",
                    border: "1px solid black",
                  }}>
                    <h3>{post.user}</h3>
                    <p>{post.content}</p>
                    <small>📍 {post.geoTag}</small>
                    <div className="post-meta">
                      <span>👀 {post.views} views</span>
                      <span>❤️ {post.reactions} reactions</span>
                      <Button
                        kind="secondary"
                        size="sm"
                        onClick={() => handleReport(post.id)}
                      >
                        🚩 Report
                      </Button>
                    </div>
                  </Tile>
                </Column>
              ))}
        </Grid>
      </div>
      <div className="create-post">
        <Grid>
            <Column sm={4} md={8} lg={16}>
              <TextArea
                labelText="Raise your Mudda here..."
                placeholder="Share your issue or idea"
                value={postInput}
                onChange={(e) => setPostInput(e.target.value)}
              />
            </Column>
            <Column sm={4} md={8} lg={16}>
              <TextInput
                labelText="Tag location"
                placeholder="e.g., Gali 7, XYZ Nagar"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Column>
            <Column sm={4} md={8} lg={16}>
              <Button
                kind="primary"
                style={{
                    marginTop: "10px",
                    background: "#10a37f",
                }}
                onClick={handlePost}
              >
                Post Now
              </Button>
            </Column>
        </Grid>
      </div>
      </Theme>
    </div>
    </>
  );
};

export default AdvancedFeed;
