/* @flow */
import React, { Component } from 'react'
import { Image, Dimensions, BackHandler, View, FlatList, StyleSheet, AsyncStorage, Alert } from 'react-native'
import { Container, Header, Icon, Item, Fab, Input, Card, CardItem, Thumbnail, Left, ListItem, H2, Content, Text, Button, Body, Title, List, Right, Badge } from 'native-base'
import { connect } from 'react-redux'
import moment from 'moment'
import { isEmpty } from 'validator'
import Modal from 'react-native-modal'
import Entypo from 'react-native-vector-icons/Entypo'
import { sendComment, addClaps, fetchCommentsRealtime, fetchComments } from '../../actions/news'
import { setLinkNavigate } from '../../actions/processor'
import defaultPhotoProfile from '../../assets/images/default-user.png'
import ThemeContainer from '../ThemeContainer'

const { width, height } = Dimensions.get('window')

type State = {
  comment: string,
  clapsCount: number,
  openComment: boolean
}

class ModeReadNews extends Component<{}, State> {
	constructor() {
		super()

		this.state = {
			comment: '',
			clapsCount: 0,
			openComment: false,
			close: true
    }
	}

	componentWillMount() {
    const { params } = this.props.navigation.state
    this.setState({clapsCount: params.claps})
    this.props.fetchComments(this.props.session.accessToken)
  }
  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if(!this.state.close) {
				this.setState({close: true})
			}else{
				this.handleBack()	
			}
    })
  }

	componentWillUnmount() {
		const { clapsCount } = this.state
		const { params } = this.props.navigation.state
		this.props.addClaps(params.id_news, clapsCount, this.props.session.accessToken)
    BackHandler.removeEventListener('hardwareBackPress')
  }
  
  async handleBack() {
		await this.props.navigation.goBack()
		await this.props.setLinkNavigate({navigate: '', data: ''})
  }

  renderItems = ({item}) => (
  	<ListItem avatar style={{marginBottom: 10}}>
  		<Left>
  			{(item.users[0].avatar === '') ? (
  				<Thumbnail source={defaultPhotoProfile} style={styles.thumbnailComment} />
  			) : (
  				<Thumbnail source={{uri: item.users[0].avatar}} style={styles.thumbnailComment}/>
  			)}
  		</Left>
  		<Body>
  			<Text note style={{color: '#000000'}}>{item.users[0].name}</Text>
  			<Text note>{item.comment}</Text>
  		</Body>
  		<Right>
  			<Text note>{moment(item.updatedAt).format('L')}</Text>
  		</Right>
  	</ListItem>
  )

  key = (item, index) => index

  handleOpenComment() {
  	this.setState({openComment: true})
  }

  handleCloseComment() {
  	this.setState({openComment: false})
	}
	
	handleOpenProfile() {
		const { params } = this.props.navigation.state
		if(params.users[0].id !== this.props.session.id) {
			this.props.setLinkNavigate({navigate: 'PersonProfile', data: params.users[0]})
		}
	}
	
  async handleSendCommment() {
  	let data = await {
  		comment: this.state.comment,
  		id_news: this.props.navigation.state.params.id_news,
  		id: this.props.session.id
  	}
		
  	if(isEmpty(this.state.comment)) {
  		Alert.alert('', 'Comment tidak boleh kosong')
  	}else{
  		await this.props.sendComment(data, this.props.session.accessToken)
			await this.setState({openComment: false, comment: ''})
			await this.props.fetchComments(this.props.session.accessToken)
  		await this.props.fetchCommentsRealtime(this.props.session.accessToken)
  	}
  }

  render() {
		const { params } = this.props.navigation.state
  	if(this.state.openComment) {
  		return (
  			<Container style={styles.container}>
          <Header>
            <Left>
              <Button transparent onPress={() => this.handleCloseComment()}>
                <Icon name='arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>Comment</Title>
            </Body>
            <Right/>
          </Header>
          <View style={styles.comment}>
            <Content>
              <Input style={{paddingLeft:10, paddingRight: 10, fontFamily: 'SourceSansPro', fontSize: 14}} value={this.state.comment} onChangeText={(comment) => this.setState({comment})} placeholder='Write your comment...' />
            </Content>
            <Fab position='bottomRight' style={styles.fab} onPress={() => this.handleSendCommment()}>
              <Icon name="send" />
            </Fab>
          </View>
        </Container>
  		)
  	}
  	return (
  		<Container style={styles.container}>
  			<Content>
  				<Image source={{uri: params.thumbnail}} style={styles.cover} />
  				<View style={styles.viewNews}>
  					<Text style={styles.title}>{params.title}</Text>
  					<List style={{marginBottom: 10}}>
  						<ListItem avatar onPress={() => this.handleOpenProfile()}>
  							<Left>
  								{(params.users[0].avatar !== '') ? (
										<Thumbnail style={styles.avatar} source={{uri: params.users[0].avatar}} />
									) : (
										<Thumbnail style={styles.avatar} source={defaultPhotoProfile} />
									)}
  							</Left>
  							<Body style={{borderBottomWidth: 0, borderColor: '#FFF'}}>
  								<Text style={{color: '#D35C72', fontSize: 14}}>{params.users[0].name}</Text>
  								<Text note style={{fontSize: 12}}>{moment(params.updatedAt).format('LLL')}</Text>
  							</Body>
  							<Right style={{borderBottomWidth: 0, borderColor: '#FFF', justifyContent: 'center'}}>
  								<View style={styles.badgeCategory}>
  									<Text note style={styles.badgeTextCategory}>{params.categories[0].category}</Text>
  								</View>
  							</Right>
  						</ListItem>
  					</List>
  					<Text style={{fontSize: 14, lineHeight: 22, fontFamily: 'SourceSansPro-Regular'}}>{params.content}</Text>
  				</View>
  				<Card>
  					<CardItem>
  						<Left>
  							<Button transparent>
  								<Icon active name='chatbubbles' />
  								<Text>{this.props.comments.filter(data => data.id_news ===  params.id_news).length}</Text>
  							</Button>
  						</Left>
  						<Right>
  							<Button onPress={() => this.setState({clapsCount: this.state.clapsCount+1})}>
  								<Text>{this.state.clapsCount}</Text>
  								<Icon name='hand' />
  							</Button>
  						</Right>
  					</CardItem>
  				</Card>
  				<View style={styles.viewInputComment}>
  					<Item regular style={styles.itemComment} onPress={() => this.handleOpenComment()}>
  						<Input disabled placeholder='Write comment...' />
  					</Item>
  				</View>
  				<View>
  					<FlatList
  						data={this.props.comments.filter(data => data.id_news ===  params.id_news)}
  						renderItem={this.renderItems}
  						keyExtractor={this.key} />
  				</View>
  			</Content>
  		</Container>
  	)
  }
}

