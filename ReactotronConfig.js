import { reactotronRedux } from 'reactotron-redux'
import Reactotron from 'reactotron-react-native'

// then add it to the plugin list
Reactotron
	.configure({ name: 'Trisakti Connect' })
	.useReactNative()
	.use(reactotronRedux()) //  <- here i am!
	.connect() //Don't forget about me!