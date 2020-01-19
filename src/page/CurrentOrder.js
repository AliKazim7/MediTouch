/**
* This is the Main file
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { Container, Content, View, Header, Icon, Button, Left, Right, Body, Title, List, ListItem, Thumbnail, Grid, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';

// Our custom files and classes import
import Colors from '../Colors';
import Text from '../component/Text';
import Navbar from '../component/Navbar';
import Firebase from '../Firebase/firebase';

export default class CurrentOrder extends Component {
  constructor(props) {
      super(props);
      this.state = {
        cartItems: []
      };
  }


  componentDidMount () {
    this.apicall()
  }

  apicall = async() =>{
    const userdata = await AsyncStorage.getItem("userToken");
    console.log("userData", userdata)
    this.setState({
      userdata: userdata
    })
     const users = Firebase.firestore();
     users.collection('orderDetail').where('userID','==',userdata).get().then(snapshot =>{
     if(snapshot.empty){
       console.log("no email registered")
     } else {
       const data = snapshot.docs.map(doc => doc.data())
       console.log("data",data)
       this.setState({
         cartItems:data
       })
     }
   })
  }

  componentWillMount() {
    AsyncStorage.getItem("CART", (err, res) => {
      if (!res) this.setState({cartItems: []});
      else this.setState({cartItems: JSON.parse(res)});
    });
  }

  render() {
    console.log("this.state.cartiem", this.state.cartItems)
    var left = (
      <Left style={{flex:1}}>
        <Button transparent onPress={() => Actions.pop()}>
          <Icon name="ios-close" size={38} style={{fontSize: 38}} />
        </Button>
      </Left>
    );
    return(
      <Container style={{backgroundColor: '#fdfdfd'}}>
          <Navbar left={left} title="MY CART" />
            <Content style={{paddingRight: 10}}>
              <List>
                  {this.state.cartItems.map((item,index)=>(
                        <ListItem
                          key={index}
                          last={this.state.cartItems.length === index+1}
                        //   onPress={() => this.itemClicked(item)}
                        >
                          <Body style={{paddingLeft: 10}}>
                            <Text style={{fontSize: 18}}>
                              {item.medicineName} ,
                            </Text>
                            <Text style={{marginTop:10}}>
                                Price:{item.orderPrice}
                            </Text>
                            <Text style={{marginTop:10}}>
                                To be deliver(Time):{item.timeTaken}
                            </Text>
                            <Text style={{marginTop:10}}>
                                OrderStatus:{item.orderStatus}
                            </Text>
                          </Body>
                          <Right>
                          <Button style={{marginLeft: -25}} transparent onPress={() => this.removeItemPressed(item)}>
                              <Icon size={30} style={{fontSize: 30, color: '#95a5a6'}} name='ios-add-circle-outline' />
                            </Button>
                            <Button style={{marginLeft: -25}} transparent onPress={() => this.removeItemPressed(item)}>
                              <Icon size={30} style={{fontSize: 30, color: '#95a5a6'}} name='ios-remove-circle-outline' />
                            </Button>
                          </Right>
                        </ListItem>
                    
                  ))}
              </List>
            </Content>
      </Container>
    );
  }

  renderItems() {
    let items = [];
    
    return items;
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
  }

//   checkout() {
//     Actions.checkout({cartItems: this.state.cartItems});
//   }

  itemClicked(item) {
    // Actions.product({product: item});
  }

}

