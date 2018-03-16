/* @flow */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatList, View, StyleSheet, TouchableNativeFeedback } from 'react-native'
import { Body, Text, Right, Thumbnail, Card, CardItem } from 'native-base'
import moment from 'moment'
import { setModeReadNews, setContentReadNews, fetchAllNews } from '../../actions/news'
import defaultAvatar from '../../assets/images/default-user.png'
import { setLinkNavigate } from '../../actions/processor'

type State = {
  loading: boolean
}

class OthersNews extends Component<{}, State> {
  state = {
    loading: false
  }

	async handleFullRead(item) {
    await this.props.setLinkNavigate({navigate: 'ModeReadNews', data: item})
	}

	async handleRefresh() {
		await this.setState({loading: true})
		await this.props.fetchAllNews(this.props.session.accessToken)
		await this.setState({loading: false})
	}
  
  renderItems = ({item}) => {
  	return (
  		<TouchableNativeFeedback onPress={() => this.handleFullRead(item)}>
  			<Card avatar>
  				<CardItem>
  					<Body>
  						<Text numberOfLines={2} style={styles.title}>{item.title}</Text>
  						<Text style={styles.content} ellipsizeMode='tail' numberOfLines={2}>{item.content}</Text>
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
  		</TouchableNativeFeedback>
  	)
  }

  key = (item, index) => index

  render() {
  	return (
  		<FlatList
  			data={this.props.news}
  			keyExtractor={this.key}
  			renderItem={this.renderItems}
				refreshing={this.state.loading}
				onRefresh={() => this.handleRefresh()} />
  	)
  }
}

const mapStateToProps = (state) => {
	return {
		session: state.session
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
    fetchAllNews: (accessToken) => dispatch(fetchAllNews(accessToken)),
    setLinkNavigate: (accessToken) => dispatch(setLinkNavigate(accessToken)),
		setModeReadNews: (mode) => dispatch(setModeReadNews(mode)),
		setContentReadNews: (content) => dispatch(setContentReadNews(content))
	}
}

const styles = StyleSheet.create({
	title: {
		flex: 1,
		fontSize: 18,
		fontWeight: 'bold',
		fontFamily: 'SourceSansPro'
  },
  thumbnail: {
    width: 100,
    height: 100
  },
	content: {
		marginTop: 10,
		marginBottom: 10,
		fontSize: 12,
		fontFamily: 'SourceSansPro'
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

export default connect(mapStateToProps, mapDispatchToProps)(OthersNews)
