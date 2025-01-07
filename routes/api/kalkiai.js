require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const invoke = require("../../models/LambdaInput");
const User = require("../../models/User");
const ChatSession = require("../../models/ChatSession");
const Tasks = require("../../models/Tasks");
const ipAuth = require("../../middleware/ipAuth");
const AWS = require('aws-sdk');
const Pusher = require('pusher');
const axios = require("axios");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const router = express.Router();

const s3 = new AWS.S3();
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

router.post(
  "/",
  auth,
  ipAuth,
  [  
    body("payload", "Payload is required").not().isEmpty()
    ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }
      const { payload } = req.body;
      let result_has_task_list = false;
      let newPayload = {
        request: {
          ...payload.request,
          api_key: process.env.REACT_APP_OPENAI_API_KEY,
          },
        session: {
          ...payload.session,
        }
        };
      console.log("This is my payload: ", newPayload);
      let result = await invoke("kalki-AIStack", newPayload);
      let new_result = null;
      result_has_task_list = result_has_task_list || (Array.isArray(result) && result.some((res) => typeof res['content'] === 'object' && Array.isArray(res['content']?.task_list)));
      let new_session = await ChatSession.findById(payload.session.session_id);
      if(!result_has_task_list){
        await result.forEach( async (res, key) => {
            if(typeof res['content'] === 'object'&& new_result===null){
                let newPayload = {...payload};
                console.log("This is inside next invoke: ",res);
                newPayload['request']['prompt'] = {role: 'user', content: res['content'].standard_operating_procedures};
                new_result = await invoke("kalki-AIStack", newPayload);
            }
        });
        
        if(new_result){
            result_has_task_list = true;
            result = new_result;
        } else {
            return res.json({session: new_session, result: result});
        }
      } else {
        if (!result) {
            return res.status(500).json({ msg: "Something went wrong" });
          }
      }
      if( Array.isArray(result)&&result_has_task_list){
        let return_result = Array.from(result);
        result.forEach( async (res, key) => {
            if(typeof res['content'] === 'object' && Array.isArray(res['content']?.task_list)){
                let parent_task = new Tasks({
                    user: user._id,
                    name: res['content'].project_name,
                    short_description: res['content'].project_description,
                    description: res['content'].standard_operating_procedures,
                    status: 'To Do',
                    estimated_earning: res['content'].project_total_estimated_earning,
                    cost: {
                        estimated: res['content'].project_total_estimated_cost,
                    },
                    time: {
                        estimated:[
                        {
                            user: user._id,
                            value: res['content'].project_total_estimated_time,
                        }
                    ]
                    },
                    terms_conditions: await res['content'].project_terms_conditions.map( async (term) => {
                        return {
                            template_name: term,
                            isCustom: false,
                        }
                    }),
                });
                // await parent_task.save();
                res['content'].task_list.forEach( async (element, element_key) => {
                    let new_task = new Tasks({
                        user: user._id,
                        name: element.sub_task,
                        short_description: element.description,
                        description: element.standard_operating_procedures,
                        status: 'To Do',
                        cost: {
                            estimated: element.estimated_cost,
                        },
                        time: {
                            estimated: [{
                                user: user._id,
                                value: element.estimated_time,
                            }]},
                        parentTasks: [
                            parent_task._id,
                        ],
                        terms_conditions: await element.task_terms_conditions.map(async (term) => {
                            return {
                                template_name: term,
                                isCustom: false,
                            }
                        }),
                        
                    });
                    // console.log(element);
                    // await new_task.save();
                    // new_task = await Tasks.findOneAndUpdate(
                    //         {
                    //         _id: new_task._id
                    //     },
                    //     {
                    //         $set: {'parentTasks': [parent_task._id]}
                    //     },
                    //     {
                    //         new: true
                    //     }
                    // );
                    // console.log(element);
                    // parent_task = await Tasks.findOneAndUpdate(
                    //     {_id: parent_task._id}, 
                    //     {$set: {'subTasks': [...parent_task.subTasks,new_task._id]}}, 
                    //     {new: true});
                    // console.log(parent_task);
                    if(typeof return_result[key]['content'] === 'string'){
                      return_result[key]['content'] = JSON.stringify(res['content']);
                      return_result[key]['content']['id'] = parent_task._id;
                    }
                    return_result[key]['content']['task_list'][element_key]['id'] = new_task._id;
                });
                        // console.log(parent_task);
                    }
                });
        // new_session.chat_history = result.map((res) => {
        //     if (typeof res['content'] === 'object') {
        //         return {
        //             content: res.content.standard_operating_procedures,
        //             role: res.role,
        //         }
        //     } else {
        //         return {
        //             content: res.content,
        //             role: res.role,
        //         }
        //     }
        // });
        // await new_session.save();
        return res.json({session: new_session, result: return_result});
      }
      if (!new_session) {
        return res.status(400).json({ msg: "Session not found" });
      }
      new_session.user = user;
      res.json(new_session);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: err.message });
    }
  }
);

