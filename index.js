import React from 'react'
import { AppRegistry } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import reducers from './app/reducers'
import Reactotron from 'reactotron-react-native'
import './ReactotronConfig'
// Routes
import SplashScreen from './app/screens/Splash'
import LoginScreen from './app/screens/Login'
import RegisterScreen from './app/screens/Register'
import HomeScreen from './app/screens/Home'
import ChatsScreen from './app/screens/Chats'
import NewsScreen from './app/screens/News'
import ReportScreen from './app/screens/Report'
import SearchScreen from './app/screens/Search'
import OptionsScreen from './app/screens/Options'
import PersonProfile from './app/screens/Profile/PersonProfile'
import ModeReadNews from './app/screens/News/ModeReadNews'
import ModeReadJob from './app/screens/News/ModeReadJob'
import ModeReadVoting from './app/screens/News/ModeReadVoting'
import ModeChatting from './app/screens/Chats/ModeChatting'
import EditProfile from './app/screens/Profile/EditProfile'
import CardProfile from './app/screens/Profile/CardProfile'
import ContactsChat from './app/screens/Chats/ContactsChat'
import CreateNews from './app/screens/News/CreateNews'
import CreateJob from './app/screens/News/CreateJob'
import CreateVote from './app/screens/News/CreateVote'

const App = StackNavigator({
	Splash: {screen: SplashScreen},
  Login: {screen: LoginScreen},
  Register: {screen: RegisterScreen},
	Report: {screen: ReportScreen},
	Home: {screen: HomeScreen},
	News: {screen: NewsScreen},
	Chats: {screen: ChatsScreen},
	Search: {screen: SearchScreen},
	Options: {screen: OptionsScreen},
	PersonProfile: {screen: PersonProfile},
	ModeReadNews: {screen: ModeReadNews},
	ModeReadJob: {screen: ModeReadJob},
	ModeChatting: {screen: ModeChatting},
	ModeReadVoting: {screen: ModeReadVoting},
	EditProfile: {screen: EditProfile},
	CardProfile: {screen: CardProfile},
	ContactsChat: {screen: ContactsChat},
	CreateNews: {screen: CreateNews},
	CreateJob: {screen: CreateJob},
	CreateVote: {screen: CreateVote}
}, {
	headerMode: 'none'
})

const store = Reactotron.createStore(reducers, applyMiddleware(thunk))
const persistor = persistStore(store)

const TrisaktiConnect = () => (
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<App />
		</PersistGate>
	</Provider>
)

AppRegistry.registerComponent('TrisaktiConnect', () => TrisaktiConnect);
