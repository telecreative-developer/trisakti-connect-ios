/* @flow */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatList, View, StyleSheet, TouchableHighlight, Dimensions } from 'react-native'
import { Card, CardItem, Body, Text, Thumbnail } from 'native-base'
import moment from 'moment'
import defaultAvatar from '../../assets/images/default-user.png'
import { setContentReadJobs, setModeReadJobs, fetchJobs, fetchJobRealtime } from '../../actions/news'
import { setLinkNavigate } from '../../actions/processor'

type State = {
  loading: boolean
}

const { height, width } = Dimensions.get('window');

class Jobs extends Component<{}, State> {
  state = {
    loading: false
  }
  
  async componentWillMount() {
		await this.setState({loading: true})
    await this.props.fetchJobs(this.props.session.accessToken)
    await this.props.fetchJobsRealtime(this.props.session.accessToken)
		await this.setState({loading: false})
	}

	async handleRefresh() {
		await this.setState({loading: true})
		await this.props.fetchJobs(this.props.session.accessToken)
		await this.setState({loading: false})
	}

  renderItems = ({item}) => {
  	return (
  		<TouchableHighlight onPress={() => this.props.setLinkNavigate({navigate: 'ModeReadJob', data: item})}>
  			<View style={{margin: 10, borderWidth: 1, borderColor: '#ccc', padding: 15}}>
					<Text style={styles.title}>{item.job_title}</Text>
					<Text style={styles.company}>{item.company}</Text>
					<Text style={styles.content} ellipsizeMode='tail' numberOfLines={2}>{item.overview}</Text>
					<View style={styles.viewFoot}>
						{(item.users[0].avatar) ? (
							<Thumbnail source={{uri: item.users[0].avatar}} style={styles.avatar} />
						) : (
							<Thumbnail source={defaultAvatar} style={styles.avatar} />
						)}
						<View>
							<Text note style={styles.defaultTextNote}>{item.users[0].name}</Text>
							<Text note style={styles.defaultDate}>{moment(item.createdAt).format('lll')}</Text>
						</View>
					</View>
				</View>
  		</TouchableHighlight>
  	)
  }

  key = (item, index) => index

  render() {
  	return (
  		<FlatList
  			data={this.props.jobs}
  			keyExtractor={this.key}
  			renderItem={this.renderItems}
				refreshing={this.state.loading}
				onRefresh={() => this.handleRefresh()} />
  	)
  }
}

const mapStateToProps = (state) => {
	return {
    session: state.session,
    jobs: state.fetchJobSuccess
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setLinkNavigate: (navigate) => dispatch(setLinkNavigate(navigate)),
    fetchJobs: (accessToken) => dispatch(fetchJobs(accessToken)),
    fetchJobsRealtime: (accessToken) => dispatch(fetchJobRealtime(accessToken)),
		setModeReadJobs: (mode) => dispatch(setModeReadJobs(mode)),
		setContentReadJobs: (content) => dispatch(setContentReadJobs(content))
	}
}

const styles = StyleSheet.create({
	title:{
		fontSize: 18,
		fontWeight: 'bold'
	},
	content:{
		fontSize: 12,
		marginTop: 10,
		marginBottom: 10
	},
	viewFoot: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	company: {
		color: '#000000'
	},
	avatar: {
		width: 40,
		height: 40,
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

export default connect(mapStateToProps, mapDispatchToProps)(Jobs)