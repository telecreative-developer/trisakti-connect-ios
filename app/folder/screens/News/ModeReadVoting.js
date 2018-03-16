import React, { Component } from 'react'
import { Image, Dimensions, View, StyleSheet, Text, FlatList, TouchableHighlight, Alert, BackHandler } from 'react-native'
import { Container, Header, Icon, H2, Content, Button, Body, Left, Card, CardItem, Right } from 'native-base'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import Pie from '../../lib/Charts/Pie'
import ThemeContainer from '../ThemeContainer'
import { postVote, setModeReadPolls } from '../../actions/polls'
import emptyelection from '../../assets/images/emptyelection.png'
import { setLinkNavigate } from '../../actions/processor'

const { width, height } = Dimensions.get('window')

class ModeReadVoting extends Component {
	constructor() {
		super()

		this.state = {
			datapolls: [],
			hasVoted: false
		}
	}

	async componentWillMount() {
		let hash = {}
		let result = []
		await this.props.fetchPollsAnswersSuccess.forEach(function(name){
			let id=name['idpoll_choice']
			if(hash[id]){
				hash[id].count++
			}else{
				result.push(hash[id]={
					count: 1,
					name: `${name.pollschoices[0].candidate}`
				})
			}
		})
		await this.setState({datapolls: result})
	}

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			this.handleBack()
		})
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress')
	}

	async handleBack() {
		await this.props.setLinkNavigate({navigate: '', data: ''})
		await this.props.navigation.goBack()
	}

  renderItems = ({item}) => {
		return (
			<TouchableHighlight style={{width: width / 2, margin: 3, flex: 1}} onPress={() => this.handlePostVote(item)}>
				<LinearGradient colors={['#FF512F', '#DD2476']} style={styles.linearGradient}>
					<Text style={styles.buttonText}>{item.candidate}</Text>
				</LinearGradient>
			</TouchableHighlight>
		)
	}

	key = (item, index) => index
	
	async handlePostVote(item) {
		let data = await {
			id: this.props.session.id,
			id_poll: item.id_poll,
			idpoll_choice: item.idpoll_choice
		}
		await Alert.alert(
			'Note',
			`Are you sure for choosing ${item.candidate} to your vote?`,
			[
				{text: 'Cancel', onPress: () => {}, style: 'cancel'},
				{text: 'Yes, I do', onPress: () => {
					this.props.postVote(data, this.props.session.accessToken)
					this.setState({hasVoted: true})
				}},
			],
			{ cancelable: false }
		)
	}

	render() {		
  	let options = {
  		margin: {
  			top: 10,
  			left: 10,
  			right: 10
  		},
  		width: 350,
  		height: 350,
  		color: '#04b39b',
  		r: 30,
  		R: 150,
  		animate: {
  			type: 'oneByOne',
  			duration: 200,
  			fillTransition: 3
  		},
  		label: {
  			fontSize: 10,
  			fontWeight: true,
  			color: '#ECF0F1'
  		}
  	}
  	const { params } = this.props.navigation.state
  	return (
  		<Container style={styles.container}>
  			<Content>
  				<Image source={{uri: params.thumbnail_poll}} style={styles.cover} />
  				<View style={styles.viewPolls}>
  					<H2 style={styles.title}>{params.title_poll}</H2>
  				</View>
  				{(this.state.datapolls.length === 0) ? (
						<View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
							<Image source={emptyelection}/>
						</View>
					) : (
						<View style={{marginLeft: width / 12}}>
							<Pie data={this.state.datapolls} options={options} accessorKey='count' />
						</View>
					)}
  				<View style={styles.viewPolls}>
  					<Text style={{fontSize: 18, fontFamily: 'SourceSansPro', marginBottom: 10, fontWeight: 'bold'}}>Overview</Text>
  					<Text note style={{marginBottom: 10}}>{params.content_poll}</Text>
  					<Card>
  						<CardItem style={{backgroundColor: '#d35c72'}}>
  							<Left>
  								<Text style={{fontWeight: 'bold', color: '#FFF'}}>Name</Text>
  							</Left>
  							<Right>
  								<Text style={{fontWeight: 'bold', color: '#FFF'}}>Total Voted</Text>
  							</Right>
  						</CardItem>
  					</Card>
  					<Card style={{marginBottom: 20}}>
  						{this.state.datapolls.map((value, index) => (
  							<CardItem key={index}>
  								<Left>
  									<Text style={{color: '#111'}}>{value.name}</Text>
  								</Left>
  								<Right>
  									<Text style={{color: '#111'}}>{value.count} voted</Text>
  								</Right>
  							</CardItem>
  						))}
  					</Card>
  				</View>
  				{(this.props.hasVoted || this.state.hasVoted) ? (
  					<View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
  						<Text style={{fontSize: 20}}>You have been voted.</Text>
  					</View>
  				) : (
  					<View>
  						<View style={styles.viewNotation}>
  							<Text style={{fontWeight: 'bold'}}>Please take your poll too.</Text>
  						</View>
  						<FlatList
  							data={params.pollschoices}
  							keyExtractor={this.key}
  							style={{margin: 10, flex: 1}}
  							numColumns={2}
  							renderItem={this.renderItems} />
  					</View>
  				)}
  			</Content>
  		</Container>
  	)
	}
}

const mapStateToProps = (state) => {
	return {
		hasVoted: state.hasVoted,
		params: state.params,
		fetchPollsAnswersSuccess: state.fetchPollsAnswersSuccess,
		session: state.session
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setLinkNavigate: (navigate) => dispatch(setLinkNavigate(navigate)),
		postVote: (data, accessToken) => dispatch(postVote(data, accessToken)),
		setModeReadPolls: (read) => dispatch(setModeReadPolls(read))
	}
}

const styles = StyleSheet.create({
	title: {
		fontFamily: 'SourceSansPro',
		fontSize: 18,
		fontWeight: 'bold'
	},
	container: {
		backgroundColor: '#FFFFFF'
	},
	linearGradient: {
		flex: 1,
		borderRadius: 5,
		height: 50,
		display: 'flex',		
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: 15,
		color: '#ffffff',
		backgroundColor: 'transparent',
	},
	cover: {
		width: width,
		height: height / 3
	},
	fab: {
		backgroundColor: '#5067FF'
	},
	avatar: {
		width: 40,
		height: 40,
		marginLeft: 10
	},
	comment: {
		flex: 1
	},
	viewPolls: {
		margin: 15
	},
	viewNotation: {
		margin: 15,
		marginTop: 5
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeContainer(ModeReadVoting))