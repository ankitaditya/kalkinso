import React from "react";
import { StackedBarChart as BarChart } from "@carbon/charts-react";

const SentimentBarChart = ({ data }) => {
  const chartData = data.map((item) => ({
    group: item.sentiment,
    value: item.count,
  }));

  const options = {
    title: "Sentiment Ratings",
    axes: {
      left: {
        mapsTo: "value",
        scaleType: "linear",
      },
      bottom: {
        mapsTo: "group",
        scaleType: "labels",
      },
    },
    height: "400px",
  };

  return <BarChart data={chartData} options={options}></BarChart>;
};

export default SentimentBarChart;
