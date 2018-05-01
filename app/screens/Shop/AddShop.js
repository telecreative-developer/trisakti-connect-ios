import React from 'react'
import {
  View,
  Image,
  StyleSheet,
  ToastAndroid,
  BackHandler,
  Dimensions,
  TouchableHighlight
} from 'react-native'
import {
  Container,
  Text,
  Form,
  Item,
  Input,
  Icon,
  Content,
  Button,
  Textarea,
  Picker,
  Header,
  Body,
  Right,
  Left,
  Spinner
} from 'native-base'
import ImagePicker from 'react-native-image-picker'
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons'
import SimpleLineIcons from 'react-native-vector-icons/dist/SimpleLineIcons'
import { fetchShopCategory, postShop } from '../../actions/shop'
import { setLinkNavigate } from '../../actions/processor'
import noImageFound from '../../assets/images/no-image-found.jpg'
import { connect } from 'react-redux'
import { isEmpty } from 'validator'
import ThemeContainer from '../ThemeContainer'

const { width, height } = Dimensions.get('window')

class AddShop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      cover: '',
      coverChanged: false,
      price: 0,
      descrption: '',
      shopcategory_id: 1
    }
  }

  componentWillMount() {
    this.props.fetchShopCategory(this.props.session.accessToken)
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

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    }

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        this.setState({
          cover: this.state.cover
        })
      } else {
        this.setState({
          cover: `data:image/jpeg;base64,${response.data}`,
          coverChanged: true
        })
      }
    })
  }

  renderButtons() {
    const { session } = this.props
    if (this.state.name && this.state.price && this.state.descrption && this.state.cover) {
      if (this.props.loading.condition && this.props.loading.process_on === 'post_shop') {
        return (
          <Button full style={[styles.button, { backgroundColor: '#999999' }]}>
            <Spinner color="#FFFFFF" />
          </Button>
        )
      }

      return (
        <Button
          full
          style={styles.button}
          onPress={async () => {
            await this.props.postShop(
              {
                name: this.state.name,
                cover: this.state.cover,
                price: this.state.price,
                description: this.state.descrption,
                shopcategory_id: this.state.shopcategory_id,
                id: session.id
              },
              session.accessToken
            )
            await this.backPressed()
            await ToastAndroid.show('Barang berhasil diunggah', ToastAndroid.SHORT)
          }}>
          <Text style={styles.textButton}>Jual Barang</Text>
        </Button>
      )
    }

    return (
      <Button full style={[styles.button, { backgroundColor: '#999999' }]}>
        <Text style={styles.textButton}>Jual Barang</Text>
      </Button>
    )
  }

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <Left style={styles.left}>
            <Button transparent onPress={this.backPressed}>
              <Icon name="close" style={styles.iconClose} />
            </Button>
          </Left>
          <Body style={styles.body}>
            <Text style={styles.textBody}> Jual Barang </Text>
          </Body>
          <Right style={styles.right} />
        </Header>
        <Content>
          <View style={styles.wrapBox}>
            <Form>
              <TouchableHighlight onPress={() => this.selectPhotoTapped()}>
                {this.state.cover ? (
                  <Image source={{ uri: this.state.cover }} style={styles.imageBarang} />
                ) : (
                  <Image source={noImageFound} style={styles.imageBarang} />
                )}
              </TouchableHighlight>
              <Item>
                <Input
                  placeholder="Nama Barang"
                  value={this.state.name}
                  onChangeText={name => this.setState({ name })}
                />
              </Item>
              <Item>
                <Input
                  placeholder="Harga Barang"
                  value={this.state.price}
                  keyboardType="numeric"
                  onChangeText={price => this.setState({ price })}
                />
              </Item>
              <Picker
                iosHeader="Select one"
                mode="dropdown"
                selectedValue={this.state.shopcategory_id}
                style={styles.picker}
                onValueChange={shopcategory_id => this.setState({ shopcategory_id })}>
                {this.props.shopCategory.map((data, index) => (
                  <Picker.Item label={data.name} value={data.shopcategory_id} />
                ))}
              </Picker>
              <Textarea
                rowSpan={5}
                bordered
                placeholder="Detail Barang"
                value={this.state.descrption}
                onChangeText={descrption => this.setState({ descrption })}
                style={styles.textarea}
              />
              {this.renderButtons()}
            </Form>
          </View>
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  console.log('Loading', state.loading)
  return {
    session: state.session,
    loading: state.loading,
    shopCategory: state.shopCategory
  }
}

const mapDispatchToProps = dispatch => ({
  postShop: (data, accessToken) => dispatch(postShop(data, accessToken)),
  fetchShopCategory: accessToken => dispatch(fetchShopCategory(accessToken)),
  setLinkNavigate: data => dispatch(setLinkNavigate(data))
})

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row'
  },
  header: {
    backgroundColor: '#2989d8'
  },
  iconClose: {
    color: '#fff'
  },
  left: {
    flex: 0.2
  },
  body: {
    flex: 0.6
  },
  textBody: {
    color: '#fff',
    alignSelf: 'center'
  },
  right: {
    flex: 0.2
  },
  viewHarga: {
    flex: 0.7
  },
  viewStock: {
    flex: 0.3
  },
  imageBarang: {
    width: width,
    height: 200
  },
  wrapBox: {
    paddingTop: 10
  },
  iconSearch: {
    marginLeft: 10
  },
  picker: {
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  textarea: {
    margin: 10
  },
  button: {
    backgroundColor: '#2989d8',
    margin: 10
  },
  textButton: {
    color: '#fff'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeContainer(AddShop))
