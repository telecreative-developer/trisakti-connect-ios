import React, { Component } from 'react'
import QRCode from 'react-native-qrcode'
import { Container, Content, Button, Text, Card, Thumbnail, Icon, Left, Header, Body, Title, Right } from 'native-base'
import { StyleSheet, View, BackHandler, Image } from 'react-native'
import { connect } from 'react-redux'
import ThemeContainer from '../ThemeContainer'
import { setLinkNavigate } from '../../actions/processor'
import trisaktiConnectLogo from '../../assets/images/logo-membership.png'
import moment from 'moment'

class CardProfile extends Component {

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
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

  render() {
    const { dataUser } = this.props
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.handleBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body />
        </Header>
        <Content style={{paddingHorizontal: 20, paddingVertical: 20, borderRadius: 10}}>
          <Card style={{borderRadius: 10, marginBottom: 20}}>
            <View style={styles.viewImageLogo}>
              <Image source={trisaktiConnectLogo} style={styles.imageLogo} />
            </View>
            <View style={{margin: 10, alignItems: 'center'}}>
              <View style={styles.viewQrCode}>
                <QRCode
                  value={`${dataUser.nim}`}
                  size={150} />
              </View>
              <View style={{alignItems: 'center'}}>
              <Text style={styles.dataNumeric}>{dataUser.nim}</Text>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.viewDescription}>
                <View style={styles.label}>
                  <Text style={styles.dataName}>{dataUser.name}</Text>
                </View>
                <View style={styles.label}>
                  <Text style={styles.dataStyle}>{dataUser.phone}</Text>
                </View>
                <View style={styles.label}>
                  <Text style={styles.dataEmail}>{dataUser.email}</Text>
                </View>
                <View style={styles.label}>
                  <Text style={styles.dataAddress}>{dataUser.address}</Text>
                </View>
              </View>
            </View>
          </Card>
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    dataUser: state.dataUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setLinkNavigate: (navigate) => dispatch(setLinkNavigate(navigate))
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  viewDescription: {
    flex: 1,
    margin: 20,
    alignItems: 'flex-start'
  },
  viewImageLogo: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
  },
  imageLogo: {
    height: 45,
    width: '84%'
  },
  card: {
    display: 'flex',
    flexDirection: 'row'
  },
  label: {
    marginBottom: 10
  },
  viewQrCode: {
    flex: 1,
    margin: 20,
    alignItems: 'flex-start'
  },
  dataNumeric: {
    fontFamily: 'Orbitron',
    lineHeight: 30,
  },
  dataName: {
    fontFamily: 'Quantico',
    fontSize: 14,
    fontWeight: 'bold'
  },
  dataEmail: {
    fontFamily: 'Quantico',
    fontSize: 12,
    color: '#3366ff'
  },
  dataAddress: {
    fontFamily: 'Quantico',
    fontSize: 12,
    color: '#a3a3c2'
  },
  dataStyle: {
    fontFamily: 'Quantico',
    fontSize: 12
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeContainer(CardProfile))