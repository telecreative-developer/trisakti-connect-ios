import React from 'react'
import { View, FlatList, Image, BackHandler, StyleSheet, Dimensions } from 'react-native'
import { Container, Text, Content, Thumbnail, Button, Input, Item, Footer } from 'native-base'
import Feather from 'react-native-vector-icons/dist/Feather'
import Communications from 'react-native-communications'
import { connect } from 'react-redux'
import { setLinkNavigate } from '../../actions/processor'
import defaultAvatar from '../../assets/images/default-user.png'
import moment from 'moment'

const { width, height } = Dimensions.get('window')

class DetailItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      jumlahBarang: '1',
      hargaAsli: props.navigation.state.params.price,
      totalHarga: props.navigation.state.params.price
    }
  }

  plusBarang() {
    this.setState({
      jumlahBarang: JSON.stringify(parseInt(this.state.jumlahBarang) + 1),
      totalHarga: JSON.stringify(
        parseInt(this.state.hargaAsli) * (parseInt(this.state.jumlahBarang) + 1)
      )
    })
  }

  minusBarang() {
    this.setState({
      jumlahBarang: JSON.stringify(parseInt(this.state.jumlahBarang) - 1),
      totalHarga: JSON.stringify(
        parseInt(this.state.hargaAsli) * (parseInt(this.state.jumlahBarang) - 1)
      )
    })
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backPressed)
  }

  componentWillUnmount() {
    this.props.setLinkNavigate({navigate: '', data: ''})
    BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
  }

  backPressed = () => {
    this.props.setLinkNavigate({ link: '', data: '' })
    this.props.navigation.goBack()
    return true
  }

  render() {
    const { params } = this.props.navigation.state
    return (
      <Container>
        <Content showsVerticalScrollIndicator={false}>
          <Image source={{ uri: params.cover }} style={styles.image} />
          <View style={styles.viewMargin}>
            <Text>{params.name}</Text>
            <Text note>
              <Feather name="calendar" style={styles.iconDateLocation} />
              {moment(params.createdAt).format('LL')}
            </Text>
            <Text style={styles.textPrice}>Rp{this.state.totalHarga}</Text>
            <Text note>Masukkan jumlah yang diinginkan</Text>
            <Item style={styles.item}>
              <Button style={styles.button} onPress={() => this.minusBarang()}>
                <Feather name="minus" style={styles.icon} />
              </Button>
              <Input
                placeholder="Jumlah barang"
                keyboardType="numeric"
                value={this.state.jumlahBarang}
              />
              <Button style={styles.button} onPress={() => this.plusBarang()}>
                <Feather name="plus" style={styles.icon} />
              </Button>
            </Item>
            <Text style={styles.textTitle}>Deskpsi Barang</Text>
            <View style={styles.DetailProduct}>
              <Text style={styles.textDetail}>{params.description}</Text>
            </View>
            <View>
              <Text style={styles.textTitle}>Nama Penjual</Text>
              <View style={styles.headerCard}>
                {params.users[0].avatar ? (
                  <Thumbnail small source={{ uri: params.users[0].avatar }} />
                ) : (
                  <Thumbnail small source={defaultAvatar} />
                )}
                <View style={styles.nameCard}>
                  <Text>{params.users[0].name}</Text>
                </View>
              </View>
            </View>
          </View>
        </Content>
        <Button full onPress={() => Communications.phonecall(params.users[0].phone, true)}>
          <Text style={styles.textButton}>Hubungi Penjual</Text>
        </Button>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  setLinkNavigate: data => dispatch(setLinkNavigate(data))
})

const styles = StyleSheet.create({
  viewMargin: {
    margin: 10
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20
  },
  image: {
    height: 300,
    width: width
  },
  headerCard: {
    flexDirection: 'row',
    margin: 10,
    marginRight: 30
  },
  nameCard: {
    flexDirection: 'column',
    marginLeft: 10,
    marginTop: 10
  },
  textAddress: {
    fontSize: 14,
    marginTop: 10
  },
  textPrice: {
    color: '#59a8e5',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10
  },
  button: {
    height: 40,
    backgroundColor: '#59a8e5'
  },
  item: {
    marginTop: 10
  },
  textDetail: {
    fontSize: 12
  },
  icon: {
    padding: 10,
    color: '#fff'
  },
  DetailProduct: {
    marginTop: 10
  },
  textButton: {
    color: '#fff'
  }
})

export default connect(null, mapDispatchToProps)(DetailItem)
