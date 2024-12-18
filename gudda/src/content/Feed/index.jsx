import React, { useState, useEffect } from "react";
import "./Feed.css";
import * as THREE from "three";
import { Button, Column, Grid, RadioButton, RadioButtonGroup, TextArea } from "@carbon/react";
import FileUpload from "./FileUpload";
import { UserProfileImage } from "@carbon/ibm-products";

const Feed = () => {
  const [postInput, setPostInput] = useState("");
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState({ text: true, image: false });
  const [auth, setAuth] = useState({});
  const [imageInput, setImageInput] = useState("");

  const handlePost = () => {
    if (!postInput.trim()) return;

    const newPost = {
      id: posts.length + 1,
      user: "You",
      content: imageInput?<div>
        <img src={imageInput} alt="Post content" style={{
          cursor: "pointer",
          maxHeight: "500px",
        }} className="post-image" />
        <p>{postInput}</p>
      </div>:postInput,
      geoTag: location || "Not Tagged",
      views: 0,
      reactions: 0,
      reports: 0,
    };

    setPosts([newPost,...posts]);
    setImageInput("");
    setPostInput("");
    setLocation("");

    // setNotifications((prev) => [
    //   { id: prev.length + 1, message: "Your post was successfully created!" },
    // //   ...prev,
    // ]);
  };
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "John Doe",
      content: "Check out the cleanliness drive happening this weekend! 🧹",
      type: "text",
      time: "2 hours ago",
    },
    {
      id: 2,
      username: "Jane Smith",
      content: "https://c.ndtvimg.com/2024-10/4u7nt09g_pm-modi-broom_625x300_02_October_24.jpeg",
      type: "image",
      time: "5 hours ago",
    },
    {
      id: 3,
      username: "Ali Khan",
      content:
        "Shortage of water in Gali No. 7 again! Something needs to be done ASAP. #WaterCrisis",
      type: "text",
      time: "1 day ago",
    },
  ]);

  // Three.js Background Setup
  useEffect(() => {
    if(localStorage.getItem('auth')){
        // User is logged in
        const mainAuth = JSON.parse(localStorage.getItem('auth'));
        setAuth(mainAuth);
    } 
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: false });
    const backgroundContainer = document.getElementById("background-container-feed");

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff); // White background
    backgroundContainer.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(45, 32, 100, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x10a37f,
      wireframe: true,
    });
    const torusKnot = new THREE.Mesh(geometry, material);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);

    scene.add(torusKnot);
    scene.add(light);
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
    {/* 3D Background */}
    <div id="background-container-feed"></div>
    <Grid>
        <Column sm={4} md={8} lg={3} className="sidebar">
            <center>
                <UserProfileImage image={auth?.user?.photoURL} kind="user" size="xl" tooltipAlignment="right" tooltipText={auth?.user?.displayName} />
                <h2>{auth?.user?.displayName}</h2>
            </center>
            <ul>
            <li><a style={{
                color: "#10a37f",
            }} onClick={()=>{
                window.location.href = "/#/feed";
            }}>Feed</a></li>
            <li><a onClick={()=>{
                window.location.href = "/#/release";
            }}>Release</a></li>
            <li><a onClick={()=>{
                window.location.href = "/#/search";
            }}>Search</a></li>
            <li><a onClick={()=>{
                window.localStorage.removeItem('auth');
                window.location.href = "/#/login";
            }}>Logout</a></li>
            </ul>
        </Column>
        <Column sm={4} md={8} lg={10}>
            <div className="feed-page">

                {/* Scrollable Feed */}
                <section className="feed">
                    {/* Create Post UI */}
                    <div className="create-post">
                        <center><h2>G'UDDA POST</h2></center>
                        <Grid>
                            <Column sm={4} md={8} lg={16}>
                            {filters.text&&<TextArea
                                labelText="Raise your Mudda here..."
                                placeholder="Share your issue or idea"
                                value={postInput}
                                onChange={(e) => setPostInput(e.target.value)}
                            />}
                            {filters.image&&<FileUpload input={<TextArea
                                labelText="Raise your Mudda here..."
                                placeholder="Share your issue or idea"
                                value={postInput}
                                onChange={(e) => setPostInput(e.target.value)}
                            />} setImageInput={setImageInput} />}
                            </Column>
                            <Column sm={4} md={8} lg={16}>
                            <Button
                                kind="ghost"
                                style={{
                                    marginTop: "10px",
                                    background: "#10a37f",
                                    float: "right",
                                    color: "white",
                                    borderRadius: "15px",
                                }}
                                onClick={handlePost}
                            >
                                Post Now
                            </Button>
                            </Column>
                        </Grid>
                    </div>
                    {posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <div className="post-header">
                        <strong style={{
                            color: "#10a37f",
                            cursor: "pointer",
                        }}>{post.username}</strong> <span>{post.time}</span>
                        </div>
                        <div className="post-content">
                        {post.type === "image" ? (
                            <img
                            src={post.content}
                            style={{
                                cursor: "pointer",
                                maxHeight: "350px",
                            }}
                            alt="Post content"
                            className="post-image"
                            />
                        ) : (
                            <p>{post.content}</p>
                        )}
                        </div>
                    </div>
                    ))}
                </section>
            </div>
        </Column>
        <Column sm={4} md={8} lg={3} className="sidebar filters">
            <h2>Controls</h2>
            <RadioButtonGroup
                legendText="Post Type"
                orientation="vertical"
                value={"text"}
                defaultValue={"text"}
                onChange={(selected) => {
                    setFilters(selected==="text"?{
                        text: true,
                        image: false,
                    }:{
                        text: false,
                        image: true,
                    });
                }}
                >
                <RadioButton id="filter-text" labelText="Text Posts" value="text" checked />
                <RadioButton id="filter-image" labelText="Image Posts" value="image" />
            </RadioButtonGroup>
        </Column>
    </Grid>
    </>
  );
};

export default Feed;
