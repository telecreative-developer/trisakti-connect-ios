import React from 'react'
import { View, Image, FlatList, BackHandler, StyleSheet, Dimensions, StatusBar } from 'react-native'
import { Container, Text, Item, Input, Icon, Content, Thumbnail, Button } from 'native-base'
import Feather from 'react-native-vector-icons/dist/Feather'
import { connect } from 'react-redux'
import { setLinkNavigate } from '../../actions/processor'
import { fetchShopWithCategory } from '../../actions/shop'
import moment from 'moment'
import defaultAvatar from '../../assets/images/default-user.png'
import ImageNotFound from '../../assets/images/shopping-bag.png'
const { width, height } = Dimensions.get('window')

class SearchableFlatlist extends React.Component {
  static INCLUDES = 'includes'
  static WORDS = 'words'
  getFilteredResults() {
    let { data, type, searchProperty, searchTerm } = this.props
    return data.filter(
      item =>
        type && type === SearchableFlatlist.WORDS
          ? new RegExp(`\\b${searchTerm}`, 'gi').test(item[searchProperty])
          : new RegExp(`${searchTerm}`, 'gi').test(item[searchProperty])
    )
  }
  render() {
    return <FlatList {...this.props} data={this.getFilteredResults()} />
  }
}

class DetailCategory extends React.Component {
  constructor() {
    super()

    this.state = {
      search: ''
    }
  }

  componentWillMount() {
    this.props.fetchShopWithCategory(
      this.props.navigation.state.params.shopcategory_id,
      this.props.session.accessToken
    )
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
    return (
      <Container>
        <StatusBar
					backgroundColor="#fff"
					barStyle="light-content"
				/>
        <View style={{backgroundColor: '#2989d8'}}>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={styles.viewSearch}>
              <Item style={styles.iconSearch}>
                <Icon name="search" style={{color: '#fff'}}/>
                <Input
                  placeholder="Cari Barang"
                  placeholderTextColor='#fff'
                  value={this.state.search}
                  onChangeText={search => this.setState({ search })}
                />
              </Item>
            </View>
            <View style={styles.viewAdd}>
              <Button
                transparent
                style={{ alignSelf: 'flex-end' }}
                onPress={() => this.props.navigation.navigate('AddShop')}>
                <Icon name="add" style={styles.iconAdd} />
              </Button>
            </View>
          </View>
        </View>
        {this.props.shopWithCategory.length ? (
          <Content>
            <SearchableFlatlist
              searchProperty="name"
              searchTerm={this.state.search}
              data={this.props.shopWithCategory}
              keyExtractor={({ item, index }) => index}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.headerCard}>
                    {item.users[0].avatar ? (
                      <Thumbnail small source={{ uri: item.users[0].avatar }} />
                    ) : (
                      <Thumbnail small source={defaultAvatar} />
                    )}
                    <View style={styles.nameCard}>
                      <Text>{item.users[0].name}</Text>
                    </View>
                  </View>
                  <View style={styles.viewMargin}>
                    <Image source={{ uri: item.cover }} style={styles.image} />
                    <View>
                      <Text style={styles.textTitle}>{item.name}</Text>
                      <Text note style={styles.text.date}>
                        <Feather name="calendar" style={styles.iconDateLocation} />{' '}
                        {moment(item.createdAt).format('LL')}
                      </Text>
                      <Text style={styles.textPrice}>Rp {item.price}</Text>
                      <Text style={styles.textAddress}>{item.description}</Text>
                      <Button
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate('DetailItem', item)}>
                        <Text>Beli</Text>
                      </Button>
                    </View>
                  </View>
                </View>
              )}
            />
          </Content>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>
            <Image source={ImageNotFound} style={{ width: 200, height: 200 }} />
            <Text style={{ marginTop: 10, fontSize: 15, fontWeight: 'bold' }}>
              Untuk saat ini barang belum tersedia
            </Text>
          </View>
        )}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  session: state.session,
  shopWithCategory: state.shopWithCategory
})

const mapDispatchToProps = dispatch => ({
  fetchShopWithCategory: (shopcategory_id, accessToken) =>
    dispatch(fetchShopWithCategory(shopcategory_id, accessToken)),
  setLinkNavigate: data => dispatch(setLinkNavigate(data))
})

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row'
  },
  viewSearch: {
    flex: 0.8
  },
  viewAdd: {
    flex: 0.2
  },
  iconAdd: {
    marginTop: 10,
    color: '#fff'
  },
  viewMargin: {
    marginTop: 10
  },
  wrapBox: {
    paddingTop: 10
  },
  iconSearch: {
    color: '#fff',
    marginLeft: 10
  },
  contentShop: {
    flex: 0.33,
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 5,
    paddingBottom: 30,
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: '#f8f8f8'
  },
  text: {
    marginTop: 10,
    fontSize: 12
  },
  coverBanner: {
    width: 300,
    height: 150,
    marginRight: 10
  },
  contentBox: {
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5
  },
  textTitle: {
    fontWeight: 'bold',
    marginTop: 15,
    fontSize: 16
  },
  textAddress: {
    fontSize: 14,
    marginTop: 10
  },
  button: {
    height: 30,
    marginTop: 10,
    alignSelf: 'flex-end'
  },
  card: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 20
  },
  headerCard: {
    flexDirection: 'row',
    marginTop: 10
  },
  nameCard: {
    flexDirection: 'column',
    marginLeft: 10,
    marginTop: 5
  },
  image: {
    height: 200,
    width: null,
    flex: 1
  },
  viewDateLocation: {
    flexDirection: 'row'
  },
  iconDateLocation: {
    padding: 10
  },
  icon: {
    width: 40,
    height: 40
  },
  textPrice: {
    color: '#59a8e5',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 20
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(DetailCategory)
