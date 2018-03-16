import {
	FETCH_POLLS_SUCCESS,
	FETCH_POLLS_ANSWERS_SUCCESS,
	CHECK_HAS_VOTED,
	POST_VOTE_SUCCESS,
	VOTE_LIST_ADDED,
	REMOVE_LIST_SELECTED
} from '../constants'

export const fetchPollsSuccess = (state = [], action) => {
	switch(action.type) {
	case FETCH_POLLS_SUCCESS:
		return action.fetchPollsSuccess
	default:
		return state
	}
}

export const fetchPollsAnswersSuccess = (state = [], action) => {
	switch(action.type) {
	case FETCH_POLLS_ANSWERS_SUCCESS:
		return action.fetchPollsAnswersSuccess
	default:
		return state
	}
}

export const hasVoted = (state = false, action) => {
	switch(action.type) {
	case CHECK_HAS_VOTED:
		return action.hasVoted
	default:
		return state
	}
}

export const postVoteSuccess = (state = false, action) => {
	switch(action.type) {
	case POST_VOTE_SUCCESS:
		return action.postVoteSuccess
	default:
		return state
	}
}

export const votesList = (state = [], action) => {
	switch(action.type) {
		case VOTE_LIST_ADDED:
			return [
				...state,
				{
					id: action.id,
					name: action.name
				}
			]
		case REMOVE_LIST_SELECTED:
			return [
				...state.filter(s => s.id !== action.id)
			]
		default:
			return state
		}
}