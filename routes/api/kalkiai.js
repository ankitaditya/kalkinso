require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const invoke = require("../../models/LambdaInput");
const User = require("../../models/User");
const ChatSession = require("../../models/ChatSession");
const Tasks = require("../../models/Tasks");
const ipAuth = require("../../middleware/ipAuth");

const router = express.Router();

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
      console.log("This is my payload: ", payload);
      let result = await invoke("kalki-AIStack", payload);
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

module.exports = router;
