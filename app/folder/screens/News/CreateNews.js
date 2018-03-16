import React, { Component } from 'react'
import { StyleSheet, Image, View, Dimensions, TouchableOpacity, FlatList, AsyncStorage, Alert, BackHandler } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import { connect } from 'react-redux'
import { publishNews } from '../../actions/news'
import { isEmpty } from 'validator'
import { Container, Header, Content, FooterTab, Left, Footer, ListItem, H1, Input, Body, Right, Text, Button, Icon, Title } from 'native-base'
import ThemeContainer from '../ThemeContainer'
import { setLinkNavigate } from '../../actions/processor'

const { height, width } = Dimensions.get('window')

class CreateNews extends Component {
	constructor() {
		super()
    
		this.state = {
			title: '',
			content: '',
			id_category: 1,
			status: 'Pending',
			category: 'IKA-USAKTI',
			openCategory: false,
			preview: false,
			thumbnail: null,
			thumbnailBase64: '',
			data: [
				{
					id_category: 1,
					category: 'IKA-USAKTI'
				},
				{
					id_category: 2,
					category: 'Campus'
				},
				{
					id_category: 3,
					category: 'Entertainment'
				}
			]
		}
    
		this.handleSelectThumbnail = this.handleSelectThumbnail.bind(this)
		this.handlePublishNews = this.handlePublishNews.bind(this)
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBacPress', () => {
			this.handleBack()
		})
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress')
	}

	async handleBack() {
		await this.props.navigation.goBack()
    await this.props.setLinkNavigate({navigate: '', data: ''})
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
  
  key = (item, index) => index

  renderItems = ({item}) => (
  	<ListItem onPress={() => this.setState({id_category: item.id_category, category: item.category, openCategory: false})}>
  		<Text>{item.category}</Text>
  	</ListItem>
  )

  handlePublishNews() {
  	const { thumbnailBase64, title, content, status, id_category } = this.state
  	let data = {
  		title: title,
  		content: content,
  		status: status,
  		id: this.props.session.id,
  		claps: 0,
  		id_category: id_category
  	}
  	if(isEmpty(thumbnailBase64)) {
  		Alert.alert('Masukan gambar')
  	}else if(isEmpty(title)) {
  		Alert.alert('Judul tidak boleh kosong')
  	}else if(isEmpty(content)) {
  		Alert.alert('Content tidak boleh kosong')
  	}else {
  		Alert.alert(
  			'Publish news',
  			'Are you sure to publish news?',
  			[
  				{text: 'Cancel', onPress: () => {}, style: 'cancel'},
  				{text: 'Publish', onPress: () => {
  					this.props.publishNews(thumbnailBase64, data, this.props.session.accessToken)
  					this.props.navigation.goBack()
  				}},
  			],
  			{ cancelable: false }
  		)
  	}
  }

  render() {
  	if(this.state.preview) {
  		return (
  			<Container style={styles.container}>
  				<Header>
  					<Left>
  						<Button transparent onPress={() => this.setState({preview: false})}>
  							<Icon name='arrow-back' />
  						</Button>
  					</Left>
  					<Body>
  						<Title>Preview</Title>
  					</Body>
  					<Right />
  				</Header>
  				<Content>
  					<View style={styles.viewImage}>
  						<Image source={this.state.thumbnail} style={styles.thumbnail} />
  					</View>
  					<View style={styles.viewNews}>
  						<H1 style={{fontFamily: 'SourceSansPro', fontSize: 18, fontWeight: 'bold'}}>{this.state.title}</H1>
  						<Text style={{fontFamily: 'SourceSansPro', fontSize: 14}} note>{this.state.category}</Text>
  						<Text style={{fontFamily: 'SourceSansPro', fontSize: 14}}>{this.state.content}</Text>
  					</View>
  				</Content>
  				<Footer>
  					<FooterTab>
  						<Button onPress={this.handlePublishNews}>
  							<Text style={{color: '#FFFFFF'}}>Publish</Text>
  						</Button>
  					</FooterTab>
  				</Footer>
  			</Container>
  		)
  	}
  	if(this.state.openCategory) {
  		return (
  			<Container style={styles.container}>
  				<Header>
  					<Left>
  						<Button transparent onPress={() => this.setState({openCategory: false})}>
  							<Icon name='close' />
  						</Button>
  					</Left>
  					<Body>
  						<Title>Select Category</Title>
  					</Body>
  					<Right/>
  				</Header>
  				<Content>
  					<FlatList
  						data={this.state.data}
  						keyExtractor={this.key}
  						renderItem={this.renderItems} />
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
  					<Title>Create News</Title>
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
  					<Input value={this.state.title} placeholder='Title...' style={{fontSize: 18, fontFamily: 'SourceSansPro', fontWeight: 'bold'}} onChangeText={(title) => this.setState({title})} />
  					<Input multiline style={{fontFamily: 'SourceSansPro', fontSize: 14}} value={this.state.content} placeholder='Content...' onChangeText={(content) => this.setState({content})} />
  				</View>
  			</Content>
  			<Footer style={{backgroundColor: '#f2f2f2'}}>
  				<Left>
  					<Button transparent onPress={() => this.setState({openCategory: true})}>
  						<Icon name='pricetag' style={{marginRight: -10}} />
  						<Text style={{fontFamily: 'SourceSansPro', fontSize: 16}}>{this.state.category}</Text>
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
		publishNewsSuccess: state.publishNewsSuccess,
		session: state.session
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setLinkNavigate: (navigate) => dispatch(setLinkNavigate(navigate)),
		publishNews: (thumbnailBase64, data, accessToken) => dispatch(publishNews(thumbnailBase64, data, accessToken))
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
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeContainer(CreateNews))