router.post(
  "/completions",
  ipAuth,
  auth,
  [
    body("model", "Model is required").not().isEmpty(),
    body("messages", "Prompt is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const { model, messages } = req.body;
      const payload = {
        model: model,
        messages: messages,
      };
      const result = await axios.post("https://api.openai.com/v1/chat/completions", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      })
      if(result?.data?.choices[0]?.message?.content){
        return res.json({ result: result.data.choices[0].message.content });
      } else {
        return res.status(500).json({ result: "Something went wrong" });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: err.message });
    }
  }
);

router.post(
  "/images",
  ipAuth,
  auth,
  [
    body("params", "Model is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const { params, key } = req.body;
      const result = await axios.post("https://api.openai.com/v1/images/generations", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      })
      // save the results on s3
      let images = result.data;
      if(images?.data.length>0){
        await images.data.map(({revised_prompt, url}, index) => {
          axios.get(url, {responseType: 'arraybuffer'}).then(image => {
            const s3_params = {
              Bucket: 'kalkinso.com',
              Key: key.split('.').slice(0,-1).join('/')+`/${index}.jpeg`,
              Body: image.data,
              ContentType: 'image/jpeg',
            };
            s3.upload(s3_params).promise().then((data) => {
              console.log(`Successfully uploaded ${key.split('.').slice(0,-1).join('/')+`/${index}.jpeg`}`);
              const client = new S3Client({region:'ap-south-1'});
              const get_command = new GetObjectCommand({
                Bucket: 'kalkinso.com',
                Key: key.split('.').slice(0,-1).join('/')+`/${index}.jpeg`,
              });
              getSignedUrl(client, get_command, { expiresIn: params.Expires }).then((url) => {
              res.json({ result: {...images.data, signedUrl: url} })
              }).catch((err) => {});

            }).catch((err) => {});
          });
        });
        // return res.json({ result: images.data });
      } else {
        return res.status(500).json({ result: "Something went wrong" });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: err.message });
    }
  },
)

router.post('/audio_video', ipAuth, auth, [
  body("params", "Model is required").not().isEmpty(),
],async (req, res) => {
  try {
    const { params } = req.body;
    const JobParams = {
      JobName: 'video_generator',
      Arguments: {
        '--VIDEO_PROMPT': params.prompt,
      }
    };
    const response = await glue.startJobRun(JobParams).promise();
    if(response.JobRunId){
      pusher.trigger('kalkinso-bucaudio', 'job-started', {
        message: `Glue job video_generator started`,
        jobRunId: response.JobRunId
      });
      return res.json({ result: response.JobRunId });
    } else {
      return res.status(500).json({ result: "Something went wrong" });
    }
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ msg: err?.message });
  }
});

router.post('/audio_video/state', ipAuth, auth, async (req, res) => {
  try {
    const { jobId, signedUrl } = req.body;
    if(signedUrl){
      pusher.trigger('kalkinso-bucaudio', 'job-completed', {
        message: `Glue job video_generator completed`,
        jobRunId: jobId,
        signedUrl: signedUrl,
      });
      return res.json({ result: signedUrl });
    } else {
      return res.status(500).json({ result: "Something went wrong" });
    }
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ msg: err?.message });
  }
});

module.exports = router;
