import {
	FETCH_DATA_FACULTIES_SUCCESS,
	FETCH_DATA_MAJORS_SUCCESS,
	FETCH_DATA_WITH_NIM_SUCCESS,
	REGISTER_USER_SUCCESS,
	EDIT_PROFILE_USER_SUCCESS,
	SEND_REQUEST_FRIEND_SUCCESS,
	FETCH_FRIEND_REQUEST_SUCCESS,
	FETCH_FRIENDS_SUCCESS,
	CHECK_FRIEND_STATUS,
	SEND_REPORT_REGISTER_SUCCESS
} from '../constants'

export const modeOpenProfileFriend = (state = false, action) => {
	switch(action.type) {
	case SET_MODE_OPEN_PROFILE_FRIEND:
		return action.modeOpenProfileFriend
	default:
		return state
	}
}

export const contentOpenProfileFriend = (state = {}, action) => {
	switch(action.type) {
	case SET_CONTENT_OPEN_PROFILE_FRIEND:
		return action.contentOpenProfileFriend
	default:
		return state
	}
}

export const editProfileSuccess = (state = false, action) => {
	switch(action.type) {
	case EDIT_PROFILE_USER_SUCCESS:
		return action.editProfileSuccess
	default:
		return state
	}
}

export const registerSuccess = (state = false, action) => {
	switch(action.type) {
	case REGISTER_USER_SUCCESS:
		return action.registerSuccess
	default:
		return state
	}
}

export const fetchUserWithNim = (state = [], action) => {
	switch(action.type) {
	case FETCH_DATA_WITH_NIM_SUCCESS:
		return action.dataUserWithNim
	default:
		return state
	}
}

export const dataFaculties = (state = [], action) => {
	switch(action.type) {
	case FETCH_DATA_FACULTIES_SUCCESS:
		return action.dataFaculties
	default:
		return state
	}
}

export const dataMajors = (state = [], action) => {
	switch(action.type) {
	case FETCH_DATA_MAJORS_SUCCESS:
		return action.dataMajors
	default:
		return state
	}
}

export const sendRequestFriendSuccess = (state = false, action) => {
	switch(action.type) {
	case SEND_REQUEST_FRIEND_SUCCESS:
		return action.sendRequestFriendSuccess
	default:
		return state
	}
}

export const fetchFriendRequestSuccess = (state = [], action) => {
	switch(action.type) {
	case FETCH_FRIEND_REQUEST_SUCCESS:
		return action.fetchFriendRequestSuccess
	default:
		return state
	}
}

export const fetchFriendsSuccess = (state = [], action) => {
	switch(action.type) {
	case FETCH_FRIENDS_SUCCESS:
		return action.fetchFriendsSuccess
	default:
		return state
	}
}

export const checkFriendStatusSuccess = (state = 'NotFriend', action) => {
	switch(action.type) {
	case CHECK_FRIEND_STATUS:
		return action.checkFriendStatusSuccess
	default:
		return state
	}
}

export const sendReportRegiterSuccess = (state = false, action) => {
	switch(action.type) {
	case SEND_REPORT_REGISTER_SUCCESS:
		return action.sendReportRegiterSuccess
	default:
		return state
	}
}