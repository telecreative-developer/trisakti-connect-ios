/**
 * Trisakti Connect
 * Kevin Hermawan
 * @flow
 */

import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import getTheme from '../native-base-theme/components'

const ThemeContainer = (WrappedComponent: React.Element): React.Element<*> => (
	class extends Component {
		render(): React.Element<*> {
			return (
				<StyleProvider style={getTheme()}>
					<WrappedComponent {...this.props} />
				</StyleProvider>
			)
		}
	}
)

export default ThemeContainer