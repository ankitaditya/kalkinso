const express = require('express')
const { body, validationResult } = require('express-validator')

const auth = require('../../middleware/auth')
const Task = require('../../models/Tasks')
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

router.post('/subtasks', ipAuth, auth, async (req, res) => {
	try {
		/* Write the code to get all tasks */
		const { task_id } = req.body;
		let mainTask = await Task.findOne({ _id: task_id, user: req.user.id })
		if (!mainTask||mainTask?.length===0) {
			return res.status(401).json({ msg: 'User not authorized' })
		}
		if(mainTask.subTasks.length===0){
			return res.status(404).json({ msg: 'No subtasks found' })
		}
		let tasks = await Task.find({ _id: {$in: mainTask.subTasks} })
		if (!tasks||tasks?.length===0) {
			return res.status(404).json({ msg: 'No subtasks found' })
		}
		for (let i = 0; i < tasks.length; i++) {
			tasks[i].user = await User.findById(tasks[i].user).select(['first_name', 'last_name', 'email', 'mobile', 'upi', 'adhar', 'avatar'])
		}
		res.json(tasks)
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ msg: 'Server error' })
	}
})

router.get('/search/:search', ipAuth, async (req, res) => {
	try {
		/* Write the code to get all tasks */
		let tasks = await Task.aggregate([
			{
				$search: {
				  index: "default",
				  text: {
					query: req.params.search,
					path: {
					  wildcard: "*"
					}
				  }
				}
			  }
		]);
		if (!tasks||tasks?.length===0) {
			return res.status(404).json({ msg: `No tasks found! For ${req.params.search}` })
		}
		// if (tasks.user.toString() !== req.params.id) {
		// 	return res.status(401).json({ msg: 'User not authorized' })
		// }
		if(Array.isArray(tasks)){
			for (let i = 0; i < tasks.length; i++) {
				tasks[i].user = await User.findById(tasks[i].user).select(['first_name', 'last_name', 'email', 'mobile', 'upi', 'adhar', 'avatar'])
			}
			console.log(tasks)
			return res.json(tasks)
		} else {
			let user_data = await User.findById(tasks.user)
			tasks.user = {
				user_id: user_data._id,
				first_name: user_data.first_name,
				last_name: user_data.last_name,
				email: user_data.email,
				mobile: user_data.mobile,
				upi: user_data.upi,
				adhar: user_data.adhar,
				avatar: user_data.avatar,
			}
			return res.json(tasks)
		}
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ msg: 'Server error' })
	}
})

router.put('/:id', ipAuth, auth, async (req, res) => {
	const { taskFields } = req.body

	try {
		/* Write the code to update task */
		let task = await Task.findById(req.params.id)
		if (!taskFields) {
			return res.status(404).json({ msg: 'Task not found' })
		}
		if (task.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' })
		}
		taskFields.attachments = await taskFields.attachments.map((file)=>{
			if(!file.Key){
				return file
			}
			const params = {
				Bucket: file.Bucket,
				CopySource: `${file.Bucket}/${file.Key}`,
				Key: task?.base_path?`${task.base_path}attachments/${file.Key.split('/').pop()}`:`users/${req.user.id}/tasks/${req.params.id}/attachments/${file.Key.split('/').pop()}`,
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
		task = await Task.findOneAndUpdate(
			{_id: req.params.id},
			{ $set: taskFields },
			{ new: true }
		)
		return res.json(task)
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ msg: 'Server error' })
	}
})

router.get('/', ipAuth, auth, async (req, res) => {
	try {
		/* Write the code to get all tasks */
		const tasks = await Task.find({ user: req.user.id })
		const user = await User.findById(req.user.id)
		if (!tasks||tasks?.length===0) {
			return res.status(404).json({ msg: `No tasks found, create tasks to get started!` })
		}
		if(user){
			for (let i = 0; i < tasks.length; i++) {
				tasks[i].user = user
				if(tasks[i].assigned.length>0){
					console.log("Users: ",tasks[i].assigned.map(each=>each.user))
					tasks[i].assigned = await User.find({ _id: {$in: tasks[i].assigned.map(each=>each.user)} }).select(['_id','first_name', 'last_name','avatar'])
					console.log("Users: ",tasks[i].assigned.map(each=>each))
				}
			}
		}
		res.json(tasks)
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ msg: 'Server error' })
	}
})

router.get('/parent', ipAuth, auth, async (req, res) => {
	try {
		/* Write the code to get all tasks */
		const tasks = await Task.find({ user: req.user.id, parentTasks: [] })
		const user = await User.findById(req.user.id)
		if (!tasks||tasks?.length===0) {
			return res.status(404).json({ msg: `No tasks found, create tasks to get started!` })
		}
		if(user){
			for (let i = 0; i < tasks.length; i++) {
				tasks[i].user = user
				if(tasks[i].assigned.length>0){
					console.log("Users: ",tasks[i].assigned.map(each=>each.user))
					tasks[i].assigned = await User.find({ _id: {$in: tasks[i].assigned.map(each=>each.user)} }).select(['_id','first_name', 'last_name','avatar'])
					console.log("Users: ",tasks[i].assigned.map(each=>each))
				}
			}
		}
		res.json(tasks)
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ msg: 'Server error' })
	}
})

const deleteTasks = async (req, res) => {
	const task = await Task.findById(req.params.id)
		if (!task) {
			return { msg: 'Task not found' }
		}
		if (task.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' })
		}
		const params = {
			Bucket: "kalkinso.com",
			Prefix: task.base_path,
		}
		const data = await s3.listObjectsV2(params).promise();
		const objects = data.Contents.map(({ Key }) => ({ Key }));
		if(objects.length>0){
			const deleteParams = {
			Bucket: "kalkinso.com",
			Delete: {
				Objects: objects,
				Quiet: false,
			},
			};
			await s3.deleteObjects(deleteParams).promise();
		}
		if(task.parentTasks.length>0){
		task.parentTasks.forEach(async (task_id)=>{
			await Task.findOneAndUpdate(
				{_id: task_id},
				{ $pull: {subTasks: task._id} },
				{ new: true }
			)
		})}
		if(task.subTasks.length>0){
			task.subTasks.forEach(async (task_id)=>{
				await deleteTasks({params: {id: task_id}, user: {id: req.user.id}})
			})
		}
		await task.deleteOne()
}

router.delete('/:id', ipAuth, auth, async (req, res) => {
	try {
		/* Write the code to delete task */
		const response = await deleteTasks(req, res)
		if(response){
			return res.status(404).json(response)
		}
		res.json({ msg: 'Task removed' })
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ msg: 'Server error' })
	}
})




module.exports = router
