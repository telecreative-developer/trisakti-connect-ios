import React, { Component } from 'react'
import {
	FlatList,
	TouchableOpacity,
	StyleSheet,
	View,
	Linking
} from 'react-native'
import {
	Text,
	ListItem,
	Thumbnail,
	Body,
	Content,
	Button,
	Left,
	Card,
	CardItem,
	Badge
} from 'native-base'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Entypo'
import {
	fetchFriendRequest,
	fetchFriendRequestRealtime,
	confirmFriendRequest,
	removeFriendRequest
} from '../../actions/users'
import addfriendlogo from '../../assets/images/addfriend.png'
import { setLinkNavigate } from '../../actions/processor'
import defaultPhotoProfile from '../../assets/images/default-user.png'

type State = {
	loading: boolean
}

class FriendsRequest extends Component<{}, State> {
	state = {
		loading: false
	}

	async componentWillMount() {
		await this.setState({ loading: true })
		await this.props.fetchFriendRequest(
			this.props.session.id,
			this.props.session.accessToken
		)
		await this.props.fetchFriendRequestRealtime(
			this.props.session.id,
			this.props.session.accessToken
		)
		await this.setState({ loading: false })
	}

	async handleRefresh() {
		await this.setState({ loading: true })
		await this.props.fetchFriendRequest(
			this.props.session.id,
			this.props.session.accessToken
		)
		await this.setState({ loading: false })
	}

	handleOpenSocialMedia(url) {
		Linking.canOpenURL(url).then(supported => {
			if (supported) {
				Linking.openURL(url)
			} else {
				console.log("Don't know how to open URI: " + url)
			}
		})
	}

	async handleConfirmFriend(id) {
		await this.setState({ loading: true })
		await this.props.confirmFriendRequest(id, this.props.session.accessToken)
		await this.setState({ loading: false })
	}

	async handleDeclineFriend(id) {
		await this.setState({ loading: true })
		await this.props.removeFriendRequest(id, this.props.session.accessToken)
		await this.setState({ loading: false })
	}

	renderItems = ({ item }) => {
		return (
			<ListItem avatar style={{ margin: 10 }}>
				<Left>
					{item.users[0].avatar !== '' ? (
						<Thumbnail source={{ uri: item.users[0].avatar }} />
					) : (
						<Thumbnail source={defaultPhotoProfile} />
					)}
				</Left>
				<Body>
					<Text style={styles.textName}>{item.users[0].name}</Text>
					<View style={styles.viewButton}>
						<Button
							small
							style={styles.buttonConfirm}
							onPress={() => this.handleConfirmFriend(item.id_friendrequest)}>
							<Text style={{ fontFamily: 'SourceSansPro', fontSize: 14 }}>
								Confirm
							</Text>
						</Button>
						<Button
							small
							bordered
							onPress={() => this.handleDeclineFriend(item.id_friendrequest)}>
							<Text style={{ fontFamily: 'SourceSansPro', fontSize: 14 }}>
								Decline
							</Text>
						</Button>
					</View>
				</Body>
			</ListItem>
		)
	}

	key = (item, index) => index

	render() {
		if (
			this.props.friendsRequest.length === 0 &&
			this.props.loading.condition === false
		) {
			return (
				<Content>
					<TouchableOpacity
						onPress={() => this.props.setLinkNavigate({ navigate: 'Search' })}>
						<Card>
							<CardItem>
								<Left>
									<Thumbnail square source={addfriendlogo} />
									<Body>
										<Text
											style={{
												fontFamily: 'SourceSansPro',
												fontSize: 14,
												fontWeight: 'bold'
											}}>
											Add your friends now!
										</Text>
										<Text
											style={{ fontFamily: 'SourceSansPro', fontSize: 14 }}
											note>
											Let's make interaction with the other alumni.
										</Text>
									</Body>
								</Left>
							</CardItem>
						</Card>
					</TouchableOpacity>
				</Content>
			)
		}
		return (
			<FlatList
				data={this.props.friendsRequest}
				renderItem={this.renderItems}
				keyExtractor={this.key}
				onRefresh={() => this.handleRefresh}
				refreshing={this.state.loading}
			/>
		)
	}
}

const mapStateToProps = state => {
	return {
		friendsRequest: state.fetchFriendRequestSuccess,
		session: state.session,
		loading: state.loading
	}
}

const mapDispatchToProps = dispatch => {
	return {
		confirmFriendRequest: (id, accessToken) =>
			dispatch(confirmFriendRequest(id, accessToken)),
		removeFriendRequest: (id, accessToken) =>
			dispatch(removeFriendRequest(id, accessToken)),
		setLinkNavigate: navigate => dispatch(setLinkNavigate(navigate)),
		fetchFriendRequest: (id, accessToken) =>
			dispatch(fetchFriendRequest(id, accessToken)),
		fetchFriendRequestRealtime: (id, accessToken) =>
			dispatch(fetchFriendRequestRealtime(id, accessToken))
	}
}

const styles = StyleSheet.create({
	socialGroup: {
		flexDirection: 'row'
	},
	socialIcon: {
		marginRight: 10,
		backgroundColor: '#d35c72'
	},
	icon: {
		fontSize: 13,
		color: '#fff',
		lineHeight: 20,
		paddingHorizontal: 1
	},
	name: {
		marginBottom: 5
	},
	viewButton: {
		display: 'flex',
		flexDirection: 'row'
	},
	textName: {
		marginBottom: 10
	},
	buttonConfirm: {
		marginRight: 10,
		elevation: 0
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(FriendsRequest)
