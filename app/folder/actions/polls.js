import { url } from '../server'
import {
	FETCH_POLLS_SUCCESS,
	FETCH_POLLS_ANSWERS_SUCCESS,
	CHECK_HAS_VOTED,
	POST_VOTE_SUCCESS,
	VOTE_LIST_ADDED,
	REMOVE_LIST_SELECTED
} from '../constants'

import { app } from '../socket'
import { setLoading, setFailed } from './processor'

export const fetchPolls = (accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'fetch_polls'}))
		try {
			const response = await fetch(`${url}/polls`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			const data = await response.json()
			await dispatch(fetchPollsSuccess(data.data))
			await dispatch(setLoading({condition: false, process_on: 'fetch_polls'}))
		}catch(e) {
			dispatch(setFailed({condition: true, message: 'Fetch Polls Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'fetch_polls'}))
		}
	}
}

const fetchPollsSuccess = (data) => {
	return {
		type: FETCH_POLLS_SUCCESS,
		fetchPollsSuccess: data
	}
}

export const fetchPollsAnswers = (id_poll, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'fetch_polls_answers'}))
		try {
			const response = await fetch(`${url}/pollsanswers?id_poll=${id_poll}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			const data = await response.json()
			await dispatch(fetchPollsAnswersSuccess(data.data))
			await dispatch(setLoading({condition: false, process_on: 'fetch_polls_answers'}))
		}catch(e) {
			await dispatch(setFailed({condition: true, message: 'Fetch Polls Answers Failed', detailMessage: e}))
			await dispatch(setLoading({condition: false, process_on: 'fetch_polls_answers'}))
		}
	}
}

export const fetchPollsAnswersRealtime = (id_poll, accessToken) => {
	return async (dispatch) => {
		const pollsanswers = await app.service('pollsanswers')
		await pollsanswers.on('created', () => dispatch(fetchPollsAnswers(id_poll, accessToken)))
		await pollsanswers.on('created', () => dispatch(fetchPolls(accessToken)))
	}
}

const fetchPollsAnswersSuccess = (data) => {
	return {
		type: FETCH_POLLS_ANSWERS_SUCCESS,
		fetchPollsAnswersSuccess: data
	}
}

export const checkHasVoted = (iduser, idpoll, accessToken) => {
	return async (dispatch) => {
		const response = await fetch(`${url}/pollsanswers?id=${iduser}&id_poll=${idpoll}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': accessToken
			}
		})
		const data = await response.json()
		if(data.data.length !== 0) {
			await dispatch(hasVoted(true))
		}else{
			await dispatch(hasVoted(false))
		}
	}
}

const hasVoted = (voted) => {
	return {
		type: CHECK_HAS_VOTED,
		hasVoted: voted
	}
}

export const postVote = (data, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'post_vote'}))
		try {
			await fetch(`${url}/pollsanswers`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				},
				body: JSON.stringify(data)
			})
			await dispatch(postVoteSuccess(true))
			await dispatch(setLoading({condition: false, process_on: 'post_vote'}))
		}catch(e){
			await dispatch(setFailed({condition: true, message: 'Post Vote Failed', detailMessage: e}))
			await dispatch(setLoading({condition: false, process_on: 'post_vote'}))
		}
	}
}

const postVoteSuccess = (success) => {
	return {
		type: POST_VOTE_SUCCESS,
		postVoteSuccess: success
	}
}

export const publishVoteThumbnail = (thumbnail, dataVote, dataChoice, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'publish_vote'})) 
		try {
				const responsePostThumbnailVote = await fetch(`${url}/thumbnail-news`, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': accessToken
					},
					body: JSON.stringify({uri: thumbnail})
				})
				const data = await responsePostThumbnailVote.json()
				await dispatch(publishVote({title_poll: dataVote.title, thumbnail_poll: `${url}/files/news/images/${data.id}`, content_poll: dataVote.content}, dataChoice, accessToken))
		}catch(e) {
			dispatch(setFailed({condition: true, message: 'Publish Vote Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'publish_vote'}))
		}
	}
}

const publishVote = (content, dataChoice, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'publish_vote'})) 
		try {
				const responsePostVote = await fetch(`${url}/polls`, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': accessToken
					},
					body: JSON.stringify(content)
				})
				const data = await responsePostVote.json()
				await dataChoice.map(choice => dispatch(publishVoteChoice({id_poll: data.id_poll, candidate: choice.name}, accessToken)))
		}catch(e) {
			dispatch(setFailed({condition: true, message: 'Publish Vote Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'publish_vote'}))
		}
	}
}

const publishVoteChoice = (dataChoices, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'publish_vote'})) 
		try {
				const responsePostDataChoice = await fetch(`${url}/pollschoices`, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': accessToken
					},
					body: JSON.stringify(dataChoices)
				})
				await dispatch(setLoading({condition: false, process_on: 'publish_vote'}))				
		}catch(e) {
			dispatch(setFailed({condition: true, message: 'Publish Vote Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'publish_vote'}))
		}
	}
}

let nextId = 0

export const addVoteList = (name) => {
	return {
		type: VOTE_LIST_ADDED,
		id: nextId++,
		name
	}
}

export const removeVoteList = (data) => {
	return {
		type: REMOVE_LIST_SELECTED,
		id: data.id,
		name: data.name
	}
}