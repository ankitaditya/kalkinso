const express = require('express')
const { body, validationResult } = require('express-validator')

const auth = require('../../middleware/auth')
const axios = require('axios')
const Task = require('../../models/Tasks')
const News = require('../../models/News')
const User = require('../../models/User')
const AWS = require('aws-sdk')
const ipAuth = require('../../middleware/ipAuth')

const s3 = new AWS.S3();

const router = express.Router()

router.post(
	'/',
	auth,
	ipAuth,
	[
		body('task', 'task is required').not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		// const regex = new RegExp(req.user.id, 'g')
		// await Kits.deleteMany({ id: { $regex: regex } });

		const { task, task_id, Prefix } = req.body

		try {
			/* Write the code to create task record in mongo db server */
			let temp_task = Object.assign({},task)
			let temp_task2 = Object.assign({},task)
			temp_task.user = req.user.id
			temp_task2.user = req.user.id
			temp_task2.attachments = []
			temp_task2.subTasks = []
			console.log(temp_task)
			const task_mod = new Task(temp_task2)
			task_mod.attachments = await temp_task.attachments.map((file)=>{
				const params = {
					Bucket: file.Bucket,
					CopySource: `${file.Bucket}/${file.Key}`,
					Key: `users/${req.user.id}/tasks/${task_mod._id}/attachments/${file.Key.split('/').pop()}`,
				}
				if(Prefix){
					params.Key = `users/${req.user.id}/tasks/${Prefix}/${task_mod._id}/attachments/${file.Key.split('/').pop()}`
				}
				s3.copyObject(params).promise().then((data) => {
					console.log(`Successfully copied data to ${params.Bucket}/${params.Key}: ${data}`);
					s3.deleteObject({Bucket: params.Bucket, Key: file.Key}).promise().then((data) => {
						console.log(`Successfully deleted data from ${params.Bucket}/${file.Key}: ${data}`);
					}).catch((err) => {
						console.log(err, err.stack);
					});
				}).catch((err) => {
					console.log(err, err.stack);
				});
				return {type: params.Key.split('.').pop(), url: params.Key}
			})
			let tempSubTasks = await temp_task.subTasks.map((task_obj)=>{
				task_obj.parentTasks = [task_mod._id]
				task_obj.user = req.user.id
				const subTask = new Task(task_obj)
				subTask.base_path = Prefix?`users/${req.user.id}/tasks/${Prefix}/${task_mod._id}/${subTask._id}/`:`users/${req.user.id}/tasks/${task_mod._id}/${subTask._id}/`
				let params = {
					Bucket: "kalkinso.com",
					Key: `${subTask.base_path}index.txt`,
					Body: JSON.stringify([
						{
							type: "heading",
							content: subTask.name,
							props: {
								level: 3
							}
						},
						{
							type: "paragraph",
							content: subTask.description,
							props: {
								align: "justify"
							}
						},
					]),
				}
				s3.putObject(params).promise().then((data) => {
					console.log(`Successfully copied data to ${params.Bucket}/${params.Key}: ${data}`);
				}).catch((err) => {
					console.log(err, err.stack);
				});
				subTask.save()
				return subTask._id
			})
			task_mod.subTasks = [...task_mod.subTasks,...tempSubTasks]
			task_mod.base_path = Prefix?`users/${req.user.id}/tasks/${Prefix}/${task_mod._id}/`:`users/${req.user.id}/tasks/${task_mod._id}/`
			let params = {
				Bucket: "kalkinso.com",
				Key: `${task_mod.base_path}index.txt`,
				Body: JSON.stringify([
					{
						type: "heading",
						content: task_mod.name,
						props: {
							level: 3
						}
					},
					{
						type: "paragraph",
						content: task_mod.description,
						props: {
							align: "justify"
						}
					},
				]),
			}
			try {
				await s3.putObject(params).promise()
			} catch (err) {
				console.log(err, err.stack)
			}
			
			await task_mod.save()
			if(task_id){
				await Task.findOneAndUpdate(
					{_id: task_id},
					{ $push: {subTasks: task_mod._id} },
					{ new: true }
				)
			}
			task_mod.user = await User.findById(task_mod.user).select(['first_name', 'last_name', 'email', 'mobile', 'upi', 'adhar', 'avatar'])
			let result = JSON.parse(JSON.stringify(task_mod))
			result.id = task.id
			result.subTasks = await result.subTasks.map((task, key)=>{
				return {id: temp_task.subTasks[key].id, key: task}
			})
			res.json(result)
		} catch (err) {
			console.error(err.message)
			res.status(500).json({ msg: err.message })
		}
	}
)

router.get(
    '/mudda',
    ipAuth,
    async (req, res) => {
        const query = req.query.q;
        const address = req.query.address;
        const pincode = req.query.pincode;
        if (!query || !address || !pincode) {
            return res.status(400).json({ error: "Query parameter 'q'&'address'&'pincode' are required." });
          }
        const checkpincode = await News.findOne({ pincode: pincode });
        if (checkpincode) {
            const news = await News.aggregate([
                {
                    $search: {
                      index: "default",
                      text: {
                        query: query + ' ' + address + ' ' + pincode,
                        path: {
                          wildcard: "*"
                        }
                      }
                    }
                  }
            ]);
            if (news?.length > 0) {
                return res.json(news);
            }
        }

        const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_API_CX}&q=${encodeURIComponent(query + ' ' + address + ' ' + pincode)}`;
        
        axios.get(apiUrl, { headers: { 'Accept': 'application/json' } })
            .then((response) => {
                const newsData = response?.data?.items?.map((item) => {
                    return {
                        pincode: pincode,
                        address: address,
                        news: {
                            title: item.title,
                            content: item.snippet,
                            image: item.pagemap?.cse_image?.map((image) => image.src),
                            link: item.link,
                        },
                        priority: "0",
                    };
                })
                if(!newsData||newsData.length === 0){
                    return res.status(404).json({ error: "No news found" });
                }
                News.insertMany(newsData).then((news) => {
                    res.json(news);
                }).catch((error) => {
                    res.json(response?.data?.items);
                    console.log(error);
                });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    }
)


module.exports = router
