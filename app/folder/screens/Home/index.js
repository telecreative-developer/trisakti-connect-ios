import React, { Component } from 'react'
import { StyleSheet, Image, BackHandler, AsyncStorage } from 'react-native'
import {
	Container,
	Header,
	Body,
	Right,
	Button,
	Icon,
	Footer,
	FooterTab
} from 'native-base'
import { connect } from 'react-redux'
import News from '../News'
import Chats from '../Chats'
import Contacts from '../Contacts'
import Profile from '../Profile'
import ThemeContainer from '../ThemeContainer'
import headerlogo from '../../assets/images/logoheader.png'

class Home extends Component {
	state = {
		title: 'News',
		active: 3,
		hasTabs: true,
		activePageFirst: false,
		activePageSecond: false,
		activePageThird: true,
		activePageFourth: false,
		activePageFifth: false
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			return true
		})
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress')
	}

	renderContent() {
		const { active } = this.state
		if (active === 2) {
			return <Chats toSearch={() => this.navigateToSearch()} />
		} else if (active === 3) {
			return <News />
		} else if (active === 4) {
			return <Contacts />
		} else if (active === 5) {
			return <Profile />
		}
		return <Contacts />
	}

	handleActivePageFirst() {
		this.setState({
			active: 1,
			activePageFirst: true,
			activePageSecond: false,
			activePageThird: false,
			activePageFourth: false,
			activePageFifth: false,
			title: 'Contacts'
		})
	}

	handleActivePageSecond() {
		this.setState({
			active: 2,
			activePageFirst: false,
			activePageSecond: true,
			activePageThird: false,
			activePageFourth: false,
			activePageFifth: false,
			title: 'Chats'
		})
	}

	handleActivePageThird() {
		this.setState({
			active: 3,
			activePageFirst: false,
			activePageSecond: false,
			activePageThird: true,
			activePageFourth: false,
			activePageFifth: false,
			title: 'News'
		})
	}

	handleActivePageFourth() {
		this.setState({
			active: 4,
			activePageFirst: false,
			activePageSecond: false,
			activePageThird: false,
			activePageFourth: true,
			activePageFifth: false,
			title: 'Discover'
		})
	}

	handleActivePageFifth() {
		this.setState({
			active: 5,
			activePageFirst: false,
			activePageSecond: false,
			activePageThird: false,
			activePageFourth: false,
			activePageFifth: true,
			title: 'Profile'
		})
	}

	navigateToSearch() {
		this.props.navigation.navigate('Search')
	}

	navigateToOption() {
		this.props.navigation.navigate('Options')
	}

	render() {
		const { linkNavigate } = this.props
		if (linkNavigate.navigate === 'ModeReadNews') {
			this.props.navigation.navigate(linkNavigate.navigate, linkNavigate.data)
		} else if (linkNavigate.navigate === 'ModeReadJob') {
			this.props.navigation.navigate(linkNavigate.navigate, linkNavigate.data)
		} else if (linkNavigate.navigate === 'ModeReadVoting') {
			this.props.navigation.navigate(linkNavigate.navigate, linkNavigate.data)
		} else if (linkNavigate.navigate === 'ModeChatting') {
			this.props.navigation.navigate(linkNavigate.navigate, linkNavigate.data)
		} else if (linkNavigate.navigate === 'PersonProfile') {
			this.props.navigation.navigate(linkNavigate.navigate, linkNavigate.data)
		} else if (linkNavigate.navigate === 'Search') {
			this.props.navigation.navigate(linkNavigate.navigate)
		} else if (linkNavigate.navigate === 'ContactsChat') {
			this.props.navigation.navigate(linkNavigate.navigate)
		} else if (linkNavigate.navigate === 'EditProfile') {
			this.props.navigation.navigate(linkNavigate.navigate)
		} else if (linkNavigate.navigate === 'CardProfile') {
			this.props.navigation.navigate(linkNavigate.navigate, linkNavigate.data)
		} else if (linkNavigate.navigate === 'Logout') {
			AsyncStorage.removeItem('session')
			this.props.navigation.navigate('Login')
		}
		return (
			<Container style={styles.container}>
				<Header hasTabs>
					<Body>
						<Image source={headerlogo} style={{ width: '100%', height: 20 }} />
					</Body>
					<Right>
						<Button transparent onPress={() => this.navigateToOption()}>
							<Icon name="create" />
						</Button>
						<Button transparent onPress={() => this.navigateToSearch()}>
							<Icon name="search" />
						</Button>
					</Right>
				</Header>
				{this.renderContent()}
				<Footer>
					<FooterTab>
						<Button
							style={styles.button}
							active={this.state.activePageFirst}
							onPress={() => this.handleActivePageFirst()}>
							<Icon name="contacts" active size={25} />
						</Button>
						<Button
							style={styles.button}
							active={this.state.activePageSecond}
							onPress={() => this.handleActivePageSecond()}>
							<Icon
								name="chatboxes"
								active={this.state.activePageSecond}
								size={25}
							/>
						</Button>
						<Button
							style={styles.button}
							active={this.state.activePageThird}
							onPress={() => this.handleActivePageThird()}>
							<Icon
								name="paper"
								active={this.state.activePageThird}
								size={25}
							/>
						</Button>
						{/* <Button
							style={styles.button}
							active={this.state.activePageFourth}
							onPress={this.handleActivePageFourth}>
							<Icon name='compass' active={this.state.activePageFourth} size={25} />
						</Button> */}
						<Button
							style={styles.button}
							active={this.state.activePageFifth}
							onPress={() => this.handleActivePageFifth()}>
							<Icon
								name="person"
								active={this.state.activePageFifth}
								size={25}
							/>
						</Button>
					</FooterTab>
				</Footer>
			</Container>
		)
	}
}

const mapStateToProps = state => ({
	linkNavigate: state.linkNavigate
})

const styles = StyleSheet.create({
	button: {
		backgroundColor: 'transparent'
	},
	container: {
		backgroundColor: '#FFFFFF'
	}
})

export default connect(mapStateToProps)(ThemeContainer(Home))
