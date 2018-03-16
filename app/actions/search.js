import { SEARCH_RESULT_USER, SEARCH_RESULT_NEWS, SEARCH_RESULT_VOTE, SEARCH_RESULT_CAREER, SEARCH_NOTFOUND } from '../constants'
import { url } from '../server'
import { setLoading, setFailed } from './processor'

export const searchUser = (name) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'search'}))
		try {
			const response = await fetch(`${url}/users?name[$like]=${name}%&$limit=50&$sort[name]=-1`)
			const data = await response.json()
			if(await data.data.length !== 0) {
				await dispatch(searchResultUser(data.data))
				await dispatch(setLoading({condition: false, process_on: 'search_user'}))				
			}else{
				await dispatch(searchNotFound({condition: true, process_on: 'search_user'}))
				await dispatch(setLoading({condition: false, process_on: 'search_user'}))
			}
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Search Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'search_user'}))
		}
	}
}

export const searchResultUser = (result) => {
	return {
		type: SEARCH_RESULT_USER,
		searchResultUser: result
	}
}

export const searchNews = (title, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'search'}))
		try {
			const response = await fetch(`${url}/news?title[$like]=${title}%&$limit=50&$sort[title]=-1`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			const data = await response.json()
			if(await data.data.length !== 0) {
				await dispatch(searchResultNews(data.data))
				await dispatch(setLoading({condition: false, process_on: 'search_news'}))				
			}else{
				await dispatch(searchNotFound({condition: false, process_on: 'search_news'}))
				await dispatch(setLoading({condition: false, process_on: 'search_news'}))
			}
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Search Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'search_news'}))
		}
	}
}

export const searchResultNews = (result) => {
	return {
		type: SEARCH_RESULT_NEWS,
		searchResultNews: result
	}
}

export const searchVote = (title, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'search'}))
		try {
			const response = await fetch(`${url}/polls?title_poll[$like]=${title}%&$limit=50&$sort[title_poll]=-1`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			const data = await response.json()
			if(await data.data.length !== 0) {
				await dispatch(searchResultVote(data.data))
				await dispatch(setLoading({condition: false, process_on: 'search_vote'}))				
			}else{
				await dispatch(searchNotFound({condition: false, process_on: 'search_vote'}))
				await dispatch(setLoading({condition: false, process_on: 'search_vote'}))
			}
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Search Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'search_vote'}))
		}
	}
}

export const searchResultVote = (result) => {
	return {
		type: SEARCH_RESULT_VOTE,
		searchResultVote: result
	}
}

export const searchCareer = (title, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'search'}))
		try {
			const response = await fetch(`${url}/careers?job_title[$like]=${title}%&$limit=50&$sort[job_title]=-1`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			const data = await response.json()
			if(await data.data.length !== 0) {
				await dispatch(searchResultCareer(data.data))
				await dispatch(setLoading({condition: false, process_on: 'search_career'}))
			}else{
				await dispatch(searchNotFound({condition: false, process_on: 'search_career'}))
				await dispatch(setLoading({condition: false, process_on: 'search_career'}))
			}
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Search Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'search_career'}))
		}
	}
}

export const searchResultCareer = (result) => {
	return {
		type: SEARCH_RESULT_CAREER,
		searchResultCareer: result
	}
}

export const searchNotFound = (notfound) => {
	return {
		type: SEARCH_NOTFOUND,
		searchNotFound: notfound
	}
}