import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import {
    ExpressiveCard,
  } from '@carbon/ibm-products';
// import { Card, CardHeader, CardContent, CardActions } from '@carbon/react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Button } from '@carbon/react';

class TaskCarousel extends React.Component {
  state = {
    tasks: [
      "Create a website",
      "Design a logo",
        "Write a blog post",
        "Create a social media post",
    ],
  };

  render() {
    const { tasks } = this.state;

    return (
      <div style={{maxWidth:"25vw"}}>
        <Carousel>
          {tasks.map((task, index) => (
            <div key={index}>
                <ExpressiveCard
                    label={"Example task Kalkinso"}
                    media={<img src={"https://www.shutterstock.com/image-photo/tasks-word-on-wooden-cubes-260nw-1904598853.jpg"} alt={task} style={{ width: '80vw', height: 'auto', borderRadius: '8px 8px 0 0' }} />}
                    primaryButtonText="Add to Board"
                    title={task}
                    slug={true}
                    >
                    <p>
                        As you swipe through the tasks, you'll discover a wide range of opportunities to contribute and earn rewards. 
                        Each task represents a unique challenge and a chance to make a difference. 
                        So go ahead, start swiping and find the perfect task for you!
                    </p>
                </ExpressiveCard>
            </div>
          ))}
        </Carousel>
      </div>
    );
  }
}

export default TaskCarousel;
