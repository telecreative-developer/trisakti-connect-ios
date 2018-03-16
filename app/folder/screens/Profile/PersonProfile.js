import React, { Component } from 'react'
import { StyleSheet, View, BackHandler } from 'react-native'
import { connect } from 'react-redux'
import { Container, Header, Left, Form, Item, Label, Input, Button, Spinner, Body, Content, Thumbnail, Text, Icon, Right, Title, List, ListItem } from 'native-base'
import { sendRequestFriend, checkFriendStatus } from '../../actions/users'
import ThemeContainer from '../ThemeContainer'
import { setLinkNavigate } from '../../actions/processor'
import defaultPhotoProfile from '../../assets/images/default-user.png'

class PersonProfile extends Component {
	constructor() {
		super()
    
		this.state = {
			checkFriendStatusSuccess: ''
		}

		this.handleSendFriendRequest = this.handleSendFriendRequest.bind(this)
  }
  
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBack()
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress')
  }

	async componentDidMount() {
		const { params } = await this.props.navigation.state
		const { session } = await this.props
    await this.props.checkFriendStatus(session.id, params.id, session.accessToken)
	}

	async handleBack() {
		await this.props.navigation.goBack()
		await this.props.setLinkNavigate({navigate: '', data: ''})
	}
  
	handleSendFriendRequest() {
		const { params } = this.props.navigation.state
		let data = {id: this.props.session.id, request_to: params.id, status: this.state.status}
		this.props.sendRequestFriend(data, this.props.session.accessToken)
		this.setState({checkFriendStatusSuccess: 'FriendRequested'})
	}

	handleOpenChat(data) {
		this.props.setLinkNavigate({navigate: 'ModeChatting', data: data})
	}

	renderButton() {
		if(this.props.loading.condition === true && this.props.loading.process_on === 'check_friend_status') {
			return (
				<Button iconLeft small style={[styles.buttonFriend, {justifyContent: 'center', width: '40%'}]}>
					<Spinner color='#FFFFFF' />
				</Button>
			)
		}else if(this.props.checkFriendStatusSuccess === 'FriendRequested') {
			return (
				<Button bordered iconLeft small style={styles.buttonFriend}>
					<Icon name='checkmark' />
					<Text style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Requested</Text>
				</Button>
			)
		}else if(this.props.checkFriendStatusSuccess === 'Friend') {
			return (
				<Button bordered iconLeft small style={styles.buttonFriend}>
					<Icon name='done-all' />
					<Text style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Friend</Text>
				</Button>
			)
		}else if(this.props.checkFriendStatusSuccess === 'NotFriend') {
			return (
				<Button iconLeft small onPress={this.handleSendFriendRequest} style={styles.buttonFriend}>
					<Icon name='person-add' />
					<Text style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Add Friend</Text>
				</Button>
			)
		}
	}

	renderFacebookView() {
		const { params } = this.props.navigation.state
		if(params.facebook !== '') {
			return <Input value={`https://facebook.com/${params.facebook}`} style={styles.inputDisabled} disabled />
		}else{
			return <Input value={`Not Found`} style={styles.inputDisabled} disabled />
		}
	}

	renderTwitterView() {
		const { params } = this.props.navigation.state
		if(params.facebook !== '') {
			return <Input value={`https://facebook.com/${params.facebook}`} style={styles.inputDisabled} disabled />
		}else{
			return <Input value={`Not Found`} style={styles.inputDisabled} disabled />
		}
	}

	renderLinkedinView() {
		const { params } = this.props.navigation.state
		if(params.facebook !== '') {
			return <Input value={`https://facebook.com/${params.facebook}`} style={styles.inputDisabled} disabled />
		}else{
			return <Input value={`Not Found`} style={styles.inputDisabled} disabled />
		}
	}

	render() {
		const { params } = this.props.navigation.state
		return (
			<Container style={styles.container}>
				<Header hasTabs>
					<Left>
						<Button transparent onPress={() => this.handleBack()}>
							<Icon name='arrow-back' />
						</Button>
					</Left>
					<Body>
						<Title>Profile</Title>
					</Body>
					<Right />
				</Header>
				<List >
					<ListItem avatar>
						<Left>
							{(params.avatar !== '') ? (
								<Thumbnail large source={{uri: params.avatar}} />
							) : (
								<Thumbnail large source={defaultPhotoProfile} />
							)}
						</Left>
						<Body>
							<View style={styles.viewProfileText}>
								<Text style={{fontFamily: 'SourceSansPro', fontSize: 14, fontWeight: 'bold'}}>{params.name}</Text>
								<Text note>{params.email}</Text>
							</View>
              <View style={styles.button}>
                {(this.state.checkFriendStatusSuccess === 'FriendRequested') ? (
                  <Button bordered iconLeft small style={styles.buttonFriend}>
                    <Icon name='checkmark' />
                    <Text style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Requested</Text>
                  </Button>
                ) : this.renderButton()}
                <Button bordered iconLeft small onPress={() => this.handleOpenChat({id: params.id, myid: this.props.session.id, users: params})}>
                  <Text style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Message</Text>
                </Button>
              </View>
						</Body>
					</ListItem>
				</List>
				<Content>
					<Form>
						<Item stackedLabel>
							<Label style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Facebook</Label>
							{this.renderFacebookView()}
						</Item>
						<Item stackedLabel>
							<Label style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Twitter</Label>
							{this.renderTwitterView()}
						</Item>
						<Item stackedLabel>
							<Label style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Linkedin</Label>
							{this.renderLinkedinView()}
						</Item>
					</Form>
				</Content>
			</Container>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		fetchFriendsSuccess: state.fetchFriendsSuccess,
		fetchFriendRequestSuccess: state.fetchFriendRequestSuccess,
		requestFriendSuccess: state.requestFriendSuccess,
		checkFriendStatusSuccess: state.checkFriendStatusSuccess,
		session: state.session,
		loading: state.loading
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setLinkNavigate: (navigate) => dispatch(setLinkNavigate(navigate)),
		sendRequestFriend: (data, accessToken) => dispatch(sendRequestFriend(data, accessToken)),
		checkFriendStatus: (myid, iduser, accessToken) => dispatch(checkFriendStatus(myid, iduser, accessToken))
	}
}

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
		color: '#C7C7C7',
		fontFamily: 'SourceSansPro',
		fontSize: 14
	},
	email: {
		fontSize: 15
	},
	name: {
		fontSize: 20
	},
	viewImage: {
		display: 'flex',
		height: 200,
		alignItems: 'center'
	},
	viewImageAvatar: {
		marginTop: 30,
		marginBottom: 10
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
	},
	viewButtonChangePassword: {
		margin: 10
  },
  button: {
		display: 'flex',
		flexDirection: 'row'
  },
	viewProfileText: {
		marginBottom: 10
	},
	buttonFriend: {
		marginRight: 10
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeContainer(PersonProfile))