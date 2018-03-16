import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, Alert, BackHandler } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import { saveSession, editProfileWithAvatar, editProfileWithoutAvatar } from '../../actions/users'
import { Container, Picker, Thumbnail, Badge, Header, Left, Body, Icon, Content, Text, Spinner, Item, Label, Input, Button, Form } from 'native-base'
import ThemeContainer from '../ThemeContainer'
import defaultAvatar from '../../assets/images/default-user.png'
import { connect } from 'react-redux'
import moment from 'moment'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { fetchFaculties, fetchMajors } from '../../actions/users'
import { setLinkNavigate } from '../../actions/processor'

class EditProfile extends Component {
  constructor() {
		super()

		this.state = {
			id: 0,
			name: '',
			avatar: '',
			avatarBase64: '',
			email: '',
			address: '',
			phone: '',
			graduated: '',
			birth: '',
			id_major: 0,
			major: '',
			id_faculty: 0,
			faculty: '',
			facebook: '',
			twitter: '',
			linkedin: '',
			changeUri: false,
			colorDisabled: '#C7C7C7',
			isDateTimePickerVisible: false
		}
	}
  
  componentWillMount() {
		this.props.fetchDataFaculties()
		this.props.fetchDataMajors()
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBack()
    })
	}
	
	componentDidMount() {
		this.setState({
			id: this.props.dataUser.id,
			name: this.props.dataUser.name,
			avatar:  this.props.dataUser.avatar,
			email:  this.props.dataUser.email,
			address: this.props.dataUser.address,
			phone: this.props.dataUser.phone,
			graduated: this.props.dataUser.graduated,
			birth: this.props.dataUser.birth,
			id_major: this.props.dataUser.majors[0].id_major,
			id_faculty: this.props.dataUser.faculties[0].id_faculty,
			facebook:  this.props.dataUser.facebook,
			twitter:  this.props.dataUser.twitter,
			linkedin:  this.props.dataUser.linkedin
		})
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress')
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

  async handleBack() {
    await this.props.setLinkNavigate({navigate: '', data: ''})
    await this.props.navigation.goBack()
  }
  
	async handleSaveProfile() {
		const { id, name, avatarBase64, avatar, email, address, phone, graduated, password, id_major, id_faculty, facebook, twitter, linkedin } = await this.state
		let dataWithAvatar = await { name, avatar: avatarBase64, email, address, phone, graduated, password, id_major, id_faculty, facebook, twitter, linkedin }
		let dataWithoutAvatar = await { name, email, address, phone, graduated, password, id_major, id_faculty, facebook, twitter, linkedin }
		if(this.state.avatarBase64 === '') {
			await this.props.editProfileWithoutAvatar(id, dataWithoutAvatar, this.props.session.accessToken)
		}else{
			await this.props.editProfileWithAvatar(id, avatarBase64, dataWithAvatar, this.props.session.accessToken)
		}
		await Alert.alert('', 'Profile has been updated')
	}

	handleDatePicked(date) {
		this.setState({birth: date, isDateTimePickerVisible: false})
	}
  
	handlePickImage() {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true
			}
		}
    
		ImagePicker.showImagePicker(options, (response) => {
			if(response.didCancel) {
				this.setState({avatarBase64: this.state.avatarBase64})
			}else{
				this.setState({
					avatar: response.uri,
					avatarBase64: `data:image/png;base64,${response.data}`
				})
			}
		})
	}

	render() {
		return (
			<Container style={styles.container}>
				<DateTimePicker
					isVisible={this.state.isDateTimePickerVisible}
					onConfirm={(date) => this.handleDatePicked(date)}
					onCancel={() => this.setState({isDateTimePickerVisible: false})} />
				<Header>
					<Left>
						<Button transparent onPress={() => this.handleBack()}>
							<Icon name='arrow-back' />
						</Button>
					</Left>
					<Body />
				</Header>
				<Content>
					<View style={styles.contentProfile}>
						{(this.state.avatar !== '' || this.state.avatarBase64 !== '') ? (
							<TouchableHighlight onPress={() => this.handlePickImage()}>
								<View>
									<Thumbnail large source={{uri: (this.state.avatarBase64 === '') ?  this.state.avatar :  this.state.avatarBase64}} />
									<Badge style={styles.badge}>
										<Icon name='camera'/>
									</Badge>
								</View>
							</TouchableHighlight>
						) : (
							<TouchableHighlight onPress={() => this.handlePickImage()}>
								<View>
									<Thumbnail large source={defaultAvatar} />
									<Badge style={styles.badge}>
										<Icon name='camera'/>
									</Badge>
								</View>
							</TouchableHighlight>
						)}
					</View>
					<Form>
						<Item stackedLabel>
							<Label>Fullname</Label>
							<Input onChangeText={(name) => this.setState({name})} value={this.state.name} />
						</Item>
						<Item stackedLabel>
							<Label>Email</Label>
							<Input onChangeText={(email) => this.setState({email})} value={this.state.email} />
						</Item>
						<Item stackedLabel>
							<Label>Address</Label>
							<Input onChangeText={(address) => this.setState({address})} value={this.state.address} />
						</Item>
						<Item stackedLabel>
							<Label>Phone</Label>
							<Input onChangeText={(phone) => this.setState({phone})} value={this.state.phone} />
						</Item>
						<Item stackedLabel>
							<Label>Graduated</Label>
							<Input onChangeText={(graduated) => this.setState({graduated})} value={this.state.graduated} />
						</Item>
						<Item stackedLabel onPress={() => this.setState({isDateTimePickerVisible: true})}>
							<Label>Date of Birth</Label>
							<Input disabled onChangeText={(birth) => this.setState({birth})} value={moment(this.state.birth).format('LL')} />
						</Item>
						<View style={{margin: 15}}>
							<Text note style={{color: '#0e0e0e'}}>Major</Text>
							<Picker
								mode="dropdown"
								selectedValue={this.state.id_major}
								onValueChange={(value) => this.onValueChangeMajor(value)}>
								{this.props.dataMajors.map((major, index) => (
									<Item key={index} label={major.major} value={major.id_major} />
								))}
							</Picker>
						</View>
						<View style={{margin: 15}}>
							<Text note style={{color: '#0e0e0e'}}>Faculty</Text>
							<Picker
								mode="dropdown"
								selectedValue={this.state.id_faculty}
								onValueChange={(value) => this.onValueChangeFaculty(value)}>
								{this.props.dataFaculties.map((faculty, index) => (
									<Item key={index} label={faculty.faculty} value={faculty.id_faculty} />
								))}
							</Picker>
						</View>
						<Item stackedLabel>
							<Label>Facebook</Label>
							<Input onChangeText={(facebook) => this.setState({facebook})} value={this.state.facebook} />
						</Item>
						<Item stackedLabel>
							<Label>Twitter</Label>
							<Input onChangeText={(twitter) => this.setState({twitter})} value={this.state.twitter} />
						</Item>
						<Item stackedLabel>
							<Label>Linkedin</Label>
							<Input onChangeText={(linkedin) => this.setState({linkedin})} value={this.state.linkedin} />
						</Item>
					</Form>
					<View style={styles.viewButtonSaveProfile}>
						<Button block rounded onPress={() => this.handleSaveProfile()}>
							{(this.props.loading.condition) ? (
								<Spinner color='#FFFFFF' />
							) : (
								<Text>Save Profile</Text>
							)}
						</Button>
					</View>
				</Content>
			</Container>
		)
	}
}

