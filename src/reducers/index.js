import { combineReducers } from 'redux'

import alert from './alert'
import auth from './auth'
import profile from './profile'
import post from './post'
import task from './tasks'
import chat from './chat_sessions'
import kits from './kits'

export default combineReducers({ alert, auth, profile, post, task, chat, kits })
