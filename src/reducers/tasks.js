import * as actionTypes from '../actions/types'

const intialState =  {
	openTask: false,
	isMulti: true,
	selectedMultiTask: "",
	tasks: [
		{
		  "user": {
			"first_name": "Aarav",
			"last_name": "Sharma",
			"email": "aarav.sharma@example.com",
			"mobile": "9876543210",
			"upi": "AARAVXYZ",
			"adhar": 123456789012,
			"terms_conditions": "abcd1234efgh5678ijklmnopqrstuvwx",
			"password": "password123",
			"avatar": "https://www.gravatar.com/avatar/anything?s=200&d=mm",
			"date": "2021-06-15T18:30:30.796Z"
		  },
		  "name": "Community Cleanup Event",
		  "description": "Organize and execute a community cleanup event in the local park, engaging volunteers and ensuring the area is thoroughly cleaned.",
		  "assigned": [
			{
			  "user": "646cbcb0f29d303de1b5df7d",
			  "status": "Pending",
			  "date": "2023-03-11T18:21:23.538Z",
			  "isVolunteer": true,
			  "rating": 1
			},
			{
			  "user": "646cbcb0f29d303de1b5df7e",
			  "status": "In Progress",
			  "date": "2023-08-01T08:33:10.579Z",
			  "isVolunteer": false,
			  "rating": 2
			}
		  ],
		  "time": {
			"estimated": [
			  {
				"user": "646cbcb0f29d303de1b5df7f",
				"value": 4
			  },
			  {
				"user": "646cbcb0f29d303de1b5df80",
				"value": 2
			  }
			],
			"actual": {
			  "user": "646cbcb0f29d303de1b5df81",
			  "value": 6
			}
		  },
		  "cost": {
			"estimated": 384,
			"actual": 416
		  },
		  "org": "Green Earth Org",
		  "location": "Central Park",
		  "status": "In Progress",
		  "skills": [
			"organization",
			"leadership",
			"teamwork"
		  ],
		  "analytics": {
			"views": [
			  {
				"date": "2023-11-13T21:37:31.555Z",
				"user": "646cbcb0f29d303de1b5df82"
			  },
			  {
				"date": "2023-01-22T11:30:45.576Z",
				"user": "646cbcb0f29d303de1b5df83"
			  }
			],
			"commenters": [
			  {
				"user": "646cbcb0f29d303de1b5df84",
				"text": "Looking forward to this event!",
				"date": "2023-12-25T10:42:23.486Z",
				"reaction": 5,
				"attachments": [
				  {
					"type": "image",
					"url": "http://example.com/comment1.jpg"
				  },
				  {
					"type": "document",
					"url": "http://example.com/comment2.pdf"
				  }
				],
				"reply": [
				  {
					"user": "646cbcb0f29d303de1b5df85",
					"text": "Great to hear! We appreciate your support.",
					"date": "2023-07-16T15:07:19.539Z",
					"reaction": 3,
					"attachments": [
					  {
						"type": "image",
						"url": "http://example.com/reply1.jpg"
					  },
					  {
						"type": "document",
						"url": "http://example.com/reply2.pdf"
					  }
					]
				  }
				]
			  }
			],
			"reactions": {
			  "user": "646cbcb0f29d303de1b5df86",
			  "reaction": 4
			}
		  },
		  "priority": "Low",
		  "subTasks": [
			"646cbcb0f29d303de1b5df87",
			"646cbcb0f29d303de1b5df88"
		  ],
		  "parentTasks": [
			"646cbcb0f29d303de1b5df89"
		  ],
		  "attachments": [
		  ],
		  "tags": [
			"cleanup",
			"community",
			"environment"
		  ],
		  "createdAt": "2023-08-11T19:02:19.529Z",
		  "updatedAt": "2023-10-21T02:32:14.518Z"
		},
		{
		  "user": {
			"first_name": "Vivaan",
			"last_name": "Verma",
			"email": "vivaan.verma@example.com",
			"mobile": "8765432109",
			"upi": "VIVAANXYZ",
			"adhar": 234567890123,
			"terms_conditions": "mnopqrstuvwx1234abcd5678efghijkl",
			"password": "password456",
			"avatar": "https://www.gravatar.com/avatar/anything?s=200&d=mm",
			"date": "2020-05-10T18:30:30.796Z"
		  },
		  "name": "Fundraising Campaign",
		  "description": "Plan and execute a fundraising campaign to support local shelters, aiming to raise awareness and funds through various activities.",
		  "assigned": [
			{
			  "user": "646cbcb0f29d303de1b5df8b",
			  "status": "Completed",
			  "date": "2023-03-20T10:13:14.571Z",
			  "isVolunteer": false,
			  "rating": 4
			}
		  ],
		  "time": {
			"estimated": [
			  {
				"user": "646cbcb0f29d303de1b5df8c",
				"value": 3
			  }
			],
			"actual": {
			  "user": "646cbcb0f29d303de1b5df8d",
			  "value": 2
			}
		  },
		  "cost": {
			"estimated": 940,
			"actual": 482
		  },
		  "org": "Help the Homeless",
		  "location": "Downtown Center",
		  "status": "Completed",
		  "skills": [
			"fundraising",
			"communication"
		  ],
		  "analytics": {
			"views": [
			  {
				"date": "2023-10-10T00:21:52.542Z",
				"user": "646cbcb0f29d303de1b5df8e"
			  },
			  {
				"date": "2023-11-28T00:06:59.517Z",
				"user": "646cbcb0f29d303de1b5df8f"
			  },
			  {
				"date": "2023-08-24T15:49:28.588Z",
				"user": "646cbcb0f29d303de1b5df90"
			  },
			  {
				"date": "2023-06-12T22:26:47.504Z",
				"user": "646cbcb0f29d303de1b5df91"
			  }
			],
			"commenters": [
			  {
				"user": "646cbcb0f29d303de1b5df92",
				"text": "Amazing initiative!",
				"date": "2023-02-25T01:04:52.510Z",
				"reaction": 1,
				"attachments": [
				  {
					"type": "image",
					"url": "http://example.com/comment3.jpg"
				  }
				],
				"reply": [
				  {
					"user": "646cbcb0f29d303de1b5df93",
					"text": "Thank you for your support!",
					"date": "2023-01-29T21:52:56.525Z",
					"reaction": 4,
					"attachments": [
					  {
						"type": "image",
						"url": "http://example.com/reply3.jpg"
					  }
					]
				  }
				]
			  }
			],
			"reactions": {
			  "user": "646cbcb0f29d303de1b5df94",
			  "reaction": 2
			}
		  },
		  "priority": "Low",
		  "subTasks": [
			"646cbcb0f29d303de1b5df95",
			"646cbcb0f29d303de1b5df96"
		  ],
		  "parentTasks": [
			"646cbcb0f29d303de1b5df97"
		  ],
		  "attachments": [
		],
		  "tags": [
			"fundraising",
			"charity",
			"awareness"
		  ],
		  "createdAt": "2023-12-12T22:40:51.515Z",
		  "updatedAt": "2023-05-06T03:05:27.518Z"
		},
		{
		  "user": {
			"first_name": "Vihaan",
			"last_name": "Mehta",
			"email": "vihaan.mehta@example.com",
			"mobile": "6543210987",
			"upi": "VIHAANXYZ",
			"adhar": 456789012345,
			"terms_conditions": "5678efghijklmnopqrstuvwx1234abcd",
			"password": "password012",
			"avatar": "https://www.gravatar.com/avatar/anything?s=200&d=mm",
			"date": "2022-03-20T18:30:30.796Z"
		  },
		  "name": "Tech Workshop Series",
		  "description": "Conduct a series of technical workshops for the community, covering various topics like programming, web development, and data science.",
		  "assigned": [
			{
			  "user": "646cbcb0f29d303de1b5df99",
			  "status": "Completed",
			  "date": "2023-11-26T05:56:12.505Z",
			  "isVolunteer": false,
			  "rating": 3
			},
			{
			  "user": "646cbcb0f29d303de1b5df9a",
			  "status": "Pending",
			  "date": "2023-04-22T03:08:28.548Z",
			  "isVolunteer": true,
			  "rating": 4
			},
			{
			  "user": "646cbcb0f29d303de1b5df9b",
			  "status": "In Progress",
			  "date": "2023-08-20T17:33:53.540Z",
			  "isVolunteer": true,
			  "rating": 5
			}
		  ],
		  "time": {
			"estimated": [
			  {
				"user": "646cbcb0f29d303de1b5df9c",
				"value": 6
			  }
			],
			"actual": {
			  "user": "646cbcb0f29d303de1b5df9d",
			  "value": 7
			}
		  },
		  "cost": {
			"estimated": 206,
			"actual": 953
		  },
		  "org": "Tech Savvy",
		  "location": "Innovation Hub",
		  "status": "In Progress",
		  "skills": [
			"teaching",
			"programming"
		  ],
		  "analytics": {
			"views": [
			  {
				"date": "2023-04-10T18:06:00.542Z",
				"user": "646cbcb0f29d303de1b5df9e"
			  }
			],
			"commenters": [
			  {
				"user": "646cbcb0f29d303de1b5df9f",
				"text": "This workshop was very informative.",
				"date": "2023-06-01T11:00:28.558Z",
				"reaction": 4,
				"attachments": [
				  {
					"type": "document",
					"url": "http://example.com/comment6.pdf"
				  },
				  {
					"type": "image",
					"url": "http://example.com/comment7.jpg"
				  }
				],
				"reply": [
				  {
					"user": "646cbcb0f29d303de1b5dfa0",
					"text": "Glad to hear you enjoyed it!",
					"date": "2023-06-25T22:06:38.510Z",
					"reaction": 4,
					"attachments": [
					  {
						"type": "image",
						"url": "http://example.com/reply4.jpg"
					  },
					  {
						"type": "document",
						"url": "http://example.com/reply5.pdf"
					  }
					]
				  }
				]
			  }
			],
			"reactions": {
			  "user": "646cbcb0f29d303de1b5dfa1",
			  "reaction": 3
			}
		  },
		  "priority": "High",
		  "subTasks": [
			"646cbcb0f29d303de1b5dfa2",
			"646cbcb0f29d303de1b5dfa3"
		  ],
		  "parentTasks": [
			"646cbcb0f29d303de1b5dfa4",
			"646cbcb0f29d303de1b5dfa5"
		  ],
		  "attachments": [
		],
		  "tags": [
			"workshop",
			"technology",
			"education"
		  ],
		  "createdAt": "2023-07-10T13:20:35.549Z",
		  "updatedAt": "2023-01-24T18:59:06.523Z"
		},
		{
			"user": {
			  "first_name": "Priya",
			  "last_name": "Kumar",
			  "email": "priya.kumar@example.com",
			  "mobile": "9876503210",
			  "upi": "PRIYAKUMAR",
			  "adhar": 987654321012,
			  "terms_conditions": "ijkl1234mnop5678qrstuvwxabcd",
			  "password": "securePassword321",
			  "avatar": "https://www.gravatar.com/avatar/something?s=200&d=mm",
			  "date": "2021-07-20T14:25:30.796Z"
			},
			"name": "Beach Cleanup Drive",
			"description": "A volunteer event to clean the local beach area and raise awareness about marine pollution.",
			"assigned": [
			  {
				"user": "746cbcb0f29d303de1b5df7d",
				"status": "Completed",
				"date": "2023-04-11T10:21:23.538Z",
				"isVolunteer": true,
				"rating": 4
			  },
			  {
				"user": "746cbcb0f29d303de1b5df7e",
				"status": "In Progress",
				"date": "2023-09-01T09:33:10.579Z",
				"isVolunteer": false,
				"rating": 3
			  }
			],
			"time": {
			  "estimated": [
				{
				  "user": "746cbcb0f29d303de1b5df7f",
				  "value": 3
				},
				{
				  "user": "746cbcb0f29d303de1b5df80",
				  "value": 5
				}
			  ],
			  "actual": {
				"user": "746cbcb0f29d303de1b5df81",
				"value": 4
			  }
			},
			"cost": {
			  "estimated": 200,
			  "actual": 250
			},
			"org": "Ocean Blue Initiative",
			"location": "Marina Beach",
			"status": "In Progress",
			"skills": [
			  "cleaning",
			  "awareness",
			  "community service"
			],
			"analytics": {
			  "views": [
				{
				  "date": "2023-12-13T21:37:31.555Z",
				  "user": "746cbcb0f29d303de1b5df82"
				},
				{
				  "date": "2023-02-22T11:30:45.576Z",
				  "user": "746cbcb0f29d303de1b5df83"
				}
			  ],
			  "commenters": [
				{
				  "user": "746cbcb0f29d303de1b5df84",
				  "text": "Can't wait to make a difference!",
				  "date": "2023-11-25T10:42:23.486Z",
				  "reaction": 5,
				  "attachments": [
					{
					  "type": "image",
					  "url": "http://example.com/comment3.jpg"
					},
					{
					  "type": "document",
					  "url": "http://example.com/comment4.pdf"
					}
				  ],
				  "reply": [
					{
					  "user": "746cbcb0f29d303de1b5df85",
					  "text": "Your enthusiasm is inspiring! See you there.",
					  "date": "2023-06-16T15:07:19.539Z",
					  "reaction": 4,
					  "attachments": [
						{
						  "type": "image",
						  "url": "http://example.com/reply3.jpg"
						},
						{
						  "type": "document",
						  "url": "http://example.com/reply4.pdf"
						}
					  ]
					}
				  ]
				}
			  ],
			  "reactions": {
				"user": "746cbcb0f29d303de1b5df86",
				"reaction": 3
			  }
			},
			"priority": "Medium",
			"subTasks": [
			  "746cbcb0f29d303de1b5df87",
			  "746cbcb0f29d303de1b5df88"
			],
			"parentTasks": [
			  "746cbcb0f29d303de1b5df89"
			],
			"attachments": [
			],
			"tags": [
			  "beach",
			  "cleanup",
			  "volunteer"
			],
			"createdAt": "2023-09-11T19:02:19.529Z",
			"updatedAt": "2023-11-21T02:32:14.518Z"
		},
		{
			"user": {
			  "first_name": "Meera",
			  "last_name": "Patel",
			  "email": "meera.patel@example.com",
			  "mobile": "9876501234",
			  "upi": "MEERAPATEL@UPI",
			  "adhar": 234567890123,
			  "terms_conditions": "mnop1234qrst5678uvwxabcdijkl",
			  "password": "safePassword456",
			  "avatar": "https://www.gravatar.com/avatar/anythingelse?s=200&d=mm",
			  "date": "2021-08-20T14:25:30.796Z"
			},
			"name": "Tree Plantation Drive",
			"description": "A community initiative to plant trees in the neighborhood park to enhance green cover.",
			"assigned": [
			  {
				"user": "756cbcb0f29d303de1b5df7d",
				"status": "Completed",
				"date": "2023-04-15T10:21:23.538Z",
				"isVolunteer": true,
				"rating": 5
			  },
			  {
				"user": "756cbcb0f29d303de1b5df7e",
				"status": "In Progress",
				"date": "2023-09-05T09:33:10.579Z",
				"isVolunteer": false,
				"rating": 4
			  }
			],
			"time": {
			  "estimated": [
				{
				  "user": "756cbcb0f29d303de1b5df7f",
				  "value": 2
				},
				{
				  "user": "756cbcb0f29d303de1b5df80",
				  "value": 3
				}
			  ],
			  "actual": {
				"user": "756cbcb0f29d303de1b5df81",
				"value": 5
			  }
			},
			"cost": {
			  "estimated": 150,
			  "actual": 180
			},
			"org": "Nature's Friends",
			"location": "Neighborhood Park",
			"status": "In Progress",
			"skills": [
			  "gardening",
			  "teamwork",
			  "environmental awareness"
			],
			"analytics": {
			  "views": [
				{
				  "date": "2023-12-15T21:37:31.555Z",
				  "user": "756cbcb0f29d303de1b5df82"
				},
				{
				  "date": "2023-02-25T11:30:45.576Z",
				  "user": "756cbcb0f29d303de1b5df83"
				}
			  ],
			  "commenters": [
				{
				  "user": "756cbcb0f29d303de1b5df84",
				  "text": "Excited to contribute to our planet!",
				  "date": "2023-11-28T10:42:23.486Z",
				  "reaction": 5,
				  "attachments": [
					{
					  "type": "image",
					  "url": "http://example.com/comment5.jpg"
					},
					{
					  "type": "document",
					  "url": "http://example.com/comment6.pdf"
					}
				  ],
				  "reply": [
					{
					  "user": "756cbcb0f29d303de1b5df85",
					  "text": "Thank you for your enthusiasm!",
					  "date": "2023-06-19T15:07:19.539Z",
					  "reaction": 4,
					  "attachments": [
						{
						  "type": "image",
						  "url": "http://example.com/reply5.jpg"
						},
						{
						  "type": "document",
						  "url": "http://example.com/reply6.pdf"
						}
					  ]
					}
				  ]
				}
			  ],
			  "reactions": {
				"user": "756cbcb0f29d303de1b5df86",
				"reaction": 4
			  }
			},
			"priority": "High",
			"subTasks": [
			  "756cbcb0f29d303de1b5df87",
			  "756cbcb0f29d303de1b5df88"
			],
			"parentTasks": [
			  "756cbcb0f29d303de1b5df89"
			],
			"attachments": [
			],
			"tags": [
			  "tree plantation",
			  "green cover",
			  "community"
			],
			"createdAt": "2023-09-15T19:02:19.529Z",
			"updatedAt": "2023-11-25T02:32:14.518Z"
		},
		{
		"user": {
			"first_name": "Rohan",
			"last_name": "Gupta",
			"email": "rohan.gupta@example.com",
			"mobile": "9876541230",
			"upi": "ROHANGUPTA@UPI",
			"adhar": 345678901234,
			"terms_conditions": "qrst1234uvwx5678abcdijklmnop",
			"password": "mySecurePassword789",
			"avatar": "https://www.gravatar.com/avatar/somethingnew?s=200&d=mm",
			"date": "2021-09-25T17:45:30.796Z"
		},
		"name": "Local Library Book Donation",
		"description": "Collect and donate books to the local library to enrich community resources and promote reading.",
		"assigned": [
			{
			"user": "866cbcb0f29d303de1b5df7d",
			"status": "Pending",
			"date": "2023-05-10T12:21:23.538Z",
			"isVolunteer": true,
			"rating": 3
			},
			{
			"user": "866cbcb0f29d303de1b5df7e",
			"status": "Completed",
			"date": "2023-10-02T10:33:10.579Z",
			"isVolunteer": false,
			"rating": 5
			}
		],
		"time": {
			"estimated": [
			{
				"user": "866cbcb0f29d303de1b5df7f",
				"value": 1
			},
			{
				"user": "866cbcb0f29d303de1b5df80",
				"value": 2
			}
			],
			"actual": {
			"user": "866cbcb0f29d303de1b5df81",
			"value": 3
			}
		},
		"cost": {
			"estimated": 100,
			"actual": 120
		},
		"org": "Books for All",
		"location": "City Library",
		"status": "Completed",
		"skills": [
			"organization",
			"communication",
			"literacy advocacy"
		],
		"analytics": {
			"views": [
			{
				"date": "2023-12-20T21:37:31.555Z",
				"user": "866cbcb0f29d303de1b5df82"
			},
			{
				"date": "2023-03-22T11:30:45.576Z",
				"user": "866cbcb0f29d303de1b5df83"
			}
			],
			"commenters": [
			{
				"user": "866cbcb0f29d303de1b5df84",
				"text": "A wonderful initiative for our community!",
				"date": "2023-12-30T10:42:23.486Z",
				"reaction": 5,
				"attachments": [
				{
					"type": "image",
					"url": "http://example.com/comment7.jpg"
				},
				{
					"type": "document",
					"url": "http://example.com/comment8.pdf"
				}
				],
				"reply": [
				{
					"user": "866cbcb0f29d303de1b5df85",
					"text": "Thanks for your support! Every book counts.",
					"date": "2023-07-20T15:07:19.539Z",
					"reaction": 4,
					"attachments": [
					{
						"type": "image",
						"url": "http://example.com/reply7.jpg"
					},
					{
						"type": "document",
						"url": "http://example.com/reply8.pdf"
					}
					]
				}
				]
			}
			],
			"reactions": {
			"user": "866cbcb0f29d303de1b5df86",
			"reaction": 4
			}
		},
		"priority": "Medium",
		"subTasks": [
			"866cbcb0f29d303de1b5df87",
			"866cbcb0f29d303de1b5df88"
		],
		"parentTasks": [
			"866cbcb0f29d303de1b5df89"
		],
		"attachments": [
		],
		"tags": [
			"book donation",
			"library",
			"reading"
		],
		"createdAt": "2023-10-05T19:02:19.529Z",
		"updatedAt": "2023-11-30T02:32:14.518Z"
		},
	  ],
	selectedTask: -1,
	kanban: {
		task_heirarchy: {},
		task_files: {},
		tasks: [],
		file_context: null,
	} 
  };