const mapStateToProps = (state) => ({
	session: state.session,
	dataUser: state.dataUser,
	loading: state.loading,
	dataFaculties: state.dataFaculties,
	dataMajors: state.dataMajors
})

const mapDispatchToProps = (dispatch) => ({
	fetchDataFaculties: () => dispatch(fetchFaculties()),
	fetchDataMajors: () => dispatch(fetchMajors()),
	setLinkNavigate: (navigate) => dispatch(setLinkNavigate(navigate)),
	editProfileWithAvatar: (id, avatar, data, accessToken) => dispatch(editProfileWithAvatar(id, avatar, data, accessToken)),
	editProfileWithoutAvatar: (id, data, accessToken) => dispatch(editProfileWithoutAvatar(id, data, accessToken)),
	saveSession: (id, name, avatar, email, facebook, twitter, linkedin, accessToken) => dispatch(saveSession(id, name, avatar, email, facebook, twitter, linkedin, accessToken))
})

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	},
	contentProfile: {
		display: 'flex',
		height: 100,
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		marginTop: 20
	},
	inputDisabled: {
		color: '#C7C7C7'
	},
	email: {
		fontSize: 15,
		color: '#FFFFFF'
	},
	name: {
		fontSize: 20,
		color: '#FFFFFF'
	},
	viewImage: {
		display: 'flex',
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#2989d8'
	},
	viewImageAvatar: {
		marginTop: 30
	},
	badge: {
		backgroundColor: '#EAEAEA',
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	viewButtonSaveProfile: {
		margin: 10
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeContainer(EditProfile))