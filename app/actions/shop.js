import { url } from '../server'
import { FETCH_SHOP_CATEGORY, FETCH_ADS, FETCH_SHOP, FETCH_SHOP_WITH_CATEGORY } from '../constants'
import { setLoading, setFailed } from './processor'

export const postShop = (item, accessToken) => {
	return async dispatch => {
		await dispatch(setLoading({ condition: true, process_on: 'post_shop' }))
		try {
			const responseImage = await fetch(`${url}/product-images`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: accessToken
				},
				body: JSON.stringify({ uri: item.cover })
			})
			const dataImage = await responseImage.json()
			await fetch(`${url}/shop`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: accessToken
				},
				body: JSON.stringify({
					...item,
					cover: `${url}/files/shop/images/${dataImage.id}`
				})
			})
			await dispatch(fetchShop(accessToken))
			await dispatch(setLoading({ condition: false, process_on: 'post_shop' }))
		} catch (e) {
			dispatch(setFailed({ condition: true, message: 'Post Shop Failed', detailMessage: e }))
			dispatch(setLoading({ condition: false, process_on: 'post_shop' }))
		}
	}
}

export const fetchShop = accessToken => {
	return async dispatch => {
		await dispatch(setLoading({ condition: true, process_on: 'fetch_shop' }))
		try {
			const response = await fetch(`${url}/shop?$limit=10&$sort[createdAt]=-1`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: accessToken
				}
			})
			const data = await response.json()
			await dispatch(fetchShopSuccess(data.data))
			await dispatch(setLoading({ condition: false, process_on: 'fetch_shop' }))
		} catch (e) {
			dispatch(setFailed({ condition: true, message: 'Fetch Shop Failed', detailMessage: e }))
			dispatch(setLoading({ condition: false, process_on: 'fetch_shop' }))
		}
	}
}

const fetchShopSuccess = data => {
	return {
		type: FETCH_SHOP,
		payload: data
	}
}

export const fetchShopWithCategory = (shopcategory_id, accessToken) => {
	return async dispatch => {
		await dispatch(setLoading({ condition: true, process_on: 'fetch_shop' }))
		try {
			const response = await fetch(
				`${url}/shop?shopcategory_id=${shopcategory_id}&$sort[createdAt]=-1`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: accessToken
					}
				}
			)
			const data = await response.json()
			await dispatch(fetchShopWithCategorySuccess(data.data))
			await dispatch(setLoading({ condition: false, process_on: 'fetch_shop' }))
		} catch (e) {
			dispatch(setFailed({ condition: true, message: 'Fetch Shop Failed', detailMessage: e }))
			dispatch(setLoading({ condition: false, process_on: 'fetch_shop' }))
		}
	}
}

const fetchShopWithCategorySuccess = data => {
	return {
		type: FETCH_SHOP_WITH_CATEGORY,
		payload: data
	}
}

export const fetchAds = accessToken => {
	return async dispatch => {
		await dispatch(setLoading({ condition: true, process_on: 'fetch_ads' }))
		try {
			const response = await fetch(`${url}/ads?$sort[createdAt]=-1`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: accessToken
				}
			})
			const data = await response.json()
			await dispatch(fetchAdsSuccess(data.data))
			await dispatch(setLoading({ condition: false, process_on: 'fetch_ads' }))
		} catch (e) {
			dispatch(setFailed({ condition: true, message: 'Fetch Ads Failed', detailMessage: e }))
			dispatch(setLoading({ condition: false, process_on: 'fetch_ads' }))
		}
	}
}

const fetchAdsSuccess = data => {
	return {
		type: FETCH_ADS,
		payload: data
	}
}

export const fetchShopCategory = accessToken => {
	return async dispatch => {
		await dispatch(setLoading({ condition: true, process_on: 'fetch_shop_category' }))
		try {
			const response = await fetch(`${url}/shopcategory?$sort[createdAt]=-1`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: accessToken
				}
			})
			const data = await response.json()
			await dispatch(fetchShopCategorySuccess(data.data))
			await dispatch(setLoading({ condition: false, process_on: 'fetch_shop_category' }))
		} catch (e) {
			dispatch(
				setFailed({
					condition: true,
					message: 'Fetch Shop Category Failed',
					detailMessage: e
				})
			)
			dispatch(setLoading({ condition: false, process_on: 'fetch_shop_category' }))
		}
	}
}

const fetchShopCategorySuccess = data => {
	return {
		type: FETCH_SHOP_CATEGORY,
		payload: data
	}
}
