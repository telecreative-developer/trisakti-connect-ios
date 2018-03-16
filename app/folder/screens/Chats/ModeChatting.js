import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	FlatList,
	AsyncStorage,
	Image,
	Dimensions,
	ImageBackground,
	Keyboard,
	TouchableOpacity,
	BackHandler
} from 'react-native'
import {
	Container,
	Content,
	Icon,
	Item,
	Text,
	Input,
	Footer,
	Thumbnail,
	Title,
	Header,
	Left,
	Button,
	Body,
	Right
} from 'native-base'
import { connect } from 'react-redux'
import moment from 'moment'
import { isEmpty } from 'validator'
import ImagePicker from 'react-native-image-picker'
import { stringToEmoticon, emoticonToString } from 'emoticons-converter'
import ThemeContainer from '../ThemeContainer'
import {
	sendChatPersonal,
	sendImageChatPersonal,
	fetchChatsByID,
	fetchChatsByIDRealtime
} from '../../actions/chats'
import { setLinkNavigate } from '../../actions/processor'
import defaultPhotoProfile from '../../assets/images/default-user.png'

const { width } = Dimensions.get('window')

class ModeChatting extends Component<{}> {
	constructor() {
		super()

		this.state = {
			message: '',
			loading: false,
			previewImage: false,
			previewImageContent: ''
		}

		this.handleSelectThumbnail = this.handleSelectThumbnail.bind(this)
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			this.handleBack()
		})
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress')
	}

	async handleBack() {
		await this.props.navigation.goBack()
		await this.props.setLinkNavigate({ navigate: '', data: '' })
	}

	async componentDidMount() {
		await this.setState({ loading: true })
		const { params } = await this.props.navigation.state
		await this.props.fetchChatsByID(
			params.id,
			params.myid,
			this.props.session.accessToken
		)
		await this.props.fetchChatsByIDRealtime(
			params.id,
			params.myid,
			this.props.session.accessToken
		)
		await this.setState({ loading: false })
	}

	async handleSendMessage(id, myid) {
		const data = await {
			id: id,
			myid: myid,
			message: emoticonToString(this.state.message),
			image: null
		}

		if (!isEmpty(this.state.message)) {
			await this.setState({ message: '' })
			await this.props.sendChatPersonal(data, this.props.session.accessToken)
		}
	}

	handleSelectThumbnail(id, myid) {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true
			}
		}

		ImagePicker.showImagePicker(options, response => {
			if (response.didCancel) {
				this.setState({ thumbnail: this.state.thumbnail })
			} else {
				this.props.sendImageChatPersonal(
					{ id: id, myid: myid, message: null },
					`data:image/png;base64,${response.data}`,
					this.props.session.accessToken
				)
			}
		})
	}

	renderItems = ({ item }) => (
		<View
			style={{
				backgroundColor:
					item.sender === this.props.session.id ? '#90CAF9' : '#FAFAFA',
				display: 'flex',
				flex: 1,
				marginRight: item.sender === this.props.session.id ? 10 : width / 3,
				marginLeft: item.sender === this.props.session.id ? width / 3 : 10,
				padding: 10,
				borderRadius: 10,
				margin: 5
			}}>
			{item.message === null ? (
				<TouchableOpacity
					style={{ margin: 5 }}
					onPress={() =>
						this.setState({
							previewImage: true,
							previewImageContent: item.image
						})
					}>
					<Thumbnail
						square
						source={{ uri: item.image }}
						style={{ width: '100%', height: 150 }}
					/>
				</TouchableOpacity>
			) : (
				<Text
					style={{
						color: '#212121',
						fontFamily: 'SourceSansPro',
						fontSize: 14
					}}>
					{stringToEmoticon(item.message)}
				</Text>
			)}
			<View style={{ display: 'flex', alignItems: 'flex-end' }}>
				<Text style={{ color: '#212121', fontSize: 10 }}>
					{moment(item.updatedAt).format('LT')}
				</Text>
			</View>
		</View>
	)

	key = (item, index) => index

	render() {
		const { params } = this.props.navigation.state
		if (this.state.previewImage) {
			return (
				<Container>
					<Header>
						<Left>
							<Button
								transparent
								onPress={() => this.setState({ previewImage: false })}>
								<Icon name="arrow-back" />
							</Button>
						</Left>
						<Body />
					</Header>
					<View
						style={{
							flex: 1,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}>
						<Image
							source={{ uri: this.state.previewImageContent }}
							style={{ width: '95%', height: 200 }}
						/>
					</View>
				</Container>
			)
		}
		return (
			<ImageBackground
				style={{ flex: 1 }}
				imageStyle={{ width: '100%', height: '100%' }}
				source={require('../../assets/images/pattern.jpg')}>
				<Header>
					<Left style={styles.left}>
						<View style={styles.viewHeader}>
							<Button transparent onPress={() => this.handleBack()}>
								<Icon name="arrow-back" />
							</Button>
							{params.users.avatar !== '' ? (
								<Thumbnail
									style={styles.avatar}
									source={{ uri: params.users[0].avatar }}
								/>
							) : (
								<Thumbnail style={styles.avatar} source={defaultPhotoProfile} />
							)}
						</View>
					</Left>
					<Body>
						{params.length === 0 ? (
							<Title>Loading...</Title>
						) : (
							<Title>{params.users.name}</Title>
						)}
					</Body>
					<Right />
				</Header>
				<View
					style={{ flex: 1 }}
					ref={ref => (this.content = ref)}
					onContentSizeChange={(contentWidth, contentHeight) => {
						this.content._root.scrollToEnd({ animated: true })
					}}>
					<FlatList
						inverted
						data={this.props.fetchChatsByIDSuccess}
						keyExtractor={this.key}
						renderItem={this.renderItems}
						refreshing={this.state.loading}
					/>
				</View>
				<Footer transparent style={styles.footer}>
					<View
						style={{
							margin: 5,
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center'
						}}>
						<Button
							transparent
							onPress={() =>
								this.handleSelectThumbnail(params.id, params.myid)
							}>
							<Icon name="camera" />
						</Button>
						<Item regular style={styles.item}>
							<Input
								multiline
								numberOfLines={4}
								value={this.state.message}
								onChangeText={e => this.setState({ message: e })}
								style={{
									borderRadius: 5,
									fontFamily: 'SourceSansPro',
									fontSize: 16
								}}
								placeholder="Type a message"
							/>
						</Item>
						<Button
							transparent
							onPress={() => this.handleSendMessage(params.id, params.myid)}>
							<Icon name="send" />
						</Button>
					</View>
				</Footer>
			</ImageBackground>
		)
	}
}

const mapStateToProps = state => ({
	fetchChatsByIDLoading: state.fetchChatsByIDLoading,
	fetchChatsByIDSuccess: state.fetchChatsByIDSuccess,
	session: state.session
})

const mapDispatchToProps = dispatch => {
	return {
		setLinkNavigate: item => dispatch(setLinkNavigate(item)),
		fetchChatsByID: (id, myid, accessToken) =>
			dispatch(fetchChatsByID(id, myid, accessToken)),
		fetchChatsByIDRealtime: (id, myid, accessToken) =>
			dispatch(fetchChatsByIDRealtime(id, myid, accessToken)),
		sendChatPersonal: (item, accessToken) =>
			dispatch(sendChatPersonal(item, accessToken)),
		sendImageChatPersonal: (item, thumbnail, accessToken) =>
			dispatch(sendImageChatPersonal(item, thumbnail, accessToken))
	}
}

const styles = StyleSheet.create({
	left: {
		marginRight: 10
	},
	viewHeader: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	avatar: {
		width: 30,
		height: 30
	},
	item: {
		width: '75%',
		borderRadius: 5
	},
	footer: {
		backgroundColor: '#F2F2F2'
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(
	ThemeContainer(ModeChatting)
)
