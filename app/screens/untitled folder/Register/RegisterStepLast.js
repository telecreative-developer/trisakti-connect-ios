/* @flow */
import React, { Component } from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import { Container, H2, Button } from 'native-base'
import welcomeImage from '../../assets/images/welcom.png'

class RegisterStepLast extends Component<{}> {
  render() {
    return (
      <Container style={styles.container}>
				<View style={styles.viewContainer}>
					<H2 style={styles.h2}>Thank You for Register!</H2>
					<Image source={welcomeImage} />
					<Text style={styles.textMessage}>Welcome on Trisakti Connect. For the next step, we will send an email to your account to provide you confirmation your email address.</Text>
					<Button full rounded style={styles.button} onPress={this.handleValidationRegister3}>
						<Text>Login</Text>
					</Button>
				</View>
			</Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  h2: {
    fontWeight: 'bold',
    marginBottom: 20
  },
  textMessage: {
    textAlign: 'center',
    marginTop: 20,
    color: '#111'
  },
  button: {
    margin: 20
  },
  viewContainer: {

  }
})

export default RegisterStepLast
