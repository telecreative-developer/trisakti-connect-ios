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
	setContentOpenProfileFriend,
	setModeOpenProfileFriend,
	fetchFriends,
	fetchFriendsRealtime
} from '../../actions/users'
import addfriendlogo from '../../assets/images/addfriend.png'
import { setLinkNavigate } from '../../actions/processor'
import defaultPhotoProfile from '../../assets/images/default-user.png'

type State = {
	loading: boolean
}

class Friends extends Component<{}, State> {
	state = {
		loading: false
	}

	async componentWillMount() {
		await this.setState({ loading: true })
		await this.props.fetchFriends(
			this.props.session.id,
			this.props.session.accessToken
		)
		await this.props.fetchFriendsRealtime(
			this.props.session.id,
			this.props.session.accessToken
		)
		await this.setState({ loading: false })
	}

	async handleRefresh() {
		await this.setState({ loading: true })
		await this.props.fetchFriends(
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

	renderItems = ({ item }) => {
		return (
			<ListItem
				avatar
				onPress={() =>
					this.props.setLinkNavigate({
						navigate: 'PersonProfile',
						data: item.users[0]
					})
				}
				style={{ margin: 10 }}>
				{item.users[0].avatar !== '' ? (
					<Thumbnail source={{ uri: item.users[0].avatar }} />
				) : (
					<Thumbnail source={defaultPhotoProfile} />
				)}
				<Body>
					<Text style={{ fontFamily: 'SourceSansPro', fontSize: 18 }}>
						{item.users[0].name}
					</Text>
					<View style={{ flexDirection: 'row' }}>
						{item.users[0].facebook !== '' ? (
							<TouchableOpacity
								onPress={() =>
									this.handleOpenSocialMedia(
										`https://facebook.com/${item.users[0].facebook}`
									)
								}>
								<Badge style={styles.badgeSocial}>
									<Icon name="facebook" size={15} color="#FFFFFF" />
								</Badge>
							</TouchableOpacity>
						) : (
							<TouchableOpacity>
								<Badge style={styles.badgeSocialNotFound}>
									<Icon name="facebook" size={15} color="#FFFFFF" />
								</Badge>
							</TouchableOpacity>
						)}
						{item.users[0].twitter !== '' ? (
							<TouchableOpacity
								onPress={() =>
									this.handleOpenSocialMedia(
										`https://twitter.com/${item.users[0].twitter}`
									)
								}>
								<Badge style={styles.badgeSocial}>
									<Icon name="twitter" size={15} color="#FFFFFF" />
								</Badge>
							</TouchableOpacity>
						) : (
							<TouchableOpacity>
								<Badge style={styles.badgeSocialNotFound}>
									<Icon name="twitter" size={15} color="#FFFFFF" />
								</Badge>
							</TouchableOpacity>
						)}
						{item.users[0].linkedin !== '' ? (
							<TouchableOpacity
								onPress={() =>
									this.handleOpenSocialMedia(
										`https://linkedin.com/in/${item.users[0].linkedin}`
									)
								}>
								<Badge style={styles.badgeSocial}>
									<Icon name="linkedin" size={15} color="#FFFFFF" />
								</Badge>
							</TouchableOpacity>
						) : (
							<TouchableOpacity>
								<Badge style={styles.badgeSocialNotFound}>
									<Icon name="linkedin" size={15} color="#FFFFFF" />
								</Badge>
							</TouchableOpacity>
						)}
					</View>
				</Body>
			</ListItem>
		)
	}

	key = (item, index) => index

	render() {
		if (
			this.props.friends.length === 0 &&
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
										<Text style={styles.titleCardFriend}>
											Add your friends now!
										</Text>
										<Text note>
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
				data={this.props.friends}
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
		friends: state.fetchFriendsSuccess,
		session: state.session,
		loading: state.loading
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setLinkNavigate: navigate => dispatch(setLinkNavigate(navigate)),
		fetchFriends: (id, accessToken) => dispatch(fetchFriends(id, accessToken)),
		fetchFriendsRealtime: (id, accessToken) =>
			dispatch(fetchFriendsRealtime(id, accessToken))
	}
}

const styles = StyleSheet.create({
	titleCardFriend: {
		fontWeight: 'bold'
	},
	badgeSocial: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		margin: 5
	},
	badgeSocialNotFound: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		margin: 5,
		backgroundColor: '#999999'
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(Friends)
