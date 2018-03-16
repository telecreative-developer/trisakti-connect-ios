import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	Alert,
	Image,
	BackHandler,
	Dimensions,
	TouchableHighlight
} from 'react-native'
import { connect } from 'react-redux'
import { isEmpty, isEmail } from 'validator'
import Mailer from 'react-native-mail'
import {
	fetchFaculties,
	fetchMajors,
	fetchUserWithNim,
	userWithNim,
	register,
	sendReport,
	registerManual
} from '../../actions/users'
import {
	Container,
	Header,
	Input,
	Footer,
	Picker,
	Spinner,
	Item,
	H2,
	Form,
	Title,
	Text,
	Label,
	Body,
	Icon,
	Left,
	Right,
	Button,
	Content
} from 'native-base'
import ThemeContainer from '../ThemeContainer'
import moment from 'moment'
import DateTimePicker from 'react-native-modal-datetime-picker'
import welcomeImage from '../../assets/images/welcome.png'
import { setLoading, setFailed } from '../../actions/processor'
import { url } from '../../server'

const { width, height } = Dimensions.get('window')

class Register extends Component {
	constructor() {
		super()

		this.state = {
			registerPage: '',
			id: '',
			id_faculty: 1,
			id_major: 1,
			nim: '',
			name: '',
			email: '',
			phone: '',
			address: '',
			kecamatan: '',
			kelurahan: '',
			provinsi: '',
			postcode: '',
			gender: 1,
			birth: moment(),
			birth_place: '',
			avatar: '',
			password: '',
			graduated: '',
			subject: 'I have a problem with my id (NIM)',
			subjectStatus: false,
			contentreport: '',
			isDateTimePickerVisible: false,
			disabledNim: true,
			disabledName: true
		}

		this.onValueChangeFaculty = this.onValueChangeFaculty.bind(this)
		this.onValueChangeMajor = this.onValueChangeMajor.bind(this)
		this.handleValidationRegister2 = this.handleValidationRegister2.bind(this)
		this.handleValidationRegister3 = this.handleValidationRegister3.bind(this)
		this.handleBackButton = this.handleBackButton.bind(this)
		this.handlePressReport = this.handlePressReport.bind(this)
		this.handleSendReport = this.handleSendReport.bind(this)
	}

	componentWillMount() {
		const { goBack } = this.props.navigation
		this.props.fetchDataFaculties()
		this.props.fetchDataMajors()

		BackHandler.addEventListener('hardwarebackPress', () => {
			goBack()
			return true
		})
	}

	onValueChangeFaculty(value) {
		this.setState({
			id_faculty: value
		})
	}

	onValueChangeMajor(value) {
		this.setState({
			id_major: value
		})
	}

	handlePressReport() {
		this.props.navigation.navigate('Report')
	}

	handleSendReport() {
		Alert.alert(
			'Send report',
			'Are you sure to send report?',
			[
				{ text: 'Cancel', onPress: () => {}, style: 'cancel' },
				{ text: 'Send', onPress: () => this.handleSendReportOk() }
			],
			{ cancelable: false }
		)
	}

	async handleSendReportOk() {
		const { subject, contentreport } = await this.state
		await Mailer.mail(
			{
				subject: this.state.subject,
				recipients: ['helptrisakticonnect@gmail.com'],
				ccRecipients: [],
				bccRecipients: [],
				body: this.state.contentreport,
				isHTML: true
			},
			(error, event) => {}
		)
		await this.setState({ subject: '', contentreport: '' })
	}

