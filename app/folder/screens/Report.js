import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, BackHandler, Alert } from 'react-native'
import {
	Container,
	Header,
	Title,
	Spinner,
	Picker,
	Text,
	Input,
	Left,
	Button,
	Icon,
	Body,
	Right,
	Content,
	Form,
	Item,
	Label
} from 'native-base'
import { connect } from 'react-redux'
import Mailer from 'react-native-mail'
import ThemeContainer from '../screens/ThemeContainer'
import moment from 'moment'
import DateTimePicker from 'react-native-modal-datetime-picker'
import {
	sendReport,
	fetchFaculties,
	fetchMajors,
	registerManual
} from '../actions/users'

const { width, height } = Dimensions.get('window')

class Report extends Component {
	constructor() {
		super()

		this.state = {
			subject: '',
			fullname: '',
			id_faculty: 1,
			id_major: 1,
			nim: 0,
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
			subjectStatus: false,
			isDateTimePickerVisible: false
		}
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			this.handleBackButton()
			return true
		})

		this.props.fetchDataMajors()
		this.props.fetchDataFaculties()
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress')
	}

	handleBackButton() {
		this.props.navigation.goBack()
	}

	handleSendReport() {
		Alert.alert(
			'Send report',
			'Are you sure to send report?',
			[
				{ text: 'Cancel', onPress: () => {}, style: 'cancel' },
				{ text: 'Send', onPress: () => this.handleSendReportToServer() }
			],
			{ cancelable: false }
		)
	}

	async handleSendReportOk() {
		const { fullname, subject, contentreport } = await this.state
		await Mailer.mail(
			{
				subject: this.state.subject,
				recipients: ['helptrisakticonnect@gmail.com'],
				ccRecipients: [],
				bccRecipients: [],
				body: JSON.stringify(`
        Name: ${this.state.fullname}
        Batch: ${this.state.graduated}

        ${this.state.contentreport}
      `),
				isHTML: true
			},
			(error, event) => {}
		)
		await this.setState({
			graduated: '',
			fullname: '',
			subject: '',
			contentreport: ''
		})
	}

	async handleSendReportToServer() {
		const {
			email,
			graduated,
			fullname,
			subject,
			id_major,
			id_faculty
		} = await this.state
		if (graduated === '' && fullname === '' && subject === '') {
			Alert.alert('Complete form', 'Please complete form value')
		} else {
			await this.props.sendReport({
				email,
				graduated,
				fullname,
				subject,
				id_major,
				id_faculty
			})
			await this.handleRegister()
			await this.handleSendReportOk()
		}
	}

	handleDatePicked(date) {
		this.setState({ birth: date, isDateTimePickerVisible: false })
	}

	handleRegister() {
		this.props.registerManual(this.state)
	}

	render() {
		return (
			<Container style={styles.container}>
				<DateTimePicker
					isVisible={this.state.isDateTimePickerVisible}
					onConfirm={date => this.handleDatePicked(date)}
					onCancel={() => this.setState({ isDateTimePickerVisible: false })}
				/>
				<Header>
					<Left>
						<Button transparent onPress={() => this.handleBackButton()}>
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
						<Item stackedLabel style={styles.itemSubject}>
							<Label>Report Subject</Label>
							<Input
								value={this.state.subject}
								onChangeText={subject => this.setState({ subject })}
							/>
						</Item>
						<Item stackedLabel style={styles.viewItemContent}>
							<Label>Full name</Label>
							<Input
								value={this.state.fullname}
								onChangeText={fullname => this.setState({ fullname })}
							/>
						</Item>
						<Item stackedLabel style={styles.viewItemContent}>
							<Label>Batch</Label>
							<Input
								keyboardType="numeric"
								value={this.state.graduated}
								onChangeText={graduated => this.setState({ graduated })}
							/>
						</Item>
						<View style={styles.viewSubject}>
							<Text note style={styles.textSubject}>
								Faculty
							</Text>
							<Picker
								mode="dropdown"
								selectedValue={this.state.id_faculty}
								onValueChange={id_faculty => this.setState({ id_faculty })}>
								{this.props.dataFaculties.map((data, index) => (
									<Item
										key={index}
										label={data.faculty}
										value={data.id_faculty}
									/>
								))}
							</Picker>
						</View>
						<View style={styles.viewSubject}>
							<Text note style={styles.textSubject}>
								Major
							</Text>
							<Picker
								mode="dropdown"
								selectedValue={this.state.id_major}
								onValueChange={id_major => this.setState({ id_major })}>
								{this.props.dataMajors.map((data, index) => (
									<Item key={index} label={data.major} value={data.id_major} />
								))}
							</Picker>
						</View>
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
							<Label style={styles.label}>Password</Label>
							<Input
								secureTextEntry
								style={styles.input}
								value={this.state.password}
								onChangeText={password => this.setState({ password })}
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
							onPress={() => this.setState({ isDateTimePickerVisible: true })}>
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
					</Form>
					<View style={styles.viewButtonSendReport}>
						<Button block onPress={() => this.handleSendReport()}>
							{this.props.loadingCondition ? (
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
}

const mapStateToProps = state => ({
	dataMajors: state.dataMajors,
	dataFaculties: state.dataFaculties,
	loadingCondition: state.loading.condition
})

const mapDispatchToProps = dispatch => ({
	sendReport: data => dispatch(sendReport(data)),
	fetchDataFaculties: () => dispatch(fetchFaculties()),
	fetchDataMajors: () => dispatch(fetchMajors()),
	registerManual: data => dispatch(registerManual(data))
})

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	},
	textSubject: {
		color: '#0e0e0e'
	},
	viewSubject: {
		margin: 15
	},
	itemSubject: {
		marginTop: 10
	},
	viewItemContent: {
		marginTop: 10,
		marginBottom: 10
	},
	viewButtonSendReport: {
		margin: 10,
		marginLeft: width / 4,
		marginRight: width / 4
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(
	ThemeContainer(Report)
)
