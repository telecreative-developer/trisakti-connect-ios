import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, Alert, BackHandler } from 'react-native'
import { connect } from 'react-redux'
import { isEmpty } from 'validator'
import { Container, Header, Content, FooterTab, Picker, Card, CardItem, Right, Left, Footer, Form, Item, Label, H1, Input, Body, Text, Button, Icon, Title } from 'native-base'
import ThemeContainer from '../ThemeContainer'
import { postJob } from '../../actions/news'

const { height, width } = Dimensions.get('window')

class CreateJob extends Component {
	constructor() {
		super()

		this.state = {
			job_title: '',
			company: '',
			experience: '1 yrs',
			job_function: 'Administrative & Clerical',
			work_location: '',
			salary: '',
			overview: '',
			preview: false
		}
    
		this.onValueChangeExperience = this.onValueChangeExperience.bind(this)
		this.onValueChangeJobFunction = this.onValueChangeJobFunction.bind(this)
		this.handlePostJob = this.handlePostJob.bind(this)
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBacPress', () => {
			this.props.navigation.goBack()
		})
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress')
	}
  
	onValueChangeExperience(value) {
		this.setState({
			experience: value
		})
	}
  
	onValueChangeJobFunction(value) {
		this.setState({
			job_function: value
		})
	}
  
	handlePostJob() {
		const { job_title, experience, job_function, company, work_location, salary, overview } = this.state
		if(isEmpty(job_title)) {
			Alert.alert('', 'Title tidak boleh kosong')
		}else if(isEmpty(company)){
			Alert.alert('', 'Company tidak boleh kosong')
		}else if(isEmpty(work_location)){
			Alert.alert('', 'Work Location tidak boleh kosong')
		}else if(isEmpty(salary)){
			Alert.alert('', 'Salary tidak boleh kosong')
		}else if(isEmpty(overview)){
			Alert.alert('', 'Overview tidak boleh kosong')
		}else{
			this.props.postJob({
				id: this.props.session.id, job_title, experience, job_function, company, work_location, salary, overview
			}, this.props.session.accessToken)
			this.props.navigation.goBack()
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
						<View style={{marginTop: 10}}>
							<H1 style={{marginLeft: 15, fontWeight: 'bold'}}>{this.state.job_title}</H1>
							<Form>
								<Item stackedLabel style={{borderBottomWidth: 0}}>
									<Label>Company</Label>
									<Input value={this.state.company} />
								</Item>
								<Item stackedLabel style={{borderBottomWidth: 0}}>
									<Label>Job Function</Label>
									<Input disabled value={this.state.job_function} />
								</Item>
							</Form>
							<Card>
								<CardItem style={{backgroundColor: '#d35c72'}}>
									<Left>
										<Text style={{fontWeight: 'bold', color: '#FFF'}}>Experience</Text>
									</Left>
									<Body>
										<Text style={{fontWeight: 'bold', color: '#FFF'}}>Salary</Text>
									</Body>
									<Right>
										<Text style={{fontWeight: 'bold', color: '#FFF'}}>Location</Text>
									</Right>
								</CardItem>
							</Card>
							<Card>
								<CardItem>
									<Left>
										<Text style={{color: '#111'}}>{this.state.experience}</Text>
									</Left>
									<Body>
										<Text style={{color: '#111'}}>IDR {this.state.salary}</Text>
									</Body>
									<Right>
										<Text style={{color: '#111'}}>{this.state.work_location}</Text>
									</Right>
								</CardItem>
							</Card>
							<View style={{margin: 15}}>
								<Text>{this.state.overview}</Text>
							</View>
						</View>
					</Content>
					<Footer>
						<FooterTab>
							<Button onPress={this.handlePostJob}>
								<Text style={{color: '#FFFFFF'}}>Publish</Text>
							</Button>
						</FooterTab>
					</Footer>
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
  					<Title>Post a Job</Title>
  				</Body>
  				<Right/>
  			</Header>
  			<Content>
  				<View style={{margin: 10}}>
						<Form>
							<Item stackedLabel>
								<Label style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Company</Label>
								<Input style={{fontFamily: 'SourceSansPro', fontSize: 14}} placeholderTextColor='#CCC' placeholder='Google, Facebook, Line, etc.,' value={this.state.company} onChangeText={(company) => this.setState({company})} />
							</Item>
							<Item stackedLabel>
								<Label style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Job Title</Label>
								<Input style={{fontFamily: 'SourceSansPro', fontSize: 14}} placeholderTextColor='#CCC' placeholder='Designer, Programmer, etc.,' value={this.state.job_title} onChangeText={(job_title) => this.setState({job_title})} />
							</Item>
							<View style={{margin: 15}}>
								<Text note style={{color: '#0e0e0e', fontFamily: 'SourceSansPro', fontSize: 14}}>Years of Experience</Text>
								<Picker
									mode="dropdown"
									selectedValue={this.state.experience}
									onValueChange={this.onValueChangeExperience}>
									<Item label='1 yrs' value='1 yrs' />
									<Item label='2 yrs' value='2 yrs' />
									<Item label='3 yrs' value='3 yrs' />
									<Item label='4 yrs' value='4 yrs' />
									<Item label='5 yrs' value='5 yrs' />
									<Item label='6 yrs' value='6 yrs' />
									<Item label='7 yrs' value='7 yrs' />
									<Item label='8 yrs' value='8 yrs' />
									<Item label='9 yrs' value='9 yrs' />
									<Item label='10 yrs' value='10 yrs' />
								</Picker>
							</View>
							<View style={{margin: 15}}>
								<Text note style={{color: '#0e0e0e', fontFamily: 'SourceSansPro', fontSize: 14}}>Job Function</Text>
								<Picker
									mode="dropdown"
									selectedValue={this.state.job_function}
									onValueChange={this.onValueChangeJobFunction}>
									<Item label='Administrative & Clerical' value='Administrative & Clerical' />
									<Item label='Community Management' value='Community Management' />
									<Item label='Customer Service' value='Customer Service' />
									<Item label='Data & Analytics' value='Data & Analytics' />
									<Item label='DevOps & Cloud Management' value='DevOps & Cloud Management' />
									<Item label='Entreprise Software & System' value='Enterprise Software & System' />
									<Item label='Event Management' value='Event Management' />
									<Item label='Executive & Management' value='Executive & Management' />
									<Item label='Finance, Legal & Accounting' value='Finance, Legal & Accounting' />
									<Item label='Game Development' value='Game Development' />
									<Item label='Graphic Designer' value='Graphic Design' />
									<Item label='Hardware System' value='Hardware System' />
									<Item label='Human Recources' value='Human Resources' />
									<Item label='Logistics & Operations' value='Logistics & Operations' />
									<Item label='Marketing & PR' value='Marketing & PR' />
									<Item label='Media & Journalism' value='Media & Journalism' />
									<Item label='Mobile Development' value='Mobile Development' />
									<Item label='Project & Product Management' value='Project & Product Management' />
									<Item label='QA & Testing' value='QA & Testing' />
									<Item label='Retail & Wholesale' value='Retail & Wholesale' />
									<Item label='Sales & Business Development' value='Sales & Bussinies Development' />
									<Item label='Science & Academics' value='Science & Academic' />
									<Item label='Web Development' value='Web Development' />
									<Item label='Others' value='Others' />
								</Picker>
							</View>
							<Item stackedLabel>
								<Label style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Work Location</Label>
								<Input style={{fontFamily: 'SourceSansPro', fontSize: 14}} placeholderTextColor='#CCC' placeholder='Jakarta, Semarang, etc.,' value={this.state.work_location} onChangeText={(work_location) => this.setState({work_location})} />
							</Item>
							<Item stackedLabel>
								<Label style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Salary</Label>
								<Input style={{fontFamily: 'SourceSansPro', fontSize: 14}} placeholderTextColor='#CCC' placeholder='IDR 32000000.,' value={this.state.salary} keyboardType='numeric' onChangeText={(salary) => this.setState({salary})} />
							</Item>
							<Item stackedLabel>
								<Label style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Overview</Label>
								<Input style={{fontFamily: 'SourceSansPro', fontSize: 14}} placeholderTextColor='#CCC' placeholder='Please add job description on here.,' multiline value={this.state.overview} numberOfLines={4} onChangeText={(overview) => this.setState({overview})} />
							</Item>
						</Form>
  				</View>
  			</Content>
  			<Footer style={{backgroundColor: '#f2f2f2'}}>
  				<Left />
  				<Right>
  					<Button transparent onPress={() => this.setState({preview: true})}>
  						<Text style={{fontFamily: 'SourceSansPro', fontSize: 14}}>Preview</Text>
  					</Button>
  				</Right>
  			</Footer>
  		</Container>
  	)
	}
}

const mapStateToProps = (state) => {
	return {
		session: state.session
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		postJob: (data, accessToken) => dispatch(postJob(data, accessToken))
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

export default connect(mapStateToProps, mapDispatchToProps)(ThemeContainer(CreateJob))
