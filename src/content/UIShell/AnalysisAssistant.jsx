import React, { useEffect, useState } from "react";
import { Grid, Column } from "@carbon/react";
import SentimentBarChart from "./Analytics/SentimentBarChart";
import EmotionPieChart from "./Analytics/EmotionPieChart";
import { EditInPlace } from "@carbon/ibm-products";
import axios from "axios";
import { data as SampleData } from "./Analytics/SampleData";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../actions/auth";
import { save } from "../../actions/kits";

const AnalysisAssistant = () => {
  const [data, setData] = useState(SampleData);
  const [value, setValue] = useState("This is the initial description for the analysis.");
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch analysis data from the backend
    let selectedTool = localStorage.getItem("selectedTool");
    if(selectedTool&&selectedTool!=="analysis-assistant"&&Object.keys(selectedTool.selectedEntry).length>0){
      axios.get(selectedTool.selectedEntry.signedUrl).then((res) => {
        setData(res.data);
      }).catch((err) => {});
    }
  }, []);
  const handleEditChange = async () => {
    dispatch(setLoading(true));
    const textResponse = await axios.post(
        '/api/kalkiai/completions',
        JSON.stringify({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert analyst and advisor. and give output only in JSON format. do not include any else other than json',
                },
                {
                    role: 'user',
                    content: `
                            You are a data analysis assistant. Based on the user-provided text, perform the following tasks:
                            1. Search the web for relevant reviews, comments, and discussions related to the provided text.
                            2. Analyze the information to extract:
                                - Sentiment data categorized into Positive, Neutral, and Negative sentiments, along with the respective counts.
                                - Emotional analysis of the audience's responses, including the percentage distribution of emotions such as Joy, Sadness, Anger, and Surprise and give multiple words from the user text and audience comments and news.
                            
                            The user text is: 
                            "${value}"
                            
                            Return the results strictly in the following JSON format:
                            {
                                "ratings": [
                                { "sentiment": "Positive", "count": <positive_count> },
                                { "sentiment": "Neutral", "count": <neutral_count> },
                                { "sentiment": "Negative", "count": <negative_count> },
                                 ... 
                                ],
                                "emotions": [
                                { "emotion": "Joy", "percentage": <joy_percentage>, word: <word1>, },
                                { "emotion": "Sadness", "percentage": <sadness_percentage>, word: <word2> },
                                { "emotion": "Anger", "percentage": <anger_percentage>, word: <word3> },
                                { "emotion": "Surprise", "percentage": <surprise_percentage>, word: <word4> },
                                { "emotion": "<Other Emotions>", "percentage": <other_emotion_percentage>, word: <word5> },
                                { "emotion": "Joy", "percentage": <joy_percentage>, word: <word6>, },
                                { "emotion": "Sadness", "percentage": <sadness_percentage>, word: <word7> },
                                { "emotion": "Anger", "percentage": <anger_percentage>, word: <word8> },
                                { "emotion": "Surprise", "percentage": <surprise_percentage>, word: <word9> },
                                 ...,
                                { "emotion": "<Other Emotions>", "percentage": <other_emotion_percentage>, word: <word(n)> },
                                 ... 40 words
                                ]
                            }
                            Ensure the counts and percentages are realistic based on the analyzed data.
                            `
                }
            ]
        }),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    // console.log(textResponse)

    const analyticsData = JSON.parse(textResponse?.data?.result.replace(/```/g, "").replace(/^json\n/, "").trim()) || []
    setData(analyticsData);
    const fileName = `analysis-assistant-${Date.now()}`;
    const content = JSON.stringify(analyticsData);
    dispatch(save('kalkinso.com', `users/${user}/tasks/tools/analysis-assistant/${fileName}.json`, content, true));
  };
  if (!data) return <div>Loading...</div>;


  return (
    <>
    <Grid>
        <Column lg={16} md={8} sm={4}>
          <h1>Analysis Assistant Dashboard</h1>
          <EditInPlace 
          value={value}
          placeholder="Enter the text to analyze"
          onChange={(e) => setValue(e)}
          onSave={handleEditChange}
          onCancel={() => setValue(value)}
          editAlwaysVisible={true}
          />
        </Column>
    </Grid>
    <Grid style={{
        marginTop: "2rem",
    }}>
        <Column lg={8} md={4} sm={4}>
          <SentimentBarChart data={data.ratings} />
        </Column>
        <Column lg={8} md={4} sm={4}>
          <EmotionPieChart data={data.emotions} />
        </Column>

    </Grid>
    </>
  );
};

export default AnalysisAssistant;
