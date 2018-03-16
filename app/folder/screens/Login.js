import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	Dimensions,
	Image,
	TouchableOpacity,
	Alert,
	BackHandler,
	ToastAndroid
} from 'react-native'
import {
	Container,
	Form,
	Item,
	Input,
	Spinner,
	Button,
	Text
} from 'native-base'
import { isEmpty, isEmail } from 'validator'
import { connect } from 'react-redux'
import { saveSession, savePassword } from '../actions/users'
import ThemeContainer from './ThemeContainer'
import logo from '../assets/images/logo.png'
import { url } from '../server'
import { setSession, setLinkNavigate, setDataUser } from '../actions/processor'

const { height } = Dimensions.get('window')

class Login extends Component<{}> {
	constructor() {
		super()

		this.state = {
			email: '',
			password: '',
			accessToken: '',
			loginLoading: false
		}

		this.validationLogin = this.validationLogin.bind(this)
		this.handleSetEmail = this.handleSetEmail.bind(this)
		this.handleSetPassword = this.handleSetPassword.bind(this)
		this.handleRegister = this.handleRegister.bind(this)
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			return true
		})
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress')
	}

	handleSetEmail(email: string) {
		this.setState({ email })
	}

	handleSetPassword(password: string) {
		this.setState({ password })
	}

	async validationLogin(): any {
		const { email, password } = await this.state
		if (await isEmpty(email)) {
			Alert.alert('', 'Email tidak boleh kosong')
		} else if (await !isEmail(email)) {
			Alert.alert('', 'Masukan email yang valid')
		} else if (await isEmpty(password)) {
			Alert.alert('', 'Password tidak boleh kosong')
		} else {
			try {
				await this.setState({ loginLoading: true })
				const responseAuth = await fetch(`${url}/authentication`, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						strategy: 'local',
						email: email,
						password: password
					})
				})
				const dataAuth = await responseAuth.json()
				if (dataAuth.accessToken !== undefined) {
					const response2 = await fetch(
						`${url}/users?email=${this.state.email}`,
						{
							method: 'GET',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
								Authorization: dataAuth.accessToken
							}
						}
					)
					const dataUser = await response2.json()
					if (dataUser.data[0].verified) {
						await this.props.setSession({
							id: dataUser.data[0].id,
							accessToken: dataAuth.accessToken
						})
						await this.props.saveSession(
							dataUser.data[0].email,
							dataAuth.accessToken
						)
						await this.props.savePassword(password)
						await this.props.setLinkNavigate({ navigate: '', data: '' })
						await this.props.setDataUser(dataUser.data[0])
						await this.props.navigation.navigate('Home')
						await this.setState({ loginLoading: false })
					} else {
						this.setState({ loginFailed: true, loginLoading: false })
						Alert.alert(
							'',
							'Your account in progress approve by adminYour account has not been verified, please wait for admin verification'
						)
					}
				} else {
					this.setState({ loginFailed: true, loginLoading: false })
					Alert.alert('Login gagal', 'Email atau password salah')
				}
			} catch (e) {
				this.setState({ loginFailed: true, loginLoading: false })
				Alert.alert('Login gagal', 'Ada sesuatu yang salah')
			}
		}
	}

	handleRegister() {
		const { navigate } = this.props.navigation
		navigate('Register')
	}

	render(): React.Element<*> {
		return (
			<Container style={styles.container}>
				<View style={styles.viewContainer}>
					<View style={styles.viewImage}>
						<Image source={logo} style={{ width: 183, height: 255 }} />
					</View>
					<Form style={styles.form}>
						<Item regular style={styles.item}>
							<Input
								style={{ fontFamily: 'SourceSansPro' }}
								placeholder="Email"
								onChangeText={this.handleSetEmail}
							/>
						</Item>
						<Item regular style={styles.item}>
							<Input
								style={{ fontFamily: 'SourceSansPro' }}
								placeholder="Password"
								secureTextEntry
								onChangeText={this.handleSetPassword}
							/>
						</Item>
						<View style={styles.viewButton}>
							<Button full style={styles.button} onPress={this.validationLogin}>
								{this.state.loginLoading ? (
									<Spinner color="white" />
								) : (
									<Text style={{ fontFamily: 'SourceSansPro' }}>Login</Text>
								)}
							</Button>
						</View>
					</Form>
				</View>
				<View style={{ marginTop: '10%' }}>
					<TouchableOpacity onPress={this.handleRegister}>
						<Text style={styles.textForgotPassowrd}>
							No have account? Register!
						</Text>
					</TouchableOpacity>
				</View>
			</Container>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setDataUser: data => dispatch(setDataUser(data)),
		setLinkNavigate: navigate => dispatch(setLinkNavigate(navigate)),
		setSession: data => dispatch(setSession(data)),
		saveSession: (email, accessToken) =>
			dispatch(saveSession(email, accessToken)),
		savePassword: password => dispatch(savePassword(password))
	}
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2989d8'
	},
	viewContainer: {
		width: '90%'
	},
	viewImage: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: 10
	},
	item: {
		marginTop: height / 35,
		paddingLeft: 15,
		paddingRight: 15,
		borderRadius: 5,
		backgroundColor: '#FFFFFF'
	},
	form: {
		width: '100%'
	},
	button: {
		marginTop: height / 40,
		marginBottom: height / 45,
		margin: 30,
		borderRadius: 5,
		backgroundColor: '#d35c72'
	},
	textForgotPassowrd: {
		color: '#FFFFFF',
		marginBottom: 20,
		fontFamily: 'SourceSansPro'
	},
	viewIcon: {
		display: 'flex',
		flexDirection: 'row'
	},
	icon: {
		marginRight: 20,
		marginLeft: 20
	}
})

export default connect(null, mapDispatchToProps)(ThemeContainer(Login))
