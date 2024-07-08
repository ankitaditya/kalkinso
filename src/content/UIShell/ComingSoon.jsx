import React, { useEffect, useState } from 'react';
// import { Header, HeaderName, HeaderNav, HeaderMenuItem } from "@carbon/react";
import { Grid, Row, Column } from '@carbon/react';
import { Timer } from '@carbon/icons-react';
import { Button } from '@carbon/react';
import './ComingSoon.css';

const ComingSoon = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date('2023-12-31') - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
        }

        timerComponents.push(
            <span key={interval}>
                {timeLeft[interval]} {interval}{" "}
            </span>
        );
    });

    return (
        <Grid fullWidth className="coming-soon-content">
                <Column lg={15} md={8} sm={6} className="center">
                    <h1>Coming Soon!</h1>
                    <p>We are working hard to finish the development of this site. Visit us again soon!</p>
                    <div className="timer">
                        {timerComponents.length ? timerComponents : <span>Time's up!</span>}
                    </div>
                    <Button renderIcon={Timer} iconDescription="Timer Button">Get Notified</Button>
                </Column>
        </Grid>
    );
};

export default ComingSoon;