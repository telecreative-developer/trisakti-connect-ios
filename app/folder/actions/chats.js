import {
	FETCH_CHAT_PERSONAL_SUCCESS,
	SEND_CHAT_PERSONAL_SUCCESS,
	FETCH_CHAT_BY_ID_SUCCESS,
	DELETE_CHAT_SUCCESS
} from '../constants'
import { app } from '../socket'
import { url } from '../server'
import { setLoading, setFailed } from './processor'
import removeDuplicates from 'removeduplicates'

export const fetchChatsPersonal = (myid, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'fetch_chat_personal'}))
		try{
			const response = await fetch(`${url}/chats?myid=${myid}&$sort[createdAt]=-1`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			const data = await response.json()
			const datafilter = await removeDuplicates(data.data, 'id')
			await dispatch(fetchChatsPersonalSuccess(datafilter))
			await dispatch(setLoading({condition: false, process_on: 'fetch_chat_personal'}))
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Fetch Chat Personal Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'fetch_chat_personal'}))
		}
	}
}

const fetchChatsPersonalSuccess = (data) => {
	return {
		type: FETCH_CHAT_PERSONAL_SUCCESS,
		fetchChatsPersonalSuccess: data
	}
}

export const fetchChatsByID = (id, myid, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'fetch_chat_by_id'}))
		try{
			const response = await fetch(`${url}/chats?id=${id}&myid=${myid}&$sort[createdAt]=-1`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			const data = await response.json()
			await dispatch(fetchChatsByIDSuccess(data.data))
			await dispatch(setLoading({condition: false, process_on: 'fetch_chat_by_id'}))
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Fetch Chat By Id Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'fetch_chat_by_id'}))
		}
	}
}

export const fetchChatsByIDRealtime =  (id, myid, accessToken) => {
	return async (dispatch) => {
		const chats = await app.service('chats')
		await chats.on('created', () => dispatch(fetchChatsByID(id, myid, accessToken)))
		await chats.on('removed', () => dispatch(fetchChatsByID(id, myid, accessToken)))
	}
}

export const fetchChatsPersonalRealtime = (myid, accessToken) => {
	return async (dispatch) => {
		const chats = await app.service('chats')
		await chats.on('created', () => dispatch(fetchChatsPersonal(myid, accessToken)))
		await chats.on('removed', () => dispatch(fetchChatsPersonal(myid, accessToken)))		
	}
}

const fetchChatsByIDSuccess = (data) => {
	return {
		type: FETCH_CHAT_BY_ID_SUCCESS,
		fetchChatsByIDSuccess: data
	}
}

export const sendImageChatPersonal = (item, thumbnail, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'send_image_chat_personal'}))
		try {
			const response = await fetch(`${url}/chats-images`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				},
				body: JSON.stringify({uri: thumbnail})
			})
			const data = await response.json()
			await dispatch(sendChatPersonal({id: item.id, myid: item.myid, sender: item.myid, message: item.message, image: `${url}/files/chats/images/${data.id}`}, accessToken))
			await dispatch(setLoading({condition: true, process_on: 'send_image_chat_personal'}))			
		}catch(e) {
			dispatch(setFailed({condition: true, message: 'Send Image Chat Personal Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'send_image_chat_personal'}))
		}
	}
}

export const sendChatPersonal = (item, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'send_chat_personal'}))		
		try{
			await fetch(`${url}/chats`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				},
				body: JSON.stringify({id: item.id, myid: item.myid, sender: item.myid, message: item.message, image: item.image})
			})
			await fetch(`${url}/chats`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				},
				body: JSON.stringify({id: item.myid, myid: item.id, sender: item.myid, message: item.message, image: item.image})
			})
			await dispatch(sendChatPersonalSuccess(true))
			await dispatch(setLoading({condition: false, process_on: 'send_chat_personal'}))		
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Send Chat Personal Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'send_chat_personal'}))
		}
	}
}

const sendChatPersonalSuccess = (success) => {
	return {
		type: SEND_CHAT_PERSONAL_SUCCESS,
		sendChatPersonalSuccess: success
	}
}

export const deleteChat = (id, myid, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'delete_chat'}))
		try {
			await fetch(`${url}/chats?id=${id}&myid=${myid}`, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			await dispatch(deleteChatSuccess(true))
			await dispatch(setLoading({condition: false, process_on: 'delete_chat'}))
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Delete Chat Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'delete_chat'}))
		}
	}
}

const deleteChatSuccess = (success) => {
	return {
		type: DELETE_CHAT_SUCCESS,
		deleteChatSuccess: success
	}
}