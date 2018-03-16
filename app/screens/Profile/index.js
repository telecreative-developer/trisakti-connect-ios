/* @flow */
import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Container, Spinner, List, ListItem, Header, Left, Body, Title, Form, Label, Item, Input, Right, Button, Text, Icon, Content, Thumbnail } from 'native-base'
import ThemeContainer from '../ThemeContainer'
import moment from 'moment'
import defaultAvatar from '../../assets/images/default-user.png'
import { setLinkNavigate } from '../../actions/processor'

class Profile extends Component<{}> {
	render() {
		return (
			<Container style={styles.container}>
				<Content>
					<List>
						<ListItem avatar>
							<Left>
								{(this.props.dataUser.avatar !== '') ? (
									<Thumbnail large source={{uri: this.props.dataUser.avatar}} />
								) : (
									<Thumbnail large source={defaultAvatar} />
								)}
							</Left>
							<Body>
								<View style={styles.viewProfileText}>
									<Text style={{fontWeight: 'bold'}}>{this.props.dataUser.name}</Text>
									<Text note>{this.props.dataUser.email}</Text>
								</View>
								<View style={styles.button}>
									<Button iconLeft small style={styles.buttonEdit} onPress={() => this.props.setLinkNavigate({navigate: 'EditProfile'})}>
										<Text>Edit Profile</Text>
									</Button>
									<Button bordered iconLeft small onPress={() => this.props.setLinkNavigate({navigate: 'CardProfile', data: {name: this.props.dataUser.name}})}>
										<Icon name="flash" size={8}/>
										<Text>Membership Card</Text>
									</Button>
								</View>
							</Body>
						</ListItem>
					</List>
					<Form>
						<Item stackedLabel>
							<Label style={{fontSize: 14, fontWeight: 'bold'}}>NIM</Label>
							<Input value={this.props.dataUser.nim} style={styles.inputDisabled} disabled />
						</Item>
						<Item stackedLabel>
							<Label style={{fontSize: 14, fontWeight: 'bold'}}>Fullname</Label>
							<Input value={this.props.dataUser.name} style={styles.inputDisabled} disabled />
						</Item>
						<Item stackedLabel>
							<Label style={{fontSize: 14, fontWeight: 'bold'}}>Email</Label>
							<Input value={this.props.dataUser.email} style={styles.inputDisabled} disabled />
						</Item>
						<Item stackedLabel>
							<Label style={{fontSize: 14, fontWeight: 'bold'}}>Address</Label>
							<Input value={this.props.dataUser.address} style={styles.inputDisabled} disabled />
						</Item>
						<Item stackedLabel>
							<Label style={{fontSize: 14, fontWeight: 'bold'}}>Phone</Label>
							<Input value={this.props.dataUser.phone} style={styles.inputDisabled} disabled />
						</Item>
						<Item stackedLabel>
							<Label style={{fontSize: 14, fontWeight: 'bold'}}>Graduated</Label>
							<Input value={this.props.dataUser.graduated} style={styles.inputDisabled} disabled />
						</Item>
						<Item stackedLabel>
							<Label style={{fontSize: 14, fontWeight: 'bold'}}>Date of Birth</Label>
							<Input value={moment(this.props.dataUser.birth).format('LL')} style={styles.inputDisabled} disabled />
						</Item>
						<Item stackedLabel>
							<Label style={{fontSize: 14, fontWeight: 'bold'}}>Major</Label>
							<Input value={this.props.dataUser.majors[0].major} style={styles.inputDisabled} disabled />
						</Item>
						<Item stackedLabel>
							<Label style={{fontSize: 14, fontWeight: 'bold'}}>Faculty</Label>
							<Input value={this.props.dataUser.faculties[0].faculty} style={styles.inputDisabled} disabled />
						</Item>
						<Item stackedLabel>
							<Label style={{fontSize: 14, fontWeight: 'bold'}}>Facebook</Label>
							<Input value={`https://facebook.com/${this.props.dataUser.facebook}`} style={styles.inputDisabled} disabled />
						</Item>
						<Item stackedLabel>
							<Label style={{fontSize: 14, fontWeight: 'bold'}}>Twitter</Label>
							<Input value={`https://twitter.com/${this.props.dataUser.twitter}`} style={styles.inputDisabled} disabled />
						</Item>
						<Item stackedLabel>
							<Label style={{fontSize: 14, fontWeight: 'bold'}}>Linkedin</Label>
							<Input value={`https://linkedin.com/in/${this.props.dataUser.linkedin}`} style={styles.inputDisabled} disabled />
						</Item>
					</Form>
					<TouchableOpacity onPress={() => this.props.setLinkNavigate({navigate: 'Logout'})} style={{display: 'flex', flexDirection: 'row', margin: 15, alignItems: 'center'}}>
						<Icon name='exit' style={{marginRight: 10}} />
						<Text>Log out</Text>
					</TouchableOpacity>
				</Content>
			</Container>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		dataUser: state.dataUser
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setLinkNavigate: (navigate) => dispatch(setLinkNavigate(navigate))
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	},
	viewProfileText: {
		marginBottom: 10
	},
	button: {
		display: 'flex',
		flexDirection: 'row'
	},
	buttonEdit: {
		marginRight: 10
	},
	inputDisabled: {
		fontSize: 14,
		color: '#C7C7C7'
	},
	email: {
		fontSize: 15,
		color: '#FFFFFF'
	},
	name: {
		fontSize: 20,
		color: '#FFFFFF'
	},
	viewImage: {
		display: 'flex',
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#2989d8'
	},
	badge: {
		backgroundColor: '#EAEAEA',
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeContainer(Profile))