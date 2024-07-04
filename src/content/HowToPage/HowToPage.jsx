import React, { useState, useEffect } from "react";
import { Search, Tile, Grid, Row, Column, Breadcrumb, BreadcrumbItem } from '@carbon/react';
import './HowToPage.css';

const HowToPage = () => {
  const [articles, setArticles] = useState([
    {
      title: "How to Publish a Task on Kalkinso?",
      content: `
        1. Log in to your Kalkinso account.
        2. Go to the 'Publish Task' section from the dashboard.
        3. Fill out the task details: title, description, deadline, and reward.
        4. Click on 'Publish' to make the task available to contributors.
      `
    },
    {
      title: "How to Search for Tasks as a Contributor?",
      content: `
        1. Log in to your Kalkinso account.
        2. Navigate to the 'Search Tasks' page from the main menu.
        3. Use the search bar to input keywords related to your skills or desired tasks.
        4. Filter results by categories, deadlines, or rewards.
        5. Click on a task to view more details and apply.
      `
    },
    {
      title: "How to Formulate an Idea on Kalkinso?",
      content: `
        1. Log in to your Kalkinso account.
        2. Go to the 'Idea Formulation' section under the 'Tasks' menu.
        3. Fill out the necessary fields including idea title, description, and objectives.
        4. Attach any supporting documents or media.
        5. Click 'Submit' to save your formulated idea which can then be converted to tasks.
      `
    },
    {
      title: "How to Communicate with Contributors?",
      content: `
        1. On your dashboard, navigate to 'My Tasks'.
        2. Select the task and click on 'View Contributors'.
        3. Use the built-in messaging feature to chat with selected contributors.
        4. You can also set up video or voice calls for more in-depth discussions.
      `
    },
    {
      title: "How to Use Kalkinso’s Designing Tools?",
      content: `
        1. Access the 'Design Tools' section from the main menu.
        2. Choose the tool that best fits your task, e.g., wireframing, prototyping, or graphic design.
        3. Utilize the drag-and-drop interface to create your designs.
        4. Save and download your designs for future use or share them with your team.
      `
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => {
      return regex.test(part) ? <mark key={index}>{part}</mark> : part;
    });
  };
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="app">
      <Breadcrumb>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbItem href="#" isCurrentPage>
          How-To Guides
        </BreadcrumbItem>
      </Breadcrumb>
      <h1 className="how-to-heading">How-To Guides</h1>
      <Search
        id="how-to-search"
        labelText="Search for guides"
        placeHolderText="Search for how-to articles..."
        light
        size="lg"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Grid className="grid">
          {filteredArticles.map((article, index) => (
            <Column key={index} md={4} lg={16}>
              <Tile>
                <h2>{highlightText(article.title,searchQuery)}</h2>
                <p>{article.content.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>
              </Tile>
            </Column>
          ))}
      </Grid>
    </div>
  );
};

export default HowToPage;