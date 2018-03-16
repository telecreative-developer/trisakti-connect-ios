/* @flow */
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Container, Body, Title, Content, Right, Header, Left, Button, Icon, Form, Item, Label, Input } from 'native-base'

type State = {
  name: string,
  email: string,
  phone: string,
  address: string,
  kecamatan: string,
  kelurahan: string,
  provinsi: string,
  postcode: number,
  birth: string,
  birth_place: string
}

class RegisterStepSecond extends Component<{}, State> {
  state = {
    name: '',
    email: '',
    phone: '',
    address: '',
    kecamatan: '',
    kelurahan: '',
    provinsi: '',
    postcode: 0,
    birth: '',
    birth_place: ''
  }

  handleBackButton() {
    this.props.navigation.goBack()
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
              <Label>Nama Lengkap</Label>
              <Input disabled value={this.state.name} onChangeText={(name) => this.setState({name})} style={styles.inputDisabled} />
            </Item>
            <Item stackedLabel>
              <Label>Email</Label>
              <Input keyboardType='email-address' value={this.state.email} onChangeText={(email) => this.setState({email})} />
            </Item>
            <Item stackedLabel>
              <Label>No Telpon</Label>
              <Input keyboardType='numeric' value={this.state.phone} onChangeText={(phone) => this.setState({phone})} />
            </Item>
            <Item stackedLabel>
              <Label>Alamat</Label>
              <Input value={this.state.address} onChangeText={(address) => this.setState({address})} />
            </Item>
            <Item stackedLabel>
              <Label>Kecamatan</Label>
              <Input value={this.state.kecamatan} onChangeText={(kecamatan) => this.setState({kecamatan})} />
            </Item>
            <Item stackedLabel>
              <Label>Kelurahan</Label>
              <Input value={this.state.kelurahan} onChangeText={(kelurahan) => this.setState({kelurahan})} />
            </Item>
            <Item stackedLabel>
              <Label>Provinsi</Label>
              <Input value={this.state.provinsi} onChangeText={(provinsi) => this.setState({provinsi})} />
            </Item>
            <Item stackedLabel>
              <Label>Kode Pos</Label>
              <Input keyboardType='numeric' value={this.state.postcode} onChangeText={(postcode) => this.setState({postcode})} />
            </Item>
            <Item stackedLabel>
              <Label>Tanggal Lahir (dd/mm/yyyy)</Label>
              <Input value={this.state.birth} onChangeText={(birth) => this.setState({birth})} />
            </Item>
            <Item stackedLabel>
              <Label>Tempat Lahir</Label>
              <Input value={this.state.birth_place} onChangeText={(birth_place) => this.setState({birth_place})} />
            </Item>
            <View style={styles.viewButton}>
              <Button block rounded onPress={() => this.handleValidationRegister2()}>
                <Text>Lanjutkan</Text>
              </Button>
            </View>
          </Form>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
		backgroundColor: '#FFFFFF'
  },
  viewButton: {
		margin: 10,
		width: '90%'
  },
  inputDisabled: {
		color: '#757575'
	}
})

export default RegisterStepSecond