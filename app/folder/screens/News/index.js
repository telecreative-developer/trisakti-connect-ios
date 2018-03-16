/* @flow */
import React, { Component } from 'react'
import { Tabs, Tab, ScrollableTab } from 'native-base'
import { connect } from 'react-redux'
import Headline from './Headline'
import OthersNews from './OthersNews'
import Voting from './Voting'
import Jobs from './Jobs'

class News extends Component<{}> {
	renderScrollableTab() {
		return <ScrollableTab />
  }
  
	render(){
		return (
			<Tabs renderTabBar={this.renderScrollableTab} style={{backgroundColor: '#FFFFFF'}}>
				<Tab heading='Headline'>
					<Headline />
				</Tab>
				<Tab heading='IKA-USAKTI'>
					<OthersNews news={this.props.news.filter(data => data.id_category === 1)} />
				</Tab>
				<Tab heading='Voting'>
					<Voting />
				</Tab>
				<Tab heading='Our Campus'>
					<OthersNews news={this.props.news.filter(data => data.id_category === 2)} />
				</Tab>
				<Tab heading='Trisakti Career'>
					<Jobs />
				</Tab>
				<Tab heading='Entertainment'>
					<OthersNews news={this.props.news.filter(data => data.id_category === 3)} />
				</Tab>
			</Tabs>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		news: state.news
	}
}

export default connect(mapStateToProps)(News)