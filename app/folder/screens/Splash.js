import React, { Component } from 'react'
import { Image, StyleSheet, View, AsyncStorage, Alert, StatusBar, Dimensions, AppState } from 'react-native'
import { saveSession, savePassword } from '../actions/users'
import { connect } from 'react-redux'
import { url } from '../server'
import LinearGradient from 'react-native-linear-gradient'
import logo from '../assets/images/logo.png'
import supported from '../assets/images/supportedby.png'
import { setSession, setDataUser } from '../actions/processor'

const { height } = Dimensions.get('window')

class Splash extends Component {
	componentDidMount() {
		const { navigate } = this.props.navigation
		setTimeout(async () => {
			const responseSession = await AsyncStorage.getItem('session')
			const responsePassword = await AsyncStorage.getItem('password')
			const dataSession = await JSON.parse(responseSession)
			const dataPassword = await JSON.parse(responsePassword)
			if(dataSession !== null && dataPassword !== null) {
				try {
					await this.setState({loginLoading: true})
					const responseAuth = await fetch(`${url}/authentication`, {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({strategy: 'local', email: dataSession.email, password: dataPassword.password})
					})
					const dataAuth = await responseAuth.json()
					if(dataAuth.accessToken !== undefined) {
						const response2 = await fetch(`${url}/users?email=${dataSession.email}`, {
							method: 'GET',
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'Authorization': dataAuth.accessToken
							}
						})
						const dataUser = await response2.json()
						await this.props.setSession({id: dataUser.data[0].id, accessToken: dataAuth.accessToken})
						await this.props.saveSession(dataUser.data[0].email, dataAuth.accessToken)
						await this.props.savePassword(dataPassword.password)
						await this.props.setDataUser(dataUser.data[0])
						await navigate('Home')
						await this.setState({loginLoading: false})
					}else{
						this.setState({loginFailed: true})
						this.setState({loginLoading: false})
						Alert.alert('Gagal', 'Ada sesuatu yang salah')
					}
				}catch(e) {
					this.setState({loginFailed: true})
					this.setState({loginLoading: false})
					Alert.alert('Gagal', 'Ada sesuatu yang salah')
				}
			}else{
				await navigate('Login')
			}
		}, 1000)
	}

	render() {
		return (
			<LinearGradient colors={['#59a8e5','#2989d8', '#1e5799']} style={styles.linearGradient}>
				<StatusBar
					backgroundColor='#2989d8'
					barStyle='light-content' />
				<Image source={logo} style={{width:183, height:255 }} />
				<View style={{marginTop: height / 6}}>
					<Image source={supported} />
				</View>
			</LinearGradient>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setSession: (data) => dispatch(setSession(data)),
		saveSession: (email, accessToken) => dispatch(saveSession(email, accessToken)),
		savePassword: (password) => dispatch(savePassword(password)),
		setDataUser: (dataUser) => dispatch(setDataUser(dataUser)),
		fetchDataFaculties: () => dispatch(fetchFaculties()),
		fetchDataMajors: () => dispatch(fetchMajors())
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#2367A9',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	linearGradient: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
})

export default connect(null, mapDispatchToProps)(Splash)