const mapStateToProps = (state) => {
	return {
		comments: state.fetchCommentsSuccess,
		session: state.session
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setLinkNavigate: (navigate) => dispatch(setLinkNavigate(navigate)),
		addClaps: (id, claps, accessToken) => dispatch(addClaps(id, claps, accessToken)),
		sendComment: (comment, accessToken) => dispatch(sendComment(comment, accessToken)),
    fetchComments: (accessToken) => dispatch(fetchComments(accessToken)),
    fetchCommentsRealtime: (accessToken) => dispatch(fetchCommentsRealtime(accessToken))
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	},
	cover: {
		width: width,
		height: height / 3
	},
	fab: {
		backgroundColor: '#5067FF'
	},
	avatar: {
		width: 30,
		height: 30
	},
	comment: {
		flex: 1
	},
	viewNews: {
		margin: 20
	},
	title: {
		fontSize: 18,
		marginBottom: 10,
		fontWeight: 'bold',
		fontFamily: 'SourceSansPro'
	},
	viewInputComment: {
		margin: 20
	},
	viewProfileText: {
		marginBottom: 10
	},
	itemComment: {
		borderRadius: 5
	},
	badgeCategory: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'#1ABC9C',
		width: 60,
		height: 25,
		borderRadius: 3
  },
	badgeTextCategory: {
		color: '#ffffff'
	},
	thumbnailComment: {
		width: 30,
		height: 30
	},
	button: {
		display: 'flex',
		flexDirection: 'row'
	},
	buttonFriend: {
		marginRight: 10
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeContainer(ModeReadNews))