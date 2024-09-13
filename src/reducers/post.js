import * as actionTypes from '../actions/types'

const initalState = {
	posts: [
		{
		  "user": "64b4fa6543b77b7cfac1941b",
		  "content": {
			"type": "zoc3n",
			"attachments": [
			  {
				"type": "i9z7l",
				"url": "https://example.com/attachment1.jpg"
			  }
			],
			"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vehicula dolor id mi convallis, a fringilla massa efficitur.",
			"thumbnail": {
			  "type": "u7f5w",
			  "url": "https://example.com/thumbnail.jpg"
			}
		  },
		  "analytics": {
			"views": [
			  {
				"date": "2023-03-15T00:00:00.000Z",
				"user": "64b4fa6543b77b7cfac1941c"
			  }
			],
			"commenters": [
			  {
				"user": "64b4fa6543b77b7cfac1941d",
				"text": "Great content!",
				"date": "2023-04-10T00:00:00.000Z",
				"reaction": 4,
				"attachments": [
				  {
					"type": "p2h8s",
					"url": "https://example.com/comment1.jpg"
				  }
				],
				"reply": [
				  {
					"user": "64b4fa6543b77b7cfac1941e",
					"text": "Thanks!",
					"date": "2023-04-11T00:00:00.000Z",
					"reaction": 3,
					"attachments": [
					  {
						"type": "k6d3r",
						"url": "https://example.com/reply1.jpg"
					  }
					]
				  }
				]
			  }
			],
			"reactions": {
			  "user": "64b4fa6543b77b7cfac1941f",
			  "reaction": 5
			}
		  },
		  "date": "2023-05-20T00:00:00.000Z"
		},
		{
		  "user": "64b4fa6543b77b7cfac19420",
		  "content": {
			"type": "b4z8c",
			"attachments": [
			  {
				"type": "u5l2m",
				"url": "https://example.com/attachment2.jpg"
			  }
			],
			"text": "Suspendisse potenti. In hac habitasse platea dictumst. Aenean sit amet sapien eu quam sodales tempor.",
			"thumbnail": {
			  "type": "t6f4k",
			  "url": "https://example.com/thumbnail2.jpg"
			}
		  },
		  "analytics": {
			"views": [
			  {
				"date": "2023-01-20T00:00:00.000Z",
				"user": "64b4fa6543b77b7cfac19421"
			  }
			],
			"commenters": [
			  {
				"user": "64b4fa6543b77b7cfac19422",
				"text": "Interesting post!",
				"date": "2023-02-15T00:00:00.000Z",
				"reaction": 3,
				"attachments": [
				  {
					"type": "m9f6s",
					"url": "https://example.com/comment2.jpg"
				  }
				],
				"reply": [
				  {
					"user": "64b4fa6543b77b7cfac19423",
					"text": "Glad you liked it!",
					"date": "2023-02-16T00:00:00.000Z",
					"reaction": 2,
					"attachments": [
					  {
						"type": "j8h7k",
						"url": "https://example.com/reply2.jpg"
					  }
					]
				  }
				]
			  }
			],
			"reactions": {
			  "user": "64b4fa6543b77b7cfac19424",
			  "reaction": 4
			}
		  },
		  "date": "2023-03-05T00:00:00.000Z"
		},
		{
		  "user": "64b4fa6543b77b7cfac19425",
		  "content": {
			"type": "x5g3m",
			"attachments": [
			  {
				"type": "q7v9t",
				"url": "https://example.com/attachment3.jpg"
			  }
			],
			"text": "Curabitur nec elit at nisl tristique lacinia non id orci. Nullam vehicula libero sit amet tortor egestas, non aliquet arcu varius.",
			"thumbnail": {
			  "type": "v5h3j",
			  "url": "https://example.com/thumbnail3.jpg"
			}
		  },
		  "analytics": {
			"views": [
			  {
				"date": "2023-06-18T00:00:00.000Z",
				"user": "64b4fa6543b77b7cfac19426"
			  }
			],
			"commenters": [
			  {
				"user": "64b4fa6543b77b7cfac19427",
				"text": "Very informative.",
				"date": "2023-07-20T00:00:00.000Z",
				"reaction": 5,
				"attachments": [
				  {
					"type": "l6m8r",
					"url": "https://example.com/comment3.jpg"
				  }
				],
				"reply": [
				  {
					"user": "64b4fa6543b77b7cfac19428",
					"text": "Thank you!",
					"date": "2023-07-21T00:00:00.000Z",
					"reaction": 4,
					"attachments": [
					  {
						"type": "g5k4n",
						"url": "https://example.com/reply3.jpg"
					  }
					]
				  }
				]
			  }
			],
			"reactions": {
			  "user": "64b4fa6543b77b7cfac19429",
			  "reaction": 4
			}
		  },
		  "date": "2023-08-12T00:00:00.000Z"
		},
		{
		  "user": "64b4fa6543b77b7cfac1942a",
		  "content": {
			"type": "y7h2d",
			"attachments": [
			  {
				"type": "s8k4v",
				"url": "https://example.com/attachment4.jpg"
			  }
			],
			"text": "Mauris fringilla eros vel augue hendrerit, eget interdum turpis facilisis. Praesent auctor felis non lectus gravida, et sodales metus suscipit.",
			"thumbnail": {
			  "type": "r9k2h",
			  "url": "https://example.com/thumbnail4.jpg"
			}
		  },
		  "analytics": {
			"views": [
			  {
				"date": "2023-11-25T00:00:00.000Z",
				"user": "64b4fa6543b77b7cfac1942b"
			  }
			],
			"commenters": [
			  {
				"user": "64b4fa6543b77b7cfac1942c",
				"text": "Nice work!",
				"date": "2023-12-10T00:00:00.000Z",
				"reaction": 5,
				"attachments": [
				  {
					"type": "p2m7k",
					"url": "https://example.com/comment4.jpg"
				  }
				],
				"reply": [
				  {
					"user": "64b4fa6543b77b7cfac1942d",
					"text": "Appreciate it!",
					"date": "2023-12-11T00:00:00.000Z",
					"reaction": 5,
					"attachments": [
					  {
						"type": "v7k4n",
						"url": "https://example.com/reply4.jpg"
					  }
					]
				  }
				]
			  }
			],
			"reactions": {
			  "user": "64b4fa6543b77b7cfac1942e",
			  "reaction": 5
			}
		  },
		  "date": "2023-10-22T00:00:00.000Z"
		},
		{
		  "user": "64b4fa6543b77b7cfac1942f",
		  "content": {
			"type": "z2h5n",
			"attachments": [
			  {
				"type": "b5j9r",
				"url": "https://example.com/attachment5.jpg"
			  }
			],
			"text": "Integer sollicitudin mauris et est bibendum, non hendrerit erat dapibus. Vestibulum sit amet libero vel arcu faucibus venenatis.",
			"thumbnail": {
			  "type": "k8m4v",
			  "url": "https://example.com/thumbnail5.jpg"
			}
		  },
		  "analytics": {
			"views": [
			  {
				"date": "2023-02-17T00:00:00.000Z",
				"user": "64b4fa6543b77b7cfac19430"
			  }
			],
			"commenters": [
			  {
				"user": "64b4fa6543b77b7cfac19431",
				"text": "Helpful post!",
				"date": "2023-03-10T00:00:00.000Z",
				"reaction": 4,
				"attachments": [
				  {
					"type": "j7k5m",
					"url": "https://example.com/comment5.jpg"
				  }
				],
				"reply": [
				  {
					"user": "64b4fa6543b77b7cfac19432",
					"text": "Thanks!",
					"date": "2023-03-11T00:00:00.000Z",
					"reaction": 4,
					"attachments": [
					  {
						"type": "r6j2k",
						"url": "https://example.com/reply5.jpg"
					  }
					]
				  }
				]
			  }
			],
			"reactions": {
			  "user": "64b4fa6543b77b7cfac19433",
			  "reaction": 4
			}
		  },
		  "date": "2023-04-14T00:00:00.000Z"
		}
	  ],
	post: null,
	loading: true,
	error: {},
}

