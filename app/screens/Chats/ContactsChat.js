/* @flow */
import React, { Component } from 'react'
import { FlatList, StyleSheet, BackHandler } from 'react-native'
import { Container, ListItem, Left, Button, Thumbnail, Body, Text, Icon, Header } from 'native-base'
import { connect } from 'react-redux'
import ThemeContainer from '../ThemeContainer'
import { setLinkNavigate } from '../../actions/processor'
import { setNavigate } from "../../actions/processor"
import defaultPhotoProfile from '../../assets/images/default-user.png'

class ContactsChat extends Component<{}> {

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backPressed);
  }

  componentWillUnmount() {
		this.props.setLinkNavigate({navigate: '', data: ''})
    BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
	}

  
  async handleBack() {
    await this.props.navigation.goBack()
    await this.props.setLinkNavigate({navigate: '', data: ''})
  }

  renderItems = ({item}) => {
    return (
      <ListItem avatar onPress={() => this.props.setLinkNavigate({navigate: 'ModeChatting', data: {id: item.users[0].id, myid: this.props.session.id, users: item.users}})} style={{margin: 10}}>
        <Left>
          {(item.users[0].avatar !== '') ? (
            <Thumbnail source={{uri: item.users[0].avatar}} />
          ) : (
            <Thumbnail source={defaultPhotoProfile} />
          )}
        </Left>
        <Body>
          <Text style={{fontSize: 16}}>{item.users[0].name}</Text>
        </Body>
      </ListItem>
    )
  }

  key = (item, index) => index

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.handleBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body />
        </Header>
        <FlatList
          data={this.props.friends}
          renderItem={this.renderItems}
          keyExtractor={this.key} />
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    friends: state.fetchFriendsSuccess,
    session: state.session
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setLinkNavigate: (navigate) => dispatch(setLinkNavigate(navigate)),
    setNavigate: (link, data) => dispatch(setNavigate(link, data))
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeContainer(ContactsChat))