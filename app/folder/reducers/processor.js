import {
	SESSION,
	PROCESS_LOADING,
	PROCESS_FAILED,
	SET_NOTIFICATION,
	SET_LINK_NAVIGATE,
	SET_DATA_USER
} from '../constants'

const stateLoading = {
	condition: false,
	proccess_on: null
}

const stateFailed = {
	condition: false,
	message: null,
	detailMessage: null
}

const stateLinkNavigate = {
	navigate: 'Home',
	data: []
}

export const session = (state = {}, action) => {
	switch(action.type) {
	case SESSION:
		return action.session
	default:
		return state
	}
}

export const loading = (state = stateLoading, action) => {
	switch(action.type) {
	case PROCESS_LOADING:
		return action.loading
	default:
		return state
	}
}

export const failed = (state = stateFailed, action) => {
	switch(action.type) {
	case PROCESS_FAILED:
		return action.failed
	default:
		return state
	}
}

export const linkNavigate = (state = stateLinkNavigate, action) => {
	switch(action.type) {
		case SET_LINK_NAVIGATE:
			return action.linkNavigate
		default:
			return state
	}
}

export const dataUser = (state = [], action) => {
	switch(action.type) {
		case SET_DATA_USER:
			return action.dataUser
		default:
			return state
	}
}