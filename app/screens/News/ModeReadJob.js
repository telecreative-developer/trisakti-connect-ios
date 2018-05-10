import React, { Component } from 'react'
import moment from 'moment'
import { StyleSheet, BackHandler, Dimensions } from 'react-native'
import { Container, Header, Left, Button, Icon, Thumbnail, List, ListItem, Right, Content, Body, Card, CardItem, Input, Label, Item, Title, H2, Form, Text } from 'native-base'
import { View } from 'react-native'
import ThemeContainer from '../ThemeContainer'
import { connect } from 'react-redux'
import { setLinkNavigate } from '../../actions/processor'
import defaultAvatar from '../../assets/images/default-user.png'

const { width } = Dimensions.get('window')

class ModeReadJob extends Component {

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBack()
    })
  }

  componentWillUnmount() {
    this.props.setLinkNavigate({navigate: '', data: ''})
    BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
  }

  async handleBack() {
    await this.props.setLinkNavigate({navigate: '', data: ''})
    await this.props.navigation.goBack()
  }

	render() {
		const { params } = this.props.navigation.state
		return (
			<Container style={{backgroundColor: '#FFFFFF'}}>
				<Content>
					<View style={{marginTop: 20}}>
						<H2 style={styles.job_title}>{params.job_title}</H2>
						<List style={{marginBottom: 10, marginTop: 10}}>
  						<ListItem avatar onPress={() => this.props.setLinkNavigate({navigate: 'PersonProfile', data: params.users[0]})}>
  							<Left>
									{(params.users[0].avatar) ? (
										<Thumbnail style={styles.avatar} source={{uri: params.users[0].avatar}} />
									) : (
										<Thumbnail source={defaultAvatar} style={styles.avatar} />
									)}
  							</Left>
  							<Body style={{borderBottomWidth: 0, borderColor: '#FFF'}}>
  								<Text style={styles.name}>{params.users[0].name}</Text>
  								<Text style={styles.date} note>{moment(params.updatedAt).format('LLL')}</Text>
  							</Body>
  							<Right />
  						</ListItem>
  					</List>
						<Form style={{display: 'flex', flexDirection: 'row'}}>
							<Item stackedLabel style={{borderBottomWidth: 0, width: width / 2}}>
								<Label style={styles.label}>Company</Label>
								<Input style={styles.input} value={params.company} disabled />
							</Item>
							<Item stackedLabel style={{borderBottomWidth: 0, width: width / 2}}>
								<Label style={styles.label}>Job Function</Label>
								<Input style={styles.input} disabled value={params.job_function} />
							</Item>
						</Form>
						<View style={{flex: 1, flexDirection: 'row', backgroundColor: '#d35c72', padding: 10}}>
							<View style={{flex: 0.33}}>
								<Text style={styles.table_header}>Experience</Text>
							</View>
							<View style={{flex: 0.33}}>
								<Text style={styles.table_header}>Salary</Text>
							</View>
							<View style={{flex: 0.33}}>
								<Text style={styles.table_header}>Location</Text>
							</View>
						</View>	

						<View style={{flex: 1, flexDirection: 'row', marginTop: 15}}>
							<View style={{flex: 0.33}}>
								<Text style={styles.table_input}>{params.experience}</Text>
							</View>
							<View style={{flex: 0.33}}>
								<Text style={styles.table_input}>IDR {params.salary}</Text>
							</View>
							<View style={{flex: 0.33}}>
								<Text style={styles.table_input}>{params.work_location}</Text>
							</View>
						</View>	

						<View style={styles.content}>
							<Text style={styles.textOverview}>{params.overview}</Text>
						</View>
					</View>
				</Content>
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	job_title: {
		marginLeft: 15,
		fontSize: 18,
		fontWeight: 'bold'
	},
	content: {
		margin: 15,
	},
	textOverview: {
		fontSize: 14,
		lineHeight: 22
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20
	},
	date: {
		fontSize: 12
	},
	name: {
		fontSize: 12,
		color: '#D35C72'
	},
	input: {
		fontSize: 14,
		fontWeight: 'bold'
	},
	label: {
		fontSize: 14
	},
	table_input: {
		color: '#111',
		alignSelf: 'center',
		fontSize: 14
	},
	table_header: {
		color: '#fff',
		fontSize: 14,
		alignSelf: 'center',
		fontWeight: 'bold'
	}
})

const mapDispatchToProps = (dispatch) => {
  return {
    setLinkNavigate: (navigate) => dispatch(setLinkNavigate(navigate))
  }
}

export default connect(null, mapDispatchToProps)(ThemeContainer(ModeReadJob))
