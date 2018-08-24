import { AsyncStorage } from 'react-native'
import {
	FETCH_DATA_FACULTIES_SUCCESS,
	FETCH_DATA_MAJORS_SUCCESS,
	FETCH_DATA_WITH_NIM_SUCCESS,
	REGISTER_USER_SUCCESS,
	EDIT_PROFILE_USER_SUCCESS,
	SEND_REQUEST_FRIEND_SUCCESS,
	FETCH_FRIEND_REQUEST_SUCCESS,
	FETCH_FRIENDS_SUCCESS,
	CONFIRM_FRIEND_REQUEST_SUCCESS,
	REMOVE_FRIEND_REQUEST_SUCCESS,
	CHECK_FRIEND_STATUS,
	SEND_REPORT_REGISTER_SUCCESS
} from '../constants'
import { app } from '../socket'
import { url } from '../server'
import { setLoading, setFailed, setDataUser } from '../actions/processor'

export const saveSession = (email, accessToken) => {
	return () => {
		AsyncStorage.setItem('session', JSON.stringify({email, accessToken}))
	}
}

export const savePassword = (password) => {
	return () => {
		AsyncStorage.setItem('password', JSON.stringify({password}))
	}
}

export const register = (id, data) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'register'}))
		try {
			await fetch(`${url}/users/${id}`, {
				method: 'PUT',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({...data, verified: true})
			})
			await dispatch(registerSuccess(true))
			await dispatch(setLoading({condition: false, process_on: 'register'}))
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Register Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'register'}))
		}
	}
}

export const registerManual = (data) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'register'}))
		try {
			await fetch(`${url}/users`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({...data, verified: true})
			})
			await dispatch(registerSuccess(true))
			await dispatch(setLoading({condition: false, process_on: 'register'}))
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Register Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'register'}))
		}
	}
}

const registerSuccess = (success) => {
	return {
		type: REGISTER_USER_SUCCESS,
		registerSuccess: success
	}
}

export const fetchUserWithNim = (nim) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'fetch_user_with_nim'}))
		try {
			let response = await fetch(`${url}/users?nim=${nim}&password=1`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			})
			
			let data = await response.json()
			if(data.data[0].length !== 0) {
				await dispatch(userWithNim(data.data[0]))
				await dispatch(setLoading({condition: false, process_on: 'fetch_user_with_nim'}))
			}else{
				dispatch(setFailed({condition: true, message: `User with NIM: ${nim} not found or has been registered.`, detailMessage: e}))
				dispatch(setLoading({condition: false, process_on: 'fetch_user_with_nim'}))
			}
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Fetch User with Nim Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'fetch_user_with_nim'}))
		}
	}
}

export const userWithNim = (data) => {
	return {
		type: FETCH_DATA_WITH_NIM_SUCCESS,
		dataUserWithNim: data
	}
}

export const fetchFaculties = () => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'fetch_faculties'}))
		try {
			let response = await fetch(`${url}/faculties?$limit=50`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			})
			let data = await response.json()
			await dispatch(dataFaculties(data.data))
			await dispatch(setLoading({condition: false, process_on: 'fetch_faculties'}))			
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Fetch Faculties Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'fetch_faculties'}))
		}
	}
}

const dataFaculties = (data) => {
	return {
		type: FETCH_DATA_FACULTIES_SUCCESS,
		dataFaculties: data
	}
}

export const fetchMajors = () => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'fetch_majors'}))
		try{
			const response = await fetch(`${url}/majors?$limit=50`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			})
			const data = await response.json()
			await dispatch(dataMajors(data.data))
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Fetch Majors Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'fetch_majors'}))
		}
	}
}

const dataMajors = (data) => {
	return {
		type: FETCH_DATA_MAJORS_SUCCESS,
		dataMajors: data
	}
}

export const editProfileWithAvatar = (id, avatar, item, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'edit_profile'}))
		try {
			const responsePostAvatar = await fetch(`${url}/avatar-users`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				},
				body: JSON.stringify({uri: avatar})
			})
			const dataPostAvatar = await responsePostAvatar.json()
			const dataItems = await { 
				avatar: `${url}/files/users/images/${dataPostAvatar.id}`,
				name: item.name,
				email: item.email,
				facebook: item.facebook,
				twitter: item.twitter,
				linkedin: item.linkedin
			}
			const response = await fetch(`${url}/users/${id}`, {
				method: 'PATCH',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				},
				body: JSON.stringify(dataItems)
			})
			const dataRes = await response.json()
			await dispatch(setDataUser(dataRes))
			await dispatch(editProfileSuccess(true))
			await dispatch(setLoading({condition: false, process_on: 'edit_profile'}))
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Edit Profile Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'edit_profile'}))
		}
	}
}

export const editProfileWithoutAvatar = (id, item, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'edit_profile'}))		
		try {
			const response = await fetch(`${url}/users/${id}`, {
				method: 'PATCH',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				},
				body: JSON.stringify(item)
			})
			const dataRes = await response.json()
			await dispatch(setDataUser(dataRes))
			await dispatch(editProfileSuccess(true))
			await dispatch(setLoading({condition: false, process_on: 'edit_profile'}))
		}catch(e){
			console.log(e)
			dispatch(setFailed({condition: true, message: 'Edit Profile Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'edit_profile'}))
		}
	}
}

const editProfileSuccess = (success) => {
	return {
		type: EDIT_PROFILE_USER_SUCCESS,
		editProfileSuccess: success
	}
}

export const sendRequestFriend = (data, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'send_request_friend'}))
		try {
			await fetch(`${url}/friendsrequest`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				},
				body: JSON.stringify(data)
			})
			await dispatch(sendRequestFriendSuccess(true))
			await dispatch(setLoading({condition: false, process_on: 'send_request_friend'}))
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Send Request Friend Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'send_request_friend'}))
		}
	}
}

