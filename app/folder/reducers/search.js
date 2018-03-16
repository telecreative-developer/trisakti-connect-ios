import { SEARCH_RESULT_USER, SEARCH_RESULT_NEWS, SEARCH_RESULT_VOTE, SEARCH_RESULT_CAREER, SEARCH_NOTFOUND } from '../constants'

export const searchResultUser = (state = [], action) => {
	switch(action.type) {
	case SEARCH_RESULT_USER:
		return action.searchResultUser
	default:
		return state
	}
}

export const searchResultNews = (state = [], action) => {
	switch(action.type) {
	case SEARCH_RESULT_NEWS:
		return action.searchResultNews
	default:
		return state
	}
}

export const searchResultVote = (state = [], action) => {
	switch(action.type) {
	case SEARCH_RESULT_VOTE:
		return action.searchResultVote
	default:
		return state
	}
}

export const searchResultCareer = (state = [], action) => {
	switch(action.type) {
	case SEARCH_RESULT_CAREER:
		return action.searchResultCareer
	default:
		return state
	}
}

export const searchNotFound = (state = false, action) => {
	switch(action.type) {
	case SEARCH_NOTFOUND:
		return action.searchNotFound
	default:
		return state
	}
}