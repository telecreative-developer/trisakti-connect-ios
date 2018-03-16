import React, { Component } from 'react'
import ImagePicker from 'react-native-image-picker'
import { Image, TouchableOpacity, FlatList, StyleSheet, Dimensions, View, Alert, BackHandler } from 'react-native'
import { Container, Header, H1, H2, Card, CardItem, Input, FooterTab, List, Item, ListItem, Left, Button, Icon, Body, Right, Content, Title, Footer, Text } from 'native-base'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import { isEmpty } from 'validator'
import { addVoteList, publishVoteThumbnail, removeVoteList } from '../../actions/polls'
import ThemeContainer from '../ThemeContainer'

const { width, height } = Dimensions.get('window')

class CreateVote extends Component {
  constructor() {
    super()

    this.state = {
      title: '',
      content: '',
      newVote: '',
      preview: false,
      openAddVote: false,
      visibleModalAdd: false,
			thumbnail: null,
      thumbnailBase64: ''
    }

    this.handleSelectThumbnail = this.handleSelectThumbnail.bind(this)
    this.handleOpenVote = this.handleOpenVote.bind(this)
  }

  componentWillMount() {
		BackHandler.addEventListener('hardwareBacPress', () => {
			this.props.navigation.goBack()
		})
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress')
	}