	async handleCheckNim() {
		if (isEmpty(this.state.nim)) {
			Alert.alert('', 'Masukan NIM')
		} else {
			await this.props.setLoading({
				condition: true,
				process_on: 'fetch_user_with_nim'
			})
			try {
				let response = await fetch(
					`${url}/users?nim=${this.state.nim}&password=1`,
					{
						method: 'GET',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						}
					}
				)

				let data = await response.json()
				if (data.data.length === 1) {
					await this.setState({
						id: data.data[0].id,
						name: data.data[0].name,
						email: data.data[0].email,
						phone: data.data[0].phone,
						address: data.data[0].address,
						kecamatan: data.data[0].kecamatan,
						kelurahan: data.data[0].kelurahan,
						provinsi: data.data[0].provinsi,
						postcode: data.data[0].postcode,
						gender: data.data[0].gender,
						birth: data.data[0].birth,
						birth_place: data.data[0].birth_place,
						registerPage: 'register1'
					})
					await this.props.setLoading({
						condition: false,
						process_on: 'fetch_user_with_nim'
					})
					await this.setState({ registerPage: 'register1' })
				} else {
					await this.props.setLoading({
						condition: false,
						process_on: 'fetch_user_with_nim'
					})
					await Alert.alert(
						'Register Failed',
						`User with NIM: ${
							this.state.nim
						} not found or has been registered. Are you want to register?`,
						[
							{
								text: 'CANCEL',
								onPress: () => {},
								style: 'cancel'
							},
							{
								text: 'REGISTER',
								onPress: () =>
									this.setState({
										registerPage: 'register1',
										disabledNim: false,
										disabledName: false
									})
							}
						],
						{ cancelable: false }
					)
				}
			} catch (e) {
				await this.props.setLoading({
					condition: false,
					process_on: 'fetch_user_with_nim'
				})
				await Alert.alert('Register Failed', `Fetch User with NIM Failed`)
			}
		}
	}

	handleValidationRegister2() {
		const {
			nim,
			name,
			email,
			phone,
			address,
			kecamatan,
			kelurahan,
			provinsi,
			postcode,
			birth,
			birth_place
		} = this.state
		if (isEmpty(nim)) {
			Alert.alert('', 'Masukan nim')
		} else if (isEmpty(name)) {
			Alert.alert('', 'Masukan nama lengkap')
		} else if (isEmpty(email)) {
			Alert.alert('', 'Masukan email')
		} else if (!isEmail(email)) {
			Alert.alert('', 'Masukan email yang benar')
		} else if (isEmpty(phone)) {
			Alert.alert('', 'Masukan no telpon')
		} else if (isEmpty(address)) {
			Alert.alert('', 'Masukan alamat')
		} else if (isEmpty(kecamatan)) {
			Alert.alert('', 'Masukan kecamatan')
		} else if (isEmpty(kelurahan)) {
			Alert.alert('', 'Masukan kelurah')
		} else if (isEmpty(provinsi)) {
			Alert.alert('', 'Masukan provinsi')
		} else if (isEmpty(postcode)) {
			Alert.alert('', 'Masukan kode pos')
		} else if (isEmpty(birth_place)) {
			Alert.alert('', 'Masukan tempat lahir')
		} else {
			this.setState({ registerPage: 'register2' })
		}
	}

	handleValidationRegister3() {
		const { navigate } = this.props.navigation
		const { graduated, id_faculty, id_major, password } = this.state
		if (isEmpty(graduated)) {
			Alert.alert('', 'Masukan angkatan')
		} else if (isEmpty(JSON.stringify(id_faculty))) {
			Alert.alert('', 'Masukan fakultas')
		} else if (isEmpty(JSON.stringify(id_major))) {
			Alert.alert('', 'Masukan major')
		} else if (isEmpty(password)) {
			Alert.alert('', 'Masukan kata sandi')
		} else {
			const {
				registerPage,
				contentreport,
				subject,
				subjectStatus,
				id,
				...stateData
			} = this.state
			if (
				this.state.disabledNim === false &&
				this.state.disabledName === false
			) {
				this.props.registerManual(stateData)
				navigate('Login')
			} else {
				this.props.registerUser(id, stateData)
				navigate('Login')
			}
		}
	}

	handleBackButton() {
		const { goBack } = this.props.navigation
		goBack()
	}

	handleDatePicked(date) {
		this.setState({ birth: date, isDateTimePickerVisible: false })
	}

	render() {
		if (this.state.registerPage === 'thankyou') {
			return (
				<Container style={styles.container}>
					<View
						style={{
							flex: 1,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}>
						<H2
							style={{
								fontWeight: 'bold',
								marginBottom: 20,
								fontFamily: 'SourceSansPro'
							}}>
							Thank You for Register!
						</H2>
						<Image source={welcomeImage} />
						<View style={{ paddingLeft: 5, paddingRight: 5 }}>
							<Text
								style={{
									textAlign: 'center',
									marginTop: 20,
									color: '#111',
									fontFamily: 'SourceSansPro',
									fontSize: 14
								}}>
								Welcome on Trisakti Connect. For the next step, we will send an
								email to your account to provide you confirmation your email
								address.
							</Text>
						</View>
						<Button
							full
							style={{ margin: 20 }}
							onPress={this.handleValidationRegister3}>
							<Text style={styles.input}>Submit & Login</Text>
						</Button>
					</View>
				</Container>
			)
		}

		if (this.state.registerPage === 'register1') {
			return (
				<Container style={styles.container}>
					<DateTimePicker
						isVisible={this.state.isDateTimePickerVisible}
						onConfirm={date => this.handleDatePicked(date)}
						onCancel={() => this.setState({ isDateTimePickerVisible: false })}
					/>
					<Header>
						<Left>
							<Button
								transparent
								onPress={() => this.setState({ registerPage: '' })}>
								<Icon name="arrow-back" />
							</Button>
						</Left>
						<Body>
							<Title>Registration</Title>
						</Body>
						<Right />
					</Header>
					<Content>
						<Form>
							<Item stackedLabel>
								<Label style={styles.label}>Nim</Label>
								<Input
									disabled={this.state.disabledNim}
									value={this.state.nim}
									onChangeText={nim => this.setState({ nim })}
									style={[
										styles.inputDisabled,
										{ color: this.state.disabledNim ? '#757575' : '#000000' }
									]}
								/>
							</Item>
							<Item stackedLabel>
								<Label style={styles.label}>Fullname</Label>
								<Input
									disabled={this.state.disabledName}
									value={this.state.name}
									onChangeText={name => this.setState({ name })}
									style={[
										styles.inputDisabled,
										{ color: this.state.disabledName ? '#757575' : '#000000' }
									]}
								/>
							</Item>
							<Item stackedLabel>
								<Label style={styles.label}>Email</Label>
								<Input
									style={styles.input}
									keyboardType="email-address"
									value={this.state.email}
									onChangeText={email => this.setState({ email })}
								/>
							</Item>
							<Item stackedLabel>
								<Label style={styles.label}>Phone</Label>
								<Input
									style={styles.input}
									keyboardType="numeric"
									value={this.state.phone}
									onChangeText={phone => this.setState({ phone })}
								/>
							</Item>
							{this.state.disabledNim === false &&
								this.state.disabledName === false && (
									<View style={{ margin: 15 }}>
										<Text
											note
											style={{
												color: '#0e0e0e',
												fontFamily: 'SourceSansPro',
												fontSize: 14
											}}>
											Gender
										</Text>
										<Picker
											mode="dropdown"
											selectedValue={this.state.gender}
											onValueChange={gender => this.setState({ gender })}>
											<Item label="Male" value={1} />
											<Item label="Female" value={2} />
										</Picker>
									</View>
								)}
							<Item stackedLabel>
								<Label style={styles.label}>Address</Label>
								<Input
									style={styles.input}
									value={this.state.address}
									onChangeText={address => this.setState({ address })}
								/>
							</Item>
							<Item stackedLabel>
								<Label style={styles.label}>Sub-district</Label>
								<Input
									style={styles.input}
									value={this.state.kecamatan}
									onChangeText={kecamatan => this.setState({ kecamatan })}
								/>
							</Item>
							<Item stackedLabel>
								<Label style={styles.label}>Urban Village</Label>
								<Input
									style={styles.input}
									value={this.state.kelurahan}
									onChangeText={kelurahan => this.setState({ kelurahan })}
								/>
							</Item>
							<Item stackedLabel>
								<Label style={styles.label}>Province</Label>
								<Input
									style={styles.input}
									value={this.state.provinsi}
									onChangeText={provinsi => this.setState({ provinsi })}
								/>
							</Item>
							<Item stackedLabel>
								<Label style={styles.label}>Postcode</Label>
								<Input
									style={styles.input}
									keyboardType="numeric"
									value={this.state.postcode}
									onChangeText={postcode => this.setState({ postcode })}
								/>
							</Item>
							<Item
								stackedLabel
								onPress={() =>
									this.setState({ isDateTimePickerVisible: true })
								}>
								<Label style={styles.label}>Date of Birth</Label>
								<Input
									style={styles.input}
									disabled
									value={moment(this.state.birth).format('LL')}
									onChangeText={birth => this.setState({ birth })}
								/>
							</Item>
							<Item stackedLabel>
								<Label style={styles.label}>Place of Birth</Label>
								<Input
									style={styles.input}
									value={this.state.birth_place}
									onChangeText={birth_place => this.setState({ birth_place })}
								/>
							</Item>
							<View style={styles.viewButton}>
								<Button block onPress={this.handleValidationRegister2}>
									<Text style={styles.input}>Next</Text>
								</Button>
							</View>
						</Form>
					</Content>
				</Container>
			)
		}

		if (this.state.registerPage === 'register2') {
			return (
				<Container style={styles.container}>
					<Header>
						<Left>
							<Button
								transparent
								onPress={() => this.setState({ registerPage: 'register1' })}>
								<Icon name="arrow-back" />
							</Button>
						</Left>
						<Body>
							<Title>Registration</Title>
						</Body>
						<Right />
					</Header>
					<Content>
						<Form>
							<Item stackedLabel>
								<Label style={styles.label}>Angkatan</Label>
								<Input
									style={styles.input}
									keyboardType="numeric"
									value={this.state.graduated}
									onChangeText={graduated => this.setState({ graduated })}
								/>
							</Item>
							<View style={{ margin: 15 }}>
								<Text
									note
									style={{
										color: '#0e0e0e',
										fontFamily: 'SourceSansPro',
										fontSize: 14
									}}>
									Pilih Fakultas
								</Text>
								<Picker
									mode="dropdown"
									selectedValue={this.state.id_faculty}
									onValueChange={this.onValueChangeFaculty}>
									{this.props.dataFaculties.map((faculty, index) => (
										<Item
											key={index}
											label={faculty.faculty}
											value={faculty.id_faculty}
										/>
									))}
								</Picker>
							</View>
							<View style={{ margin: 15 }}>
								<Text
									note
									style={{
										color: '#0e0e0e',
										fontFamily: 'SourceSansPro',
										fontSize: 14
									}}>
									Pilih Jurusan
								</Text>
								<Picker
									mode="dropdown"
									selectedValue={this.state.id_major}
									onValueChange={this.onValueChangeMajor}>
									{this.props.dataMajors.map((major, index) => (
										<Item
											key={index}
											label={major.major}
											value={major.id_major}
										/>
									))}
								</Picker>
							</View>
							<Item stackedLabel>
								<Label style={styles.label}>Kata Sandi</Label>
								<Input
									secureTextEntry
									value={this.state.password}
									onChangeText={password => this.setState({ password })}
								/>
							</Item>
							<View style={styles.viewButton}>
								<Button
									block
									onPress={() => this.setState({ registerPage: 'thankyou' })}>
									{this.props.loading.condition ? (
										<Spinner color="white" />
									) : (
										<Text style={styles.label}>Register</Text>
									)}
								</Button>
							</View>
						</Form>
					</Content>
				</Container>
			)
		}

		if (this.state.registerPage === 'report') {
			return (
				<Container style={styles.container}>
					<Header>
						<Left>
							<Button
								transparent
								onPress={() => this.setState({ registerPage: '' })}>
								<Icon name="arrow-back" />
							</Button>
						</Left>
						<Body>
							<Title>Report</Title>
						</Body>
						<Right />
					</Header>
					<Content>
						<Form>
							{this.state.subjectStatus ? (
								<Item stackedLabel style={{ marginTop: 10 }}>
									<Label>Subject</Label>
									<Input
										value={this.state.subject}
										onChangeText={subject => this.setState({ subject })}
									/>
								</Item>
							) : (
								<View style={{ margin: 15 }}>
									<Text note style={{ color: '#0e0e0e' }}>
										Subject
									</Text>
									<Picker
										mode="dropdown"
										selectedValue={this.state.subject}
										onValueChange={subject =>
											subject === 'other'
												? this.setState({ subject: '', subjectStatus: true })
												: this.setState({ subject })
										}>
										<Item
											label="I have a problem with my id (NIM)"
											value="I have a problem with my id (NIM)"
										/>
										<Item
											label="I forgot my email or password"
											value="I forgot my email or password"
										/>
										<Item
											label="My NIM seems right but I can't register my account"
											value="My NIM seems right but I can't register my account"
										/>
										<Item
											label="I found a bug inside this application"
											value="I found a bug inside this application"
										/>
										<Item label="Other" value="other" />
									</Picker>
								</View>
							)}
							<Item stackedLabel style={{ marginTop: 10, marginBottom: 10 }}>
								<Label>Content report</Label>
								<Input
									value={this.state.contentreport}
									onChangeText={contentreport =>
										this.setState({ contentreport })
									}
									multiline
									numberOfLines={4}
								/>
							</Item>
						</Form>
						<View
							style={{
								margin: 10,
								marginLeft: width / 4,
								marginRight: width / 4
							}}>
							<Button
								block
								style={{ borderRadius: 5 }}
								onPress={this.handleSendReport}>
								{this.props.loading.condition ? (
									<Spinner color="white" />
								) : (
									<Text>Send Report</Text>
								)}
							</Button>
						</View>
					</Content>
				</Container>
			)
		}

		return (
			<Container style={styles.container}>
				<Header>
					<Left>
						<Button transparent onPress={this.handleBackButton}>
							<Icon name="arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Registration</Title>
					</Body>
					<Right />
				</Header>
				<View style={styles.viewContainer}>
					<View style={{ marginBottom: 15 }}>
						<Text style={{ fontSize: 12, fontFamily: 'SourceSansPro' }}>
							*Do not follow the number '0' in front of your NIM
						</Text>
					</View>
					<View style={styles.viewInput}>
						<Item regular style={styles.item}>
							<Input
								style={{ fontFamily: 'SourceSansPro' }}
								placeholder="Input NIM..."
								value={this.state.nim}
								onChangeText={nim => this.setState({ nim })}
							/>
						</Item>
					</View>
					<View style={styles.viewButton}>
						<Button
							block
							style={{ borderRadius: 5, margin: 10 }}
							onPress={() => this.handleCheckNim()}>
							{this.props.loading.condition ? (
								<Spinner color="white" />
							) : (
								<Text style={{ fontFamily: 'SourceSansPro' }}>Check Nim</Text>
							)}
						</Button>
					</View>
				</View>
				<Footer style={{ backgroundColor: 'transparent' }}>
					<TouchableHighlight onPress={this.handlePressReport}>
						<Text style={{ fontFamily: 'SourceSansPro', fontSize: 16 }}>
							Forgot nim or have problem a register? Send Report.
						</Text>
					</TouchableHighlight>
				</Footer>
			</Container>
		)
	}
}

