/* @flow */
import React, { Component } from 'react'
import { Container, Header, Left, Button, Icon, Right, Content, List, ListItem, Body, Text } from 'native-base'
import { StyleSheet, BackHandler } from 'react-native'
import ThemeContainer from './ThemeContainer'

type State = {
  back: boolean
}

class Options extends Component<{}, State> {
  state = {
    back: false
  }
  
  componentWillMount() {
    BackHandler.addEventListener('hardwareBacPress', async () => {
      if(!this.state.back) {
        await this.setState({back: true})
      }else{
        await this.props.navigation.goBack()
      }
		})
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress')
  }
  
  render() {
    return (
      <Container style={styles.viewContainer}>
        <Header hasTabs style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon style={styles.closeButton} name='close' />
            </Button>
          </Left>
          <Right/>
        </Header>
        <Content>
          <List>
            <ListItem icon onPress={() => this.props.navigation.navigate('CreateNews')}>
              <Left>
                <Icon name='paper' />
              </Left>
              <Body>
                <Text style={{fontFamily: 'SourceSansPro', fontSize: 14, fontWeight: 'bold'}}>News</Text>
              </Body>
              <Right>
                <Icon name='arrow-forward' />
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.props.navigation.navigate('CreateJob')}>
              <Left>
                <Icon name='person' />
              </Left>
              <Body>
                <Text style={{fontFamily: 'SourceSansPro', fontSize: 14, fontWeight: 'bold'}}>Vacancy</Text>
              </Body>
              <Right>
                <Icon name='arrow-forward' />
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.props.navigation.navigate('CreateVote')}>
              <Left>
                <Icon name='stats' />
              </Left>
              <Body>
                <Text style={{fontFamily: 'SourceSansPro', fontSize: 14, fontWeight: 'bold'}}>Voting</Text>
              </Body>
              <Right>
                <Icon name='arrow-forward' />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: '#FFFFFF'
  },
  header: {
    backgroundColor: '#FFFFFF'
  },
  closeButton: {
    color:'#2367a9'
  }
})

export default ThemeContainer(Options)