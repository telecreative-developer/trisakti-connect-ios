import {
	FETCH_NEWS_SUCCESS,
	PUBLISH_NEWS_SUCCESS,
	SEND_COMMENT_SUCCESS,
	FETCH_COMMENT_SUCCESS,
	POST_ADD_CLAPS,
	POST_JOB_SUCCESS,
	FETCH_JOB_SUCCESS
} from '../constants'
import { app } from '../socket'
import { url } from '../server'
import { setLoading, setFailed } from './processor'

export const fetchAllNews = (accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'fetch_news'}))
		try {
			let response = await fetch(`${url}/news?status=Agree&$limit=50&$sort[createdAt]=-1`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
			let data = await response.json()
			await dispatch(fetchNewsSuccess(data.data))
			await dispatch(setLoading({condition: false, process_on: 'fetch_news'}))
		} catch(e) {
			dispatch(setFailed({condition: true, message: 'Fetch News Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'fetch_news'}))
		}
	}
}

export const fetchAllNewsRealtime = (accessToken) => {
	return (dispatch) => {
		const news = app.service('news')
		news.on('removed', () => dispatch(fetchAllNews(accessToken)))
		news.on('patched', () => dispatch(fetchAllNews(accessToken)))
	}
}

export const fetchNewsSuccess = (data) => {
	return {
		type: FETCH_NEWS_SUCCESS,
		news: data
	}
}

export const publishNews = (thumbnail, item, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'publish_news'}))
		try {
			const responsePostThumbnailNews = await fetch(`${url}/thumbnail-news`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				},
				body: JSON.stringify({uri: thumbnail})
			})
			const data = await responsePostThumbnailNews.json()
			try{
				let dataItem = await {
					thumbnail: `${url}/files/news/images/${data.id}`,
					...item
				}
				await fetch(`${url}/news`, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': accessToken
					},
					body: JSON.stringify(dataItem)
				})
				await dispatch(publishNewsSuccess(true))
				await dispatch(setLoading({condition: false, process_on: 'publish_news'}))				
			}catch(e){
				dispatch(setFailed({condition: true, message: 'Publish News Failed', detailMessage: e}))
				dispatch(setLoading({condition: false, process_on: 'publish_news'}))
			}
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Publish News Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'fetch_news'}))
		}
	}
}

export const sendComment = (comment, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'send_comment'}))
		try {
			await fetch(`${url}/comments`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				},
				body: JSON.stringify(comment)
			})	
			await sendCommentSuccess(true)
			await dispatch(setLoading({condition: false, process_on: 'send_comment'}))
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Send Comment Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'send_comment'}))
		}
	}
}

export const sendCommentSuccess = (success) => {
	return {
		type: SEND_COMMENT_SUCCESS,
		sendCommentSuccess: success
	}
}

export const fetchComments = (accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'fetch_comments'}))
		try {
			let response = await fetch(`${url}/comments?$limit=50&$sort[createdAt]=-1`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
	
			let data = await response.json()
			await dispatch(fetchCommentsSuccess(data.data))
			await dispatch(setLoading({condition: false, process_on: 'fetch_comments'}))
		}catch(e) {
			dispatch(setFailed({condition: true, message: 'Fetch Comments Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'fetch_comments'}))
		}
	}
}

export const fetchCommentsRealtime = (accessToken) => {
	return (dispatch) => {
		const comments = app.service('comments')
		comments.on('created', () => dispatch(fetchComments(accessToken)))
	}
}

export const fetchCommentsSuccess = (data) => {
	return {
		type: FETCH_COMMENT_SUCCESS,
		fetchCommentsSuccess: data
	}
}

export const publishNewsSuccess = (success) => {
	return {
		type: PUBLISH_NEWS_SUCCESS,
		publishNewsSuccess: success
	}
}

export const addClaps = (id, clapsCount, accessToken) => {
	return async (dispatch) => {
		try {
			await fetch(`${url}/news/${id}`, {
				method: 'PATCH',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				},
				body: JSON.stringify({claps: clapsCount})
			})
			await dispatch(addClapsSuccess(true))
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Add Claps Failed', detailMessage: e}))
		}
	}
}

export const addClapsSuccess = (success) => {
	return {
		type: POST_ADD_CLAPS,
		addClapsSuccess: success
	}
}

export const postJob = (dataJob, accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'post_job'}))
		try {
			await fetch(`${url}/careers`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				},
				body: JSON.stringify(dataJob)
			})
	
			await dispatch(postJobSuccess(true))
			await dispatch(setLoading({condition: false, process_on: 'post_job'}))
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Post Job Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'post_job'}))
		}
	}
}

export const postJobSuccess = (success) => {
	return {
		type: POST_JOB_SUCCESS,
		postJobSuccess: success
	}
}

export const fetchJobs = (accessToken) => {
	return async (dispatch) => {
		await dispatch(setLoading({condition: true, process_on: 'fetch_jobs'}))
		try {
			let response = await fetch(`${url}/careers?$limit=50&$sort[createdAt]=-1`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': accessToken
				}
			})
	
			let data = await response.json()
			await dispatch(fetchJobSuccess(data.data))
			await dispatch(setLoading({condition: false, process_on: 'fetch_jobs'}))
		}catch(e){
			dispatch(setFailed({condition: true, message: 'Fetch Jobs Failed', detailMessage: e}))
			dispatch(setLoading({condition: false, process_on: 'fetch_jobs'}))
		}
	}
}

export const fetchJobRealtime = (accessToken) => {
	return (dispatch) => {
		const jobs = app.service('careers')
		jobs.on('created', () => dispatch(fetchJobs(accessToken)))
	}
}

export const fetchJobSuccess = (success) => {
	return {
		type: FETCH_JOB_SUCCESS,
		fetchJobSuccess: success
	}
}