const mapStateToProps = state => ({
	dataFaculties: state.dataFaculties,
	dataMajors: state.dataMajors,
	dataUserWithNim: state.fetchUserWithNim,
	failed: state.failed,
	loading: state.loading
})

const mapDispatchToProps = dispatch => ({
	setLoading: data => dispatch(setLoading(data)),
	setFailed: data => dispatch(setFailed(data)),
	userWithNim: data => dispatch(userWithNim(data)),
	sendReport: data => dispatch(sendReport(data)),
	fetchDataFaculties: () => dispatch(fetchFaculties()),
	fetchDataMajors: () => dispatch(fetchMajors()),
	fetchUserWithNim: nim => dispatch(fetchUserWithNim(nim)),
	registerManual: user => dispatch(registerManual(user)),
	registerUser: (id, user) => dispatch(register(id, user))
})

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	},
	viewContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	viewInput: {
		width: '90%'
	},
	item: {
		paddingLeft: 5,
		paddingRight: 5,
		borderRadius: 5
	},
	viewButton: {
		margin: 10,
		flexDirection: 'row'
	},
	inputDisabled: {
		fontSize: 14,
		fontFamily: 'SourceSansPro'
	},
	label: {
		fontFamily: 'SourceSansPro'
	},
	input: {
		fontFamily: 'SourceSansPro',
		fontSize: 14
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(
	ThemeContainer(Register)
)
