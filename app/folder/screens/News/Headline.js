/* @flow */
import React, { Component } from 'react'
import { FlatList, Image, View, BackHandler, StyleSheet, TouchableNativeFeedback } from 'react-native'
import { Left, Thumbnail, Card, Badge, Right, Body, CardItem, Text, H3 } from 'native-base'
import { connect } from 'react-redux'
import moment from 'moment'
import { setLinkNavigate } from '../../actions/processor'
import { setModeReadNews, setContentReadNews, fetchAllNews, fetchAllNewsRealtime } from '../../actions/news'
import defaultAvatar from '../../assets/images/default-user.png'

type State = {
  loading: boolean
}

class Headline extends Component<{}, State> {
  state = {
    loading: false
	}

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress')
  }

  async componentWillMount() {
    await this.setState({loading: true})
    await this.props.fetchAllNews(this.props.accessToken)
    await this.props.fetchAllNewsRealtime(this.props.accessToken)
    await this.setState({loading: false})
  }

	async handleFullRead(item) {
    await this.props.setLinkNavigate({navigate: 'ModeReadNews', data: item})
	}

	async handleRefresh() {
		await this.setState({loading: true})
		await this.props.fetchAllNews(this.props.accessToken)
		await this.setState({loading: false})
  }
  
  renderItems = ({item}) => (
  	<TouchableNativeFeedback onPress={() => this.handleFullRead(item)}>
  		<Card>
  			<CardItem cardBody>
  				<Image source={{uri: item.thumbnail}} style={styles.cover}/>
  			</CardItem>
  			<CardItem cardBody style={styles.cardFooter}>
  				<Text style={styles.title}>{item.title}</Text>
  				<Text numberOfLines={3} style={{fontSize: 14, fontFamily: 'SourceSansPro-Regular'}} ellipsizeMode='tail' >{item.content}</Text>
  			</CardItem>
  			<CardItem style={styles.cardItem}>
  				<Left>
  					{(item.users[0].avatar !== '') ? (
  						<Thumbnail source={{uri: item.users[0].avatar}} style={styles.avatar} />
  					) : (
  						<Thumbnail source={defaultAvatar} style={styles.avatar} />
  					)}
  					<Body>
  						<Text style={styles.name}>{item.users[0].name}</Text>
  						<Text style={styles.date} note>{moment(item.createdAt).format('lll')}</Text>
  					</Body>
  				</Left>
  				<Right>
  					<View style={styles.badgeCategory}>
  						<Text style={styles.label} note>{item.categories[0].category}</Text>
  					</View>
  				</Right>
  			</CardItem>
  		</Card>
  	</TouchableNativeFeedback>
  )

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
    news: state.news,
    accessToken: state.session.accessToken,
    loadingCondition: state.loading.condition,
    loadingOn: state.loading.process_on
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
    fetchAllNews: (accessToken) => dispatch(fetchAllNews(accessToken)),
    fetchAllNewsRealtime: (accessToken) => dispatch(fetchAllNewsRealtime(accessToken)),
    setLinkNavigate: (navigate) => dispatch(setLinkNavigate(navigate)),		
		setModeReadNews: (mode) => dispatch(setModeReadNews(mode)),
		setContentReadNews: (content) => dispatch(setContentReadNews(content))
	}
}

const styles = StyleSheet.create({
	cover: {
		height: 200,
		width: null,
		flex: 1
	},
	cardFooter: {
		margin: 15,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start'
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		fontFamily: 'SourceSansPro'
	},
	avatar: {
		height: 30,
		width: 30
	},
	name: {
		fontSize: 11,
		color: '#D35C72'
	},
	date: {
		fontSize: 11
	},
	label: {
		color: '#FFFFFF',
		fontSize: 12
  },
  cardItem: {
    marginBottom: 20
  },
  badgeCategory: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'#1ABC9C',
		width: 60,
		height: 25,
		borderRadius: 3
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Headline)