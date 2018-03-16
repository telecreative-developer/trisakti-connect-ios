/* @flow */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatList, View, StyleSheet, TouchableHighlight, AsyncStorage } from 'react-native'
import { Body, Text, Right, Thumbnail, Card, CardItem } from 'native-base'
import moment from 'moment'
import { setModeReadPolls, setContentReadPolls, fetchPollsAnswers, checkHasVoted, fetchPollsAnswersRealtime, fetchPolls } from '../../actions/polls'
import { setLinkNavigate } from '../../actions/processor'

type State = {
  loading: boolean
}

class Voting extends Component<{}, State> {
  state = {
    loading: false
  }

  async componentWillMount() {
    await this.setState({loading: true})
    await this.props.fetchPolls(this.props.session.accessToken)
    await this.setState({loading: false})
  }

	async handleReadPolls(item) {
    await this.props.fetchPollsAnswers(item.id_poll, this.props.session.accessToken)
		await this.props.checkHasVoted(this.props.session.id, item.id_poll, this.props.session.accessToken)
    await this.props.fetchPollsAnswersRealtime(item.id_poll, this.props.session.accessToken)
    await this.props.setLinkNavigate({navigate: 'ModeReadVoting', data: item})
	}

	async handleRefresh() {
		await this.setState({loading: true})
		await this.props.fetchPolls(this.props.session.accessToken)
		await this.setState({loading: false})
	}
  
  renderItems = ({item}) => {
  	return (
  		<TouchableHighlight onPress={() => this.handleReadPolls(item)}>
  			<Card avatar>
  				<CardItem>
  					<Body>
  						<Text numberOfLines={2} style={styles.title}>{item.title_poll}</Text>
  						<Text note style={styles.content} ellipsizeMode='tail' numberOfLines={2}>{item.content_poll}</Text>
  						<View style={styles.viewFoot}>
  							<Text note style={styles.defaultDate}>{moment(item.createdAt).format('lll')}</Text>  
  						</View>
  					</Body>
  					<Right>
  						<Thumbnail square large source={{uri: item.thumbnail_poll}} style={{width: 100, height: 100}}/>
  					</Right>
  				</CardItem>
  			</Card>
  		</TouchableHighlight>
  	)
  }

  key = (item, index) => index

  render() {
  	return (
  		<FlatList
  			data={this.props.polls}
  			keyExtractor={this.key}
  			renderItem={this.renderItems}
				refreshing={this.state.loading}
				onRefresh={() => this.handleRefresh()} />
  	)
  }
}

const mapStateToProps = (state) => {
	return {
    polls: state.fetchPollsSuccess,
		session: state.session
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
    fetchPolls: (accessToken) => dispatch(fetchPolls(accessToken)),
    setLinkNavigate: (navigate) => dispatch(setLinkNavigate(navigate)),
		checkHasVoted: (iduser, idpoll, accessToken) => dispatch(checkHasVoted(iduser, idpoll, accessToken)),
		fetchPollsAnswers: (id, accessToken) => dispatch(fetchPollsAnswers(id, accessToken)),
		fetchPollsAnswersRealtime: (id, accessToken) => dispatch(fetchPollsAnswersRealtime(id, accessToken))
	}
}

const styles = StyleSheet.create({
	title: {
		fontSize: 18,
		flex: 1,
		fontWeight: 'bold',
		fontFamily: 'SourceSansPro'
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
		fontSize: 12,
		fontFamily: 'SourcaSansPro'
	},
	defaultDate: {
		fontSize: 11,
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(Voting)