  handleSelectThumbnail() {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true
			}
		}
    
		ImagePicker.showImagePicker(options, (response) => {
			if(response.didCancel) {
				this.setState({thumbnail: this.state.thumbnail})
			}else{
				let source = {uri: response.uri}
				this.setState({
					thumbnail: source,
					thumbnailBase64: `data:image/png;base64,${response.data}`
				})
			}
		})
  }

  handleOpenVote() {
    this.setState({openAddVote: true})
  }

  renderItems = ({item}) => {
    return (
      <List>
        <ListItem>
          <Body>
            <Text>{item.name}</Text>
          </Body>
          <Right>
            <Button transparent onPress={() => this.handleRemoveVote(item)}>
              <Icon name='close' />
            </Button>
          </Right>
        </ListItem>
      </List>
    )
  }

  async handleRemoveVote(item) {
    await this.props.removeVoteList(item)
  }

  handlePublishVote() {
    if(isEmpty(this.state.title)) {
      Alert.alert('', "Title can't empty.")
    }else if(isEmpty(this.state.content)) {
      Alert.alert('', "Content can't empty.")
    }else if(isEmpty(this.state.thumbnailBase64)) {
      Alert.alert('', "Image can't empty.")
    }else if(this.props.votes.length === 0) {
      Alert.alert('', "Vote can't empty.")
    }else{
      Alert.alert(
        'Publish vote',
        'Are you sure to publish this vote?',
        [
          {text: 'Cancel', onPress: () => {}, style: 'cancel'},
          {text: 'OK', onPress: () => this.handlePublishVoteOk()},
        ],
        { cancelable: false }
      )
    }
  }

  async handlePublishVoteOk() {
    await this.props.publishVoteThumbnail(this.state.thumbnailBase64, {title: this.state.title, content: this.state.content}, this.props.votes, this.props.session.accessToken)
    await Alert.alert('Vote published.', 'Your vote has been published.')
  }

  key = (item, index) => index

  renderModalContent = () => {
    return (
      <View style={styles.modalContent}>
        <Item regular>
          <Input placeholder='Add vote' value={this.state.newVote} onChangeText={(newVote) => this.setState({newVote})} />
        </Item>
        <Button block style={{margin: 15}} onPress={async () => {
          await this.props.addVoteList(this.state.newVote)
          await this.setState({visibleModalAdd: false, newVote: ''})}}>
          <Text>Add</Text>
        </Button>
      </View>
    )
  }
  
  render() {
    if(this.state.preview) {
      return (
        <Container style={styles.container}>
          <Header>
            <Left style={{marginRight: 10}}>
              <View>
                <Button transparent onPress={() => this.setState({preview: false})}>
                  <Icon name='arrow-back' />
                </Button>
              </View>
            </Left>
            <Body />
          </Header>
          <Content>
            <Image source={this.state.thumbnail} style={styles.cover} />
            <View style={styles.viewPolls}>
              <H2 style={{fontFamily: 'SourceSansPro', fontSize: 18, fontWeight: 'bold'}}>{this.state.title}</H2>
            </View>
            <View style={styles.viewPolls}>
              <Text style={{fontSize: 18, marginBottom: 10, fontWeight: 'bold', fontFamily: 'SourceSansPro'}}>Overview</Text>
              <Text note style={{marginBottom: 10}}>{this.state.content}</Text>
              <Card>
                <CardItem style={{backgroundColor: '#d35c72'}}>
                  <Left>
                    <Text style={{fontWeight: 'bold', color: '#FFF', fontSize: 16}}>Name</Text>
                  </Left>
                </CardItem>
              </Card>
              <Card style={{marginBottom: 20}}>
                {this.props.votes.map((value, index) => (
                  <CardItem key={index}>
                    <Left>
                      <Text style={{fontFamily: 'SourceSansPro', fontSize: 14, color: '#111'}}>{value.name}</Text>
                    </Left>
                  </CardItem>
                ))}
              </Card>
            </View>
          </Content>
          <Footer style={{backgroundColor: '#f2f2f2'}}>
            <Left />
            <Right>
              <Button transparent onPress={() => this.handlePublishVote()}>
                <Text style={{fontFamily: 'SourceSansPro', fontSize: 16}}>Publish</Text>
              </Button>
            </Right>
          </Footer>
        </Container>
      )
    }

    if(this.state.openAddVote) {
      return (
        <Container style={styles.container}>
          <Modal isVisible={this.state.visibleModalAdd}>
            {this.renderModalContent()}
          </Modal>
          <Header>
            <Left>
              <Button transparent onPress={() => this.setState({openAddVote: false})}>
                <Icon name='close' />
              </Button>
            </Left>
            <Body>
              <Title>Add Vote</Title>
            </Body>
            <Right/>
          </Header>
          <Content>
            <FlatList
              data={this.props.votes}
              keyExtractor={this.key}
              renderItem={this.renderItems} />
            <View style={{margin: 10, marginLeft: width / 4, marginRight: width / 4}}>
              <Button block rounded onPress={() => this.setState({visibleModalAdd: true})}>
                <Text>Add Vote</Text>
              </Button>
            </View>
          </Content>
        </Container>
      )
    }

    return (
      <Container style={styles.container}>
  			<Header>
  				<Left>
  					<Button transparent onPress={() => this.props.navigation.goBack()}>
  						<Icon name='close' />
  					</Button>
  				</Left>
  				<Body>
  					<Title>Create Vote</Title>
  				</Body>
  				<Right/>
  			</Header>
  			<Content>
  				<TouchableOpacity onPress={this.handleSelectThumbnail}>
  					<View style={styles.viewImage}>
  						{(this.state.thumbnail === null) ? (
  							<Icon name='camera' />
  						) : (
  							<Image source={this.state.thumbnail} style={styles.thumbnail} />
  						)}
  					</View>
  				</TouchableOpacity>
  				<View style={{margin: 10}}>
  					<Input style={{fontFamily: 'SourceSansPro', fontSize: 18, fontWeight: 'bold'}} value={this.state.title} placeholder='Title...' onChangeText={(title) => this.setState({title})} />
  					<Input style={{fontFamily: 'SourceSansPro', fontSize: 14}} value={this.state.content} placeholder='Content...' onChangeText={(content) => this.setState({content})} />
  				</View>
  			</Content>
  			<Footer style={{backgroundColor: '#f2f2f2'}}>
          <Left>
  					<Button transparent onPress={this.handleOpenVote}>
  						<Icon name='pricetag' style={{marginRight: -10}} />
  						<Text>{`${this.props.votes.length} Votes (Click to add)`}</Text>
  					</Button>
  				</Left>
  				<Right>
  					<Button transparent onPress={() => this.setState({preview: true})}>
  						<Text style={{fontFamily: 'SourceSansPro', fontSize: 16}}>Preview</Text>
  					</Button>
  				</Right>
  			</Footer>
  		</Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    votes: state.votesList,
    session: state.session
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    publishVoteThumbnail: (thumbnail, dataVote, dataChoice, accessToken) => dispatch(publishVoteThumbnail(thumbnail, dataVote, dataChoice, accessToken)),
    removeVoteList: (id) => dispatch(removeVoteList(id)),
    addVoteList: (data) => dispatch(addVoteList(data))
  }
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	},
	viewImage: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#EEEEEE',
		width: width,
		height: height / 4
	},
	thumbnail: {
		width: width,
		height: 500
	},
	viewNews: {
		margin: 10
  },
  cover: {
		width: width,
		height: height / 3
	},
  viewPolls: {
		margin: 15
	},
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeContainer(CreateVote))