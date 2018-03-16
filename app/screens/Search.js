import React, { Component } from 'react'
import { StyleSheet, FlatList, View, AsyncStorage, BackHandler, TouchableHighlight } from 'react-native'
import ThemeContainer from './ThemeContainer'
import { Container, Header, Tabs, Tab, Item, Input, Icon, Button, Content, Card, Body, CardItem, Thumbnail, Text, Right } from 'native-base'
import { searchUser, searchNews, searchVote, searchCareer } from '../actions/search'
import { connect } from 'react-redux'
import defaultAvatar from '../assets/images/default-user.png'
import { setLinkNavigate } from '../actions/processor'
import { setNavigate } from "../actions/processor"
import { fetchPollsAnswers, checkHasVoted, fetchPollsAnswersRealtime } from '../actions/polls'
import moment from 'moment'

function capitalizeFirstLetter(string) {
	return string.replace(/\w\S*/g, function(result) {
		return result.charAt(0).toUpperCase() + result.substr(1).toLowerCase();
	})
}

class Search extends Component {
	constructor() {
		super()
    
		this.state = {
			search: '',
			loading: false
		}

		this.handleTypeSearch = this.handleTypeSearch.bind(this)
		this.handleResetText = this.handleResetText.bind(this)
	}

	componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backPressed);
  }

  componentWillUnmount() {
		this.props.setNavigate("", "");
    BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
  }


	async handleTypeSearch(value) {
		await this.setState({search: value})
		await this.setState({loading: true})
		await setTimeout(() => {
			this.props.searchUser(value)
			this.props.searchNews(value, this.props.session.accessToken)
			this.props.searchVote(value, this.props.session.accessToken)
			this.props.searchCareer(value, this.props.session.accessToken)
		}, 1000)
		await this.setState({loading: false})
	}
  
	handleResetText() {
		this.setState({search: ''})
	}

	async handleFullRead(item) {
    await this.props.setLinkNavigate({navigate: 'ModeReadNews', data: item})
	}
	
	async handleReadPolls(item) {
    await this.props.fetchPollsAnswers(item.id_poll, this.props.session.accessToken)
		await this.props.checkHasVoted(this.props.session.id, item.id_poll, this.props.session.accessToken)
    await this.props.fetchPollsAnswersRealtime(item.id_poll, this.props.session.accessToken)
    await this.props.setLinkNavigate({navigate: 'ModeReadVoting', data: item})
	}
  
  renderItemsUser = ({item}) => {
  	return (
  		<TouchableHighlight onPress={() => this.props.navigation.navigate('PersonProfile', item)}>
  			<Card>
  				<CardItem>
  					<Body>
  						<Text style={{fontSize: 16}}>{capitalizeFirstLetter(item.name)}</Text>
  						{(item.faculties[0] !== undefined && item.majors[0] !== undefined) ? (
  							<View>
  								<Text style={{fontSize: 14}} note>{item.faculties[0].faculty}</Text>
  								<Text style={{fontSize: 14}} note>{item.majors[0].major}</Text>
  							</View>
  						) : (
  							<View />
  						)}
  					</Body>
  					<Right>
  						{(item.avatar !== '') ? (
								<Thumbnail large square source={{uri: item.avatar}} />
							) : (
								<Thumbnail large square source={defaultAvatar} />
							)}
  					</Right>
  				</CardItem>
  			</Card>
  		</TouchableHighlight>
  	)
	}
	
	renderItemsNews = ({item}) => {
  	return (
  		<TouchableHighlight onPress={() => this.handleFullRead(item)}>
  			<Card avatar>
  				<CardItem>
  					<Body>
  						<Text numberOfLines={1} style={styles.title}>{item.title}</Text>
  						<Text note style={styles.content} ellipsizeMode='tail' numberOfLines={2}>{item.content}</Text>
  						<View style={styles.viewFoot}>
  							{(item.users[0].avatar.length !== '') ? (
  								<Thumbnail source={{uri: item.users[0].avatar}} style={styles.avatar} />
  							) : (
  								<Thumbnail source={defaultAvatar} style={styles.avatar} />
  							)}
  							<View>
  								<Text note style={styles.defaultTextNote}>{ item.users[0].name}</Text>
  								<Text note style={styles.defaultDate}>{moment(item.createdAt).format('lll')}</Text>
  							</View>
  						</View>
  					</Body>
  					<Right>
  						<Thumbnail square large source={{uri: item.thumbnail}} style={styles.thumbnail}/>
  					</Right>
  				</CardItem>
  			</Card>
  		</TouchableHighlight>
  	)
	}
	
	renderItemsVote = ({item}) => {
  	return (
  		<TouchableHighlight onPress={() => this.handleReadPolls(item)}>
  			<Card>
  				<CardItem>
  					<Body>
  						<Text>{item.title_poll}</Text>
  						<Text note numberOfLines={1} ellipsizeMode='tail'>{item.content_poll}</Text>
  					</Body>
  					<Right>
  						{(item.avatar !== '') ? (
								<Thumbnail large square source={{uri: item.thumbnail_poll}} />
							) : (
								<Thumbnail large square source={defaultAvatar} />
							)}
  					</Right>
  				</CardItem>
  			</Card>
  		</TouchableHighlight>
  	)
	}
	
	renderItemsCareer = ({item}) => {
  	return (
  		<TouchableHighlight onPress={() => this.props.setLinkNavigate({navigate: 'ModeReadJob', data: item})}>
  			<Card>
  				<CardItem>
  					<Body>
  						<Text style={styles.title}>{item.job_title}</Text>
  						<Text note style={styles.company}>{item.company}</Text>
  						<Text note style={styles.content} ellipsizeMode='tail' numberOfLines={3}>{item.overview}</Text>
  						<View style={styles.viewFoot}>
  							{(item.users[0].avatar.length !== '') ? (
  								<Thumbnail source={{uri: item.users[0].avatar}} style={styles.avatar} />
  							) : (
  								<Thumbnail source={defaultAvatar} style={styles.avatar} />
  							)}
  							<View>
  								<Text note style={styles.defaultTextNote}>{item.users[0].name}</Text>
  								<Text note style={styles.defaultDate}>{moment(item.createdAt).format('lll')}</Text>
  							</View>
  						</View>
  					</Body>
  				</CardItem>
  			</Card>
  		</TouchableHighlight>
  	)
  }

	key = (item, index) => index
	
	viewHeaderResultUser() {
		if(this.state.search === '' && this.props.resultUser.length !== 0) {
			return <Text style={{fontStyle: 'italic'}}>{`Recently Search`}</Text>
		}else{
			if(this.state.search === '' && this.props.resultUser.length === 0) {
				return <View />
			}else if(this.props.resultUser.length === 1){
				return <Text style={{fontStyle: 'italic'}}>{`Result for "${this.state.search}": ${this.props.resultUser.length} person`}</Text>
			}else if(this.props.resultUser.length === 0){
				return <Text style={{fontStyle: 'italic'}}>{`No result found for "${this.state.search}"`}</Text>
			}else{
				return <Text style={{fontStyle: 'italic'}}>{`Results for "${this.state.search}": ${this.props.resultUser.length} persons`}</Text>
			}
		}
	}

	viewHeaderResultNews() {
		if(this.state.search === '' && this.props.resultNews.length !== 0) {
			return <Text style={{fontStyle: 'italic'}}>{`Recently Search`}</Text>
		}else{
			if(this.state.search === '' && this.props.resultNews.length === 0) {
				return <View />
			}else if(this.props.resultNews.length === 1){
				return <Text style={{fontStyle: 'italic'}}>{`Result for "${this.state.search}": ${this.props.resultNews.length} news`}</Text>
			}else if(this.props.resultNews.length === 0){
				return <Text style={{fontStyle: 'italic'}}>{`No result found for "${this.state.search}"`}</Text>
			}else{
				return <Text style={{fontStyle: 'italic'}}>{`Results for "${this.state.search}": ${this.props.resultNews.length} news`}</Text>
			}
		}
	}

	viewHeaderResultVoting() {
		if(this.state.search === '' && this.props.resultVote.length !== 0) {
			return <Text style={{fontStyle: 'italic'}}>{`Recently Search`}</Text>
		}else{
			if(this.state.search === '' && this.props.resultVote.length === 0) {
				return <View />
			}else if(this.props.resultVote.length === 1){
				return <Text style={{fontStyle: 'italic'}}>{`Result for "${this.state.search}": ${this.props.resultVote.length} voting`}</Text>
			}else if(this.props.resultVote.length === 0){
				return <Text style={{fontStyle: 'italic'}}>{`No result found for "${this.state.search}"`}</Text>
			}else{
				return <Text style={{fontStyle: 'italic'}}>{`Results for "${this.state.search}": ${this.props.resultVote.length} votings`}</Text>
			}
		}
	}

	viewHeaderResultCareer() {
		if(this.state.search === '' && this.props.resultCareer.length !== 0) {
			return <Text style={{fontStyle: 'italic'}}>{`Recently Search`}</Text>
		}else{
			if(this.state.search === '' && this.props.resultCareer.length === 0) {
				return <View />
			}else if(this.props.resultCareer.length === 1){
				return <Text style={{fontStyle: 'italic'}}>{`Result for "${this.state.search}": ${this.props.resultCareer.length} career`}</Text>
			}else if(this.props.resultCareer.length === 0){
				return <Text style={{fontStyle: 'italic'}}>{`No result found for "${this.state.search}"`}</Text>
			}else{
				return <Text style={{fontStyle: 'italic'}}>{`Results for "${this.state.search}": ${this.props.resultCareer.length} careers`}</Text>
			}
		}
	}
  
  render() {
  	return (
  		<Container style={styles.container}>
  			<Header searchBar rounded hasTabs>
  				<View style={{width: '100%', borderRadius: 5, marginTop: 10, height: '80%', backgroundColor: '#FFFFFF', paddingLeft:5}}>
						<Input style={{fontSize: 16}} placeholder='Search' value={this.state.search} onChangeText={this.handleTypeSearch} />
  				</View>
  			</Header>
				<Tabs initialPage={0}>
          <Tab heading='Person'>
						<Content>
							<View style={{margin: 10}}>
								{this.viewHeaderResultUser()}
							</View>
							<FlatList
								refreshing={true}
								data={this.props.resultUser.filter(res => res.id !== this.props.session.id)}
								keyExtractor={this.key}
								renderItem={this.renderItemsUser} />
						</Content>
          </Tab>
          <Tab heading='News'>
						<Content>
							<View style={{margin: 10}}>
								{this.viewHeaderResultNews()}
							</View>
							<FlatList
								refreshing={this.state.loading}
								data={this.props.resultNews}
								keyExtractor={this.key}
								renderItem={this.renderItemsNews} />
						</Content>
          </Tab>
          <Tab heading='Voting'>
						<Content>
							<View style={{margin: 10}}>
								{this.viewHeaderResultVoting()}
							</View>
							<FlatList
								refreshing={this.state.loading}
								data={this.props.resultVote}
								keyExtractor={this.key}
								renderItem={this.renderItemsVote} />
						</Content>
          </Tab>
					<Tab heading='Career'>
						<Content>
							<View style={{margin: 10}}>
								{this.viewHeaderResultCareer()}
							</View>
							<FlatList
								refreshing={this.state.loading}
								data={this.props.resultCareer}
								keyExtractor={this.key}
								renderItem={this.renderItemsCareer} />
						</Content>
          </Tab>
        </Tabs>
  		</Container>
  	)
  }
}

