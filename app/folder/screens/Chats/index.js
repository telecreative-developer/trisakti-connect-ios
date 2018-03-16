import React, { Component } from 'react'
import {
	View,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Alert
} from 'react-native'
import {
	Icon,
	ListItem,
	Content,
	Left,
	Body,
	Card,
	CardItem,
	Text,
	Thumbnail,
	Right
} from 'native-base'
import ActionButton from 'react-native-action-button'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import { stringToEmoticon } from 'emoticons-converter'
import moment from 'moment'
import { fetchFriends } from '../../actions/users'
import {
	fetchChatsPersonal,
	fetchChatsPersonalRealtime,
	fetchChatsByID,
	fetchChatsByIDRealtime,
	deleteChat
} from '../../actions/chats'
import { setLinkNavigate } from '../../actions/processor'
import chatlogo from '../../assets/images/chat.png'
import defaultPhotoProfile from '../../assets/images/default-user.png'

type State = {
	loading: boolean
}

class Chats extends Component<{}, State> {
	state = {
		loading: false
	}

	async componentWillMount() {
		await this.setState({ loading: true })
		await this.props.fetchChatsPersonal(
			this.props.session.id,
			this.props.session.accessToken
		)
		await this.props.fetchChatsPersonalRealtime(
			this.props.session.id,
			this.props.session.accessToken
		)
		await this.props.fetchFriends(
			this.props.session.id,
			this.props.session.accessToken
		)
		await this.setState({ loading: false })
	}

	async handleRefresh() {
		await this.setState({ loading: true })
		await this.props.fetchChatsPersonal(
			this.props.session.id,
			this.props.session.accessToken
		)
		await this.props.fetchFriends(
			this.props.session.id,
			this.props.session.accessToken
		)
		await this.setState({ loading: false })
	}

	handleOpenChat(item) {
		this.props.setLinkNavigate({
			navigate: 'ModeChatting',
			data: { id: item.id, myid: this.props.session.id, users: item.users[0] }
		})
	}

	handleLongPress(item) {
		Alert.alert(
			'Delete chat',
			`All conversation will be deleted, are you sure to delete chat with ${
				item.users[0].name
			}?`,
			[
				{ text: 'Cancel', onPress: () => {}, style: 'cancel' },
				{
					text: 'Yes, Delete',
					onPress: () =>
						this.props.deleteChat(
							item.id,
							item.myid,
							this.props.session.accessToken
						)
				}
			],
			{ cancelable: false }
		)
	}

	renderItems = ({ item }) => {
		return (
			<ListItem
				avatar
				onPress={() => this.handleOpenChat(item)}
				onLongPress={() => this.handleLongPress(item)}
				style={styles.listItem}>
				<Left>
					{item.users[0].avatar !== '' ? (
						<Thumbnail source={{ uri: item.users[0].avatar }} />
					) : (
						<Thumbnail source={defaultPhotoProfile} />
					)}
				</Left>
				<Body>
					<Text style={{ fontSize: 16, fontFamily: 'SourceSansPro' }}>
						{item.users[0].name}
					</Text>
					{item.message === null ? (
						<View style={styles.viewChatImage}>
							<Icon name="image" style={styles.iconImage} />
							<Text note style={styles.textImage}>
								Image
							</Text>
						</View>
					) : (
						<Text note style={{ fontSize: 12, fontFamily: 'SourceSansPro' }}>
							{stringToEmoticon(item.message)}
						</Text>
					)}
				</Body>
				<Right>
					<Text note style={{ fontSize: 14, fontFamily: 'SourceSansPro' }}>
						{moment(item.createdAt).format('LT')}
					</Text>
				</Right>
			</ListItem>
		)
	}

	key = (item, key) => key

	render() {
		if (
			this.props.chats.length === 0 &&
			this.props.loading.condition === false
		) {
			return (
				<Content>
					<TouchableOpacity
						onPress={() => this.props.setLinkNavigate({ navigate: 'Search' })}>
						<Card>
							<CardItem>
								<Left>
									<Thumbnail square source={chatlogo} />
									<Body>
										<Text style={styles.titleCardFriend}>
											Start a conversation now!
										</Text>
										<Text
											style={{ fontSize: 14, fontFamily: 'SourceSansPro' }}
											note>
											Find your friends to start conversation.
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
			<View style={styles.viewContainer}>
				<FlatList
					data={this.props.chats}
					renderItem={this.renderItems}
					onRefresh={() => this.handleRefresh()}
					refreshing={this.state.loading}
					keyExtractor={this.key}
				/>
				<ActionButton
					buttonColor="#2989d8"
					icon={<Icon name="chatboxes" style={styles.icon} />}
					onPress={() =>
						this.props.setLinkNavigate({ navigate: 'ContactsChat' })
					}
				/>
			</View>
		)
	}
}

const mapStateToProps = state => {
	return {
		chats: state.fetchChatsPersonalSuccess,
		session: state.session,
		loading: state.loading
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setLinkNavigate: navigate => dispatch(setLinkNavigate(navigate)),
		fetchChatsPersonal: (id, accessToken) =>
			dispatch(fetchChatsPersonal(id, accessToken)),
		fetchFriends: (id, accessToken) => dispatch(fetchFriends(id, accessToken)),
		fetchChatsPersonalRealtime: (id, accessToken) =>
			dispatch(fetchChatsPersonalRealtime(id, accessToken)),
		deleteChat: (id, myid, accessToken) =>
			dispatch(deleteChat(id, myid, accessToken))
	}
}

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1
	},
	icon: {
		color: '#FFFFFF'
	},
	iconImage: {
		marginRight: 5,
		color: '#999999',
		fontSize: 20
	},
	listItem: {
		margin: 10
	},
	viewChatImage: {
		flexDirection: 'row'
	},
	textImage: {
		fontStyle: 'italic'
	},
	titleCardFriend: {
		fontWeight: 'bold',
		fontSize: 14,
		fontFamily: 'SourceSansPro'
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(Chats)
