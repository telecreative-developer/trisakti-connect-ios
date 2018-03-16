/* @flow */
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Container, Header, Left, Icon, Spinner, Right, Form, Content, Item, Label, Input, Picker, Button, Body, Title,  } from 'native-base'

type State = {
  graduated: string,
  id_faculty: number,
  password: string
}

class RegisterStepThird extends Component<{}, State> {
  state = {
    graduated: '',
    id_faculty: 0,
    password: ''
  }
  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.handleBackButton()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Registrasi</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Angkatan</Label>
              <Input keyboardType='numeric' value={this.state.graduated} onChangeText={(graduated) => this.setState({graduated})} />
            </Item>
            <View style={{margin: 15}}>
              <Text note style={styles.textLabel}>Pilih Fakultas</Text>
              <Picker
                mode="dropdown"
                selectedValue={this.state.id_faculty}
                onValueChange={this.onValueChangeFaculty}>
                {this.props.dataFaculties.map((faculty, index) => (
                  <Item key={index} label={faculty.faculty} value={faculty.id_faculty} />
                ))}
              </Picker>
            </View>
            <View style={{margin: 15}}>
              <Text note style={{color: '#0e0e0e'}}>Pilih Jurusan</Text>
              <Picker
                mode="dropdown"
                selectedValue={this.state.id_major}
                onValueChange={this.onValueChangeMajor}>
                {this.props.dataMajors.map((major, index) => (
                  <Item key={index} label={major.major} value={major.id_major} />
                ))}
              </Picker>
            </View>
            <Item stackedLabel>
              <Label>Kata Sandi</Label>
              <Input secureTextEntry value={this.state.password} onChangeText={(password) => this.setState({password})} />
            </Item>
            <View style={styles.viewButton}>
              <Button block rounded onPress={() => {}}>
                {(this.props.loadingCondition) ? ( <Spinner color='white' /> ) : ( <Text>Registrasi</Text> )}
              </Button>
            </View>
          </Form>
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  loadingCondition: state.loading.condition
}

const styles = StyleSheet.create({
  container: {
		backgroundColor: '#FFFFFF'
  },
  textLabel: {
    color: '#0e0e0e'
  }
})

export default RegisterStepThird