export default function taskReducer(state = intialState, action) {
	switch (action.type) {
		case actionTypes.OPEN_TASK:
			return {
				...state,
				openTask: action.payload,
				selectedMultiTask: `${action.payload}`,
			}
		case actionTypes.IS_MULTI:
			return {
				...state,
				isMulti: action.payload,
			}
		case actionTypes.SET_TASKS:
			return {
				...state,
				tasks: action.payload,
			}
		case actionTypes.GET_TASKS:
			let task_heirarchy = {}
			action.payload.forEach(task => {
				task_heirarchy[task._id] = task.subTasks
			})
			return {
				...state,
				kanban: {
					...state.kanban,
					tasks:action.payload,
					task_heirarchy: {...state.kanban.task_heirarchy,...task_heirarchy}
				},
			}
		case actionTypes.START_TASK:
			return {
				...state,
				kanban: {
					...state.kanban,
					task_files: {
						...state.kanban.task_files,
						[action.payload.task_id]: action.payload.files
					}
				},
			}
		case actionTypes.SET_TASKS_STATE:
			return {
				...state,
				kanban:{
					...state.kanban,
					tasks: action.payload
				}
			}
		case actionTypes.ADD_TASK:
			return {
				...state,
				kanban: {
					...state.kanban,
					tasks: [action.payload, ...state.kanban.tasks]
				}
			}
		case actionTypes.DELETE_TASK:
			return {
				...state,
				kanban: {
					...state.kanban,
					tasks: state.kanban.tasks.filter(task => task._id !== action.payload)
				}
			}
		case actionTypes.GET_TASK:
				return {
					...state,
					kanban: {
						...state.kanban,
						task_heirarchy: {...state.kanban.task_heirarchy, [action.payload.task_id]: action.payload.sub_tasks}
					},
				}
		case actionTypes.GET_SUB_TASKS:
			let tasks_obj = [
				...state.kanban.tasks,
				...action.payload
			]
			let parent_set = new Set(action.payload[0].parentTasks)
			action.payload.slice(1).forEach(task => {
				if(parent_set.intersection(new Set(task.parentTasks)).size){
					parent_set = parent_set.intersection(new Set(task.parentTasks))
				}
			})
			parent_set = Array.from(parent_set)
			let sub_task_set = new Set(action.payload.map(task=>task._id))
			tasks_obj = tasks_obj.map(task => {
				if (parent_set.includes(task._id)&& new Set(task.subTasks).intersection(sub_task_set).size===0) {
					task.subTasks = [...task.subTasks,...Array.from(sub_task_set)]
				}
				return task
			})
			return {
				...state,
				kanban: {
					...state.kanban,
					tasks: [
						...tasks_obj
					]
				},
			}
		case actionTypes.UPDATE_TASK:
			return {
				...state,
				kanban: {
					...state.kanban,
					tasks: state.kanban.tasks.map(task => task._id === action.payload._id ? action.payload : task)
				}
			}
		case actionTypes.UPDATE_PROFILE:
			return {
				...state,
				...action.payload,
				loading: false,
			}
		case actionTypes.GET_PROFILES:
			return {
				...state,
				profiles: action.payload,
				loading: false,
			}
		case actionTypes.GET_KIT_URL:
			return {
				...state,
				repos: action.payload,
				loading: false,
			}
		case actionTypes.CLEAR_PROFILE:
			return {
				...state,
				profile: null,
				repos: [],
				loading: false,
			}
		case actionTypes.PROFILE_ERROR:
			return {
				...state,
				error: action.payload,
				loading: false,
				profile: null,
			}
		case actionTypes.SET_DELETE_FILE:
			return {
				...state,
				kanban: {
					...state.kanban,
					file_context: action.payload,
				}
			}
		default:
			return state
	}
}
