import {
	FETCH_NEWS_SUCCESS,
	PUBLISH_NEWS_SUCCESS,
	SEND_COMMENT_SUCCESS,
	FETCH_COMMENT_SUCCESS,
	POST_ADD_CLAPS,
	POST_JOB_SUCCESS,
	FETCH_JOB_SUCCESS
} from '../constants'

export const publishNewsSuccess = (state = false, action) => {
	switch(action.type) {
	case PUBLISH_NEWS_SUCCESS:
		return action.publishNewsSuccess
	default:
		return state
	}
}

export const news = (state = [], action) => {
	switch(action.type) {
	case FETCH_NEWS_SUCCESS:
		return action.news
	default:
		return state
	}
}

export const sendCommentSuccess = (state = false, action) => {
	switch(action.type) {
	case SEND_COMMENT_SUCCESS:
		return action.sendCommentSuccess
	default:
		return state
	}
}

export const fetchCommentsSuccess = (state = [], action) => {
	switch(action.type) {
	case FETCH_COMMENT_SUCCESS:
		return action.fetchCommentsSuccess
	default:
		return state
	}
}

export const addClapsSuccess = (state = false, action) => {
	switch(action.type) {
	case POST_ADD_CLAPS:
		return action.addClapsSuccess
	default:
		return state
	}
}

export const postJobSuccess = (state = false, action) => {
	switch(action.type) {
	case POST_JOB_SUCCESS:
		return action.postJobSuccess
	default:
		return state
	}
}

export const fetchJobSuccess = (state = [], action) => {
	switch(action.type) {
	case FETCH_JOB_SUCCESS:
		return action.fetchJobSuccess
	default:
		return state
	}
}