const sendRequestFriendSuccess = (success) => {
	return {
		type: SEND_REQUEST_FRIEND_SUCCESS,
		sendRequestFriendSuccess: success
	}
}

export const fetchFriendRequest = (id, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'fetch_friends_request'}))
		try {
			const response = await fetch(`${url}/friendsrequest?request_to=${id}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			const data = await response.json()
			await dispatch(fetchFriendRequestSuccess(data.data))
			await dispatch(setLoading({condition: false, process_on: 'fetch_friends_request'}))
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Fetch Request Friends Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'fetch_friends_request'}))
		}
	}
}

export const fetchFriendRequestRealtime = (id, accessToken) => {
	return async (dispatch) => {
		const friendsrequest = await app.service('friendsrequest')
		await friendsrequest.on('created', () => dispatch(fetchFriendRequest(id, accessToken)))
		await friendsrequest.on('removed', () => dispatch(fetchFriendRequest(id, accessToken)))
	}
}

const fetchFriendRequestSuccess = (data) => {
	return {
		type: FETCH_FRIEND_REQUEST_SUCCESS,
		fetchFriendRequestSuccess: data
	}
}

export const fetchFriends = (id, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'fetch_friends'}))
		try {
			const response = await fetch(`${url}/friends?confirm_by=${id}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			const data = await response.json()
			await dispatch(fetchFriendsSuccess(data.data))
			await dispatch(setLoading({condition: false, process_on: 'fetch_friends'}))			
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Fetch Friends Failed', detailMessage: e}))			
			dispatch(setLoading({condition: false, process_on: 'fetch_friends'}))
		}
	}
}

export const fetchFriendsRealtime = (id, accessToken) => {
	return (dispatch) => {
		const friends = app.service('friends')
		friends.on('created', () => dispatch(fetchFriends(id, accessToken)))
	}
}

const fetchFriendsSuccess = (data) => {
	return {
		type: FETCH_FRIENDS_SUCCESS,
		fetchFriendsSuccess: data
	}
}

export const confirmFriendRequest = (id, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: false, process_on: 'confirm_friend'}))		
		try {
			const response = await fetch(`${url}/friendsrequest?id_friendrequest=${id}`, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			const data = await response.json()
			try {
				await fetch(`${url}/friends`, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': accessToken
					},
					body: JSON.stringify({id: data[0].request_to, confirm_by: data[0].id})
				})
				await fetch(`${url}/friends`, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': accessToken
					},
					body: JSON.stringify({id: data[0].id, confirm_by: data[0].request_to})
				})
				await dispatch(confirmFriendSuccess(true))
				await dispatch(setLoading({condition: false, process_on: 'confirm_friend'}))
			}catch(e){
				dispatch(setFailed({condition: true, message: 'Confirm Friend Failed', detailMessage: e}))
				dispatch(setLoading({condition: false, process_on: 'confirm_friend'}))
			}
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Confirm Friend Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'confirm_friend'}))
		}
	}
}

const confirmFriendSuccess = (success) => {
	return {
		type: CONFIRM_FRIEND_REQUEST_SUCCESS,
		confirmFriendSuccess: success
	}
}

export const removeFriendRequest = (id, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'remove_friend_request'}))		
		try {
			await fetch(`${url}/friendsrequest?id_friendrequest=${id}`, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			await dispatch(removeFriendSuccess(true))
			await dispatch(setLoading({condition: false, process_on: 'remove_friend_request'}))		
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Remove Friend Request Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'remove_friend_request'}))		
		}
	}
}

const removeFriendSuccess = (success) => {
	return {
		type: REMOVE_FRIEND_REQUEST_SUCCESS,
		removeFriendSuccess: success
	}
}

export const checkFriendStatus = (myid, iduser, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'check_friend_status'}))		
		try {
			const response = await fetch(`${url}/friends?id=${iduser}&confirm_by=${myid}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			const data = await response.json()
			const result = await data.data.length
			if(result !== 0) {
				await dispatch(checkFriendStatusSuccess('Friend'))
			}else{
				await dispatch(checkFriendRequestStatus(myid, iduser, accessToken))
			}
			await dispatch(setLoading({condition: false, process_on: 'check_friend_status'}))		
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Check Friend Status Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'check_friend_status'}))		
		}
	}
}

const checkFriendRequestStatus = (myid, iduser, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'check_friend_status'}))		
		try{
			const response = await fetch(`${url}/friendsrequest?id=${myid}&request_to=${iduser}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			const data = await response.json()
			const result = await data.data.length
			if(result !== 0) {
				dispatch(checkFriendStatusSuccess('FriendRequested'))
			}else{
				const response = await fetch(`${url}/friendsrequest?id=${iduser}&request_to=${myid}`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': accessToken
					}
				})
				const data = await response.json()
				const result = await data.data.length
				if(result !== 0){
					dispatch(checkFriendStatusSuccess('FriendRequested'))
				}else{
					dispatch(checkFriendStatusSuccess('NotFriend'))
				}
			}
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Check Friend Status Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'check_friend_status'}))		
		}
	}
}

const checkFriendStatusSuccess = (friend) => {
	return {
		type: CHECK_FRIEND_STATUS,
		checkFriendStatusSuccess: friend
	}
}

export const sendReport = (data) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'send_report_register'}))		
		try {
			await fetch(`${url}/reports`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			await dispatch(setLoading({condition: false, process_on: 'send_report_register'}))		
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Send Report Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'send_report_register'}))
		}
	}
}