const mapStateToProps = (state) => {
	return {
		resultUser: state.searchResultUser,
		resultNews: state.searchResultNews,
		resultVote: state.searchResultVote,
		resultCareer: state.searchResultCareer,
		session: state.session
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setNavigate: (link, data) => dispatch(setNavigate(link, data)),
		setLinkNavigate: (navigate) => dispatch(setLinkNavigate(navigate)),
		searchUser: (name) => dispatch(searchUser(name)),
		searchNews: (title, accessToken) => dispatch(searchNews(title, accessToken)),
		searchVote: (title, accessToken) => dispatch(searchVote(title, accessToken)),
		searchCareer: (title, accessToken) => dispatch(searchCareer(title, accessToken)),
		fetchPollsAnswers: (id, accessToken) => dispatch(fetchPollsAnswers(id, accessToken)),
		fetchPollsAnswersRealtime: (id, accessToken) => dispatch(fetchPollsAnswersRealtime(id, accessToken)),
		checkHasVoted: (id, myid, accessToken) => dispatch(checkHasVoted(id, myid, accessToken))
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	},
	header: {
		backgroundColor: '#FFFFFF'
	},
	title: {
		fontSize: 17,
		flex: 1,
		fontWeight: 'bold'
  },
  thumbnail: {
    width: 100,
    height: 100
  },
	content: {
		marginTop: 10,
		marginBottom: 10
	},
	viewFoot: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	avatar: {
		width: 30,
		height: 30,
		marginRight: 10
	},
	defaultTextNote: {
		color: '#D35C72',
		fontSize: 11
	},
	defaultDate: {
		fontSize: 11
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeContainer(Search))