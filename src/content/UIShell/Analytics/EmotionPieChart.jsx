import React from "react";
import { WordCloudChart } from "@carbon/charts-react";

const EmotionPieChart = ({ data }) => {

  const PieChartData = data.map((item) => ({
    group: item.emotion,
    value: item.percentage,
    word: item.word? item.word : item.emotion,
  }));

  const options = {
    title: "Audience Emotions Distribution",
    resizable: true,
    color: {
        pairing: {
        option: 3
        }
    },
    height: '400px'
  };

  return <WordCloudChart
  data={PieChartData}
  options={options}
></ WordCloudChart>;
};

export default EmotionPieChart;
