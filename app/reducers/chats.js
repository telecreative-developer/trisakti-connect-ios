import {
	FETCH_CHAT_PERSONAL_SUCCESS,
	SEND_CHAT_PERSONAL_SUCCESS,
	FETCH_CHAT_BY_ID_SUCCESS,
	DELETE_CHAT_SUCCESS
} from '../constants'

export const fetchChatsPersonalSuccess = (state = [], action) => {
	switch(action.type) {
	case FETCH_CHAT_PERSONAL_SUCCESS:
		return action.fetchChatsPersonalSuccess
	default:
		return state
	}
}

export const fetchChatsByIDSuccess = (state = [], action) => {
	switch(action.type) {
	case FETCH_CHAT_BY_ID_SUCCESS:
		return action.fetchChatsByIDSuccess
	default:
		return state
	}
}

export const sendChatPersonalSuccess = (state = false, action) => {
	switch(action.type) {
	case SEND_CHAT_PERSONAL_SUCCESS:
		return action.sendChatPersonalSuccess
	default:
		return state
	}
}

export const deleteChatSuccess = (state = false, action) => {
	switch(action.type) {
	case DELETE_CHAT_SUCCESS:
		return action.deleteChatSuccess
	default:
		return state
	}
}