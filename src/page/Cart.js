/**
* This is the Main file
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Alert, AsyncStorage,TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container, Content, View, Header, Icon, Button, Left, Right, Body, Title, List, ListItem, Thumbnail, Grid, Col, Input, Item } from 'native-base';
import { Actions } from 'react-native-router-flux';
import 'firebase/storage'
// import DocumentPicker  from 'react-native-document-picker'
// Our custom files and classes import
import Colors from '../Colors';
import Text from '../component/Text';
import Navbar from '../component/Navbar';
import Firebase from '../Firebase/firebase';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer'
import storage from '../Firebase/storagefirebase'
export default class Cart extends Component {
  constructor(props) {
      super(props);
      this.state = {
        cartItems: [],
        userdata:'',
        showfile: false,
        singleFile:'',
        url:'',
        showLoader: false,
        medicineData:[],
        placeorder:true,
        cartData:[],
        quantity:''
      };
  }


  componentDidMount () {
    this.apicall()
  }

  apicall = async() =>{
    const userdata = await AsyncStorage.getItem("userToken");
    console.log("userData", userdata)
    this.setState({
      userdata: userdata,
      showLoader: true
    })
    var array = [];
    const users = Firebase.firestore();
    const user = users.collection('MedicineList').get().then(querySnapshot =>{
        const data = querySnapshot.docs.map(doc => doc.data());
        for(var i = 0; i < data.length; i++){
            array.push({
                medicineID:data[i].medicineID,
                name:data[i].name,
                manufacture:data[i].manufacture,
                price:data[i].price,
                quantity:data[i].quantity
            })
        }
        this.setState({
          cartItems: array,
          showfile: false,
          showLoader: false
        })
    })
  }

  componentWillReceiveProps(nextProps){
    console.disableYellowBox = true;
    console.log("nexxtProps",nextProps.result)
    if(nextProps){
      this.setState({
        result: nextProps.result
      })
    }
  }

  componentWillMount() {
    AsyncStorage.getItem("CART", (err, res) => {
      if (!res) this.setState({cartItems: []});
      else this.setState({cartItems: JSON.parse(res)});
    });
  }

  render() {
    console.log("this.state.cartiem", this.state.cartItems)
    console.log("selected medicine", this.state.medicineData)
    var left = (
      <Left style={{flex:1}}>
        <Button transparent onPress={() => Actions.home()}>
          <Icon name="ios-backspace" size={38} style={{fontSize: 38}} />
        </Button>
      </Left>
    );
    return(
      <Container style={{backgroundColor: '#fdfdfd'}}>
          <Navbar left={left} title="Medicine List" />
          {this.state.showLoader ? <ActivityIndicator /> : null}
        {
          this.state.placeorder
          ?
          <Content style={{paddingRight: 10}}>
              <List>
                  {this.state.cartItems.map((item,index)=>(
                        <ListItem
                          key={index}
                          last={this.state.cartItems.length === index+1}
                          onPress={() => this.itemClicked(item)}
                        >
                          <Body style={{paddingLeft: 10}}>
                            <Text style={{fontSize: 18}}>
                              {item.name}
                            </Text>
                            <Text style={{fontSize: 14}}>
                              {item.price}
                            </Text>
                            <Text style={{fontSize: 14}}>
                              {item.manufacture}
                            </Text>
                          </Body>
                        </ListItem>
                    
                  ))}
              </List>
            </Content>
            :
            <Content style={{paddingRight: 10, marginTop:'10%'}}>
              <Grid>
              {this.state.medicineData.map((item,index)=>(
                <View>
                <Text style={{fontSize: 20, marginLeft:'5%'}}>
                Medicine Name: {item.name}
              </Text>
              <Text style={{fontSize: 20, marginLeft:'5%'}}>
                Medicine Price:  {item.price}
              </Text>
              <Text style={{fontSize: 20, marginLeft:'5%'}}>
                Medicine Manufacture:  {item.manufacture}
              </Text>
              <Item regular style={{marginTop: 7}}>
                <Input placeholder='Quantity' onChangeText={(text) => this.setState({quantity: text})} placeholderTextColor="#687373" />
              </Item>
                </View>
              ))}
              </Grid>
                <Grid style={{marginTop: 20, marginBottom: 10}}>
                  <Col style={{paddingLeft: 10,paddingRight: 5}}>
                    <Button onPress={() => this.checkout()} style={{backgroundColor: Colors.navbarBackgroundColor}} block iconLeft>
                      <Icon name='ios-cart' />
                      <Text style={{color: '#fdfdfd'}}>Checkout</Text>
                    </Button>
                  </Col>
               </Grid>
            </Content>
            
        }
      </Container>
    );
  }


  removeItemPressed(item) {
    Alert.alert(
      'Remove '+item.title,
      'Are you sure you want this item from your cart ?',
      [
        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.removeItem(item)},
      ]
    )
  }

  removeItem(itemToRemove) {
    let items = [];
    this.state.cartItems.map((item) => {
      if(JSON.stringify(item) !== JSON.stringify(itemToRemove) )
        items.push(item);
    });
    this.setState({cartItems: items});
    AsyncStorage.setItem("CART",JSON.stringify(items));
  }

  removeAllPressed() {
    Alert.alert(
      'Empty cart',
      'Are you sure you want to empty your cart ?',
      [
        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.removeAll()}
      ]
    )
  }

  removeAll() {
    this.setState({cartItems: []})
    AsyncStorage.setItem("CART",JSON.stringify([]));
  }

  checkout() {    
    Actions.checkout({cartItems: this.state.medicineData, quantity: this.state.quantity});
  }

  itemClicked(item) {
    const { medicineData } = this.state;
    medicineData.push(item)
    this.setState({
      medicineData:medicineData,
      placeorder: false
    })
  }

}

const styles={
  title: {
    fontFamily: 'Roboto',
    fontWeight: '100'
  }
};

const items = [
  {id: 1, quantity:1, title: 'Black Hat', categoryId: 5, categoryTitle: 'MEN', price: '22$', image: 'http://res.cloudinary.com/atf19/image/upload/c_crop,h_250,w_358,x_150/v1500465309/pexels-photo-206470_nwtgor.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
  {id: 2, quantity:3, title: 'V Neck T-Shirt', categoryId: 2, categoryTitle: 'WOMEN', price: '12$', image: 'http://res.cloudinary.com/atf19/image/upload/c_crop,h_250,x_226,y_54/v1500465309/pexels-photo-521197_hg8kak.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
  {id: 10, quantity:1, title: 'Black Leather Hat', categoryId: 1, categoryTitle: 'KIDS', price: '2$', image: 'http://res.cloudinary.com/atf19/image/upload/c_crop,g_face,h_250,x_248/v1500465308/fashion-men-s-individuality-black-and-white-157675_wnctss.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
];
