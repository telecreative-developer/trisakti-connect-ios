import React, { Component } from 'react'
import { Tabs, Tab, Content } from 'native-base'
import { connect } from 'react-redux'
import Friends from './Friends'
import FriendsRequest from './FriendsRequest'

class Contacts extends Component<{}> {
	render() {
		return (
			<Tabs initialPage={0}>
				<Tab heading="Friends">
					<Friends />
				</Tab>
				<Tab heading="Friends Request">
					<FriendsRequest />
				</Tab>
			</Tabs>
		)
	}
}

const mapStateToProps = state => ({
	fetchFriendRequestSuccess: state.fetchFriendRequestSuccess
})

export default connect(mapStateToProps)(Contacts)
