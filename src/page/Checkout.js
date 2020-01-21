/**
* This is the Checkout Page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { TouchableHighlight, AsyncStorage } from 'react-native';
import { Container, Content, View, Grid, Col, Left, Right, Button, Icon, List, ListItem, Body, Radio, Input, Item } from 'native-base';
import FAIcon  from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';

// Our custom files and classes import
import Colors from '../Colors';
import Text from '../component/Text';
import Navbar from '../component/Navbar';
import Firebase from '../Firebase/firebase';

export default class Checkout extends Component {
  constructor(props) {
      super(props);
      this.state = {
        cartItems: [],
        total: 0,
        card: true,
        paypal: false,
        name: '',
        email: '',
        phone: '',
        country: '',
        address: '',
        city: '',
        postcode: '',
        note: '',
        arrayofMedicin:[]
      };
  }

  componentWillMount() {
    this.setState({cartItems: this.props.cartItems});
    var total = 0;
    const { arrayofMedicin } = this.state;
    this.props.cartItems.map((item) => {
      arrayofMedicin.push(item.name)
    });
    this.setState({total: total, arrayofMedicin: arrayofMedicin});
  }

  render() {
    var left = (
      <Left style={{flex:1}}>
        <Button  transparent>
          <Icon name='ios-arrow-back' />
        </Button>
      </Left>
    );
    var right = (
      <Right style={{flex:1}}>
        <Button onPress={() => Actions.search()} transparent>
          <Icon name='ios-search-outline' />
        </Button>
      </Right>
    );
    return(
      <Container style={{backgroundColor: '#fdfdfd'}}>
        <Navbar left={left} right={right} title="CHECKOUT" />
        <Content padder>
          <TouchableHighlight onPress={() => Actions.login()}>
            <View style={{flex: 1, alignItems: 'center', backgroundColor: '#6fafc4', paddingTop: 20, paddingBottom: 20}}>
                <Icon name="ios-warning" style={{color: 'rgba(253, 253, 253, 0.9)', marginRight: 20, position: 'absolute', left: 11, top: 15, borderRightWidth: 1, borderColor: 'rgba(253, 253, 253, 0.2)', paddingRight: 10}}/>
                <Text style={{color: '#fdfdfd'}}>Returning customer ? click here to login</Text>
            </View>
          </TouchableHighlight>
          <View>
            <Text style={{marginTop: 15, fontSize: 18}}>Shipping information</Text>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='Name' onChangeText={(text) => this.setState({name: text})} placeholderTextColor="#687373" />
            </Item>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='Email' onChangeText={(text) => this.setState({email: text})} placeholderTextColor="#687373" />
            </Item>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='Phone' onChangeText={(text) => this.setState({phone: text})} placeholderTextColor="#687373" />
            </Item>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='Country' onChangeText={(text) => this.setState({country: text})} placeholderTextColor="#687373" />
            </Item>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='Address' onChangeText={(text) => this.setState({address: text})} placeholderTextColor="#687373" />
            </Item>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='City' onChangeText={(text) => this.setState({city: text})} placeholderTextColor="#687373" />
            </Item>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='Postcode' onChangeText={(text) => this.setState({postcode: text})} placeholderTextColor="#687373" />
            </Item>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='Note' onChangeText={(text) => this.setState({note: text})} placeholderTextColor="#687373" />
            </Item>
          </View>
          <Text style={{marginTop: 15, fontSize: 18}}>Your order</Text>
          <View style={styles.invoice}>
            <List>
                {this.state.cartItems.map((item, i) => (
                    <ListItem
                      key={i}
                      style={{marginLeft: 0}}
                    >
                      <Body style={{paddingLeft: 10}}>
                        <Text style={{fontSize: 18}}>
                          {item.quantity > 1 ? item.quantity+"1 " : null}
                          {item.name}
                        </Text>
                      </Body>
                      <Right>
                        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>{item.price}</Text>
                      </Right>
                    </ListItem>
                  
                ))}
            </List>
            <View style={styles.line} />
            <Grid style={{paddingLeft: 10, paddingRight: 10, marginTop: 7}}>
              <Col>
                <Text style={{fontSize: 18, fontStyle: 'italic'}}>Total</Text>
              </Col>
              <Col>
                <Text style={{textAlign: 'right', fontSize: 18, fontWeight: 'bold'}}>{this.state.total+"$"}</Text>
              </Col>
            </Grid>
          </View>
          <View style={{marginTop: 10, marginBottom: 10, paddingBottom: 7}}>
            <Button onPress={() => this.checkout()} style={{backgroundColor: Colors.navbarBackgroundColor}} block iconLeft>
              <Icon name='ios-card' />
              <Text style={{color: '#fdfdfd'}}>Proceed to payement</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }

  checkout() {
    console.log(this.state);
    console.log('medicine names', this.state.arrayofMedicin)
    let medName = this.state.arrayofMedicin.join(',')
    const db = Firebase.firestore()
    let userRef = db.collection("orderDetail").add({
      orderStatus: "Pending",
      userName:this.state.name,
      userEmail:this.state.email,
      medicineName:medName,
      userID: this.state.email
    })
    .then(resp => {
      this.addId(resp)
    })
  }

  addId = (resp) => {
    let id = resp.id
    var db = Firebase.firestore();
    db.collection("orderDetail").where("userID", '==', this.state.email)
    .get()
    .then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        db.collection("orderDetail")
        .doc(doc.id)
        .update({
          orderID:id
        })
      })
    }).then(response => this.getData(response))
  }

  getData(response){
    console.log("response", response)
    Actions.home()
  }


}

const styles = {
  invoice: {
    paddingLeft: 20,
    paddingRight: 20
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#bdc3c7'
  }
};