export default function postReducer(state = initalState, action) {
	switch (action.type) {
		case actionTypes.GET_POSTS:
			return {
				...state,
				posts: action.payload,
				loading: false,
			}
		case actionTypes.GET_POST:
			return {
				...state,
				post: action.payload,
				loading: false,
			}
		case actionTypes.UPDATE_LIKES:
			return {
				...state,
				posts: state.posts.map((post) =>
					post._id === action.payload.postId
						? { ...post, likes: action.payload.likes }
						: post
				),
				loading: false,
			}
		case actionTypes.ADD_POST:
			return {
				...state,
				posts: [action.payload, ...state.posts],
				loading: false,
			}
		case actionTypes.DELETE_POST:
			return {
				...state,
				posts: state.posts.filter(
					(post) => post._id !== action.payload
				),
				loading: false,
			}
		case actionTypes.ADD_COMMENT:
			return {
				...state,
				post: { ...state.post, comments: action.payload },
				loading: false,
			}
		case actionTypes.REMOVE_COMMENT:
			return {
				...state,
				post: {
					...state.post,
					comments: state.post.comments.filter(
						(cmnt) => cmnt._id !== action.payload
					),
				},
				loading: false,
			}
		case actionTypes.POST_ERROR:
			return {
				...state,
				error: action.payload,
				loading: false,
			}
		default:
			return state
	}
}
