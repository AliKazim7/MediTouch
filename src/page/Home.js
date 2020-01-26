/**
* This is the Home page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Image, AsyncStorage } from 'react-native';
import { Container, Content, View, Button, Left, Right, Icon, Card, CardItem, cardBody } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Firebase from '../Firebase/firebase'
// Our custom files and classes import
import Text from '../component/Text';
import Navbar from '../component/Navbar';
import SideMenu from '../component/SideMenu';
import SideMenuDrawer from '../component/SideMenuDrawer';
import CategoryBlock from '../component/CategoryBlock';


export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      result:[],
      isApproved: false,
      userdata:'',
      arrayofMedicin:[]
    };
}

  componentDidMount() {
    this.apiCal()
    this.apiCals()
    this.apicall()
    console.disableYellowBox = true;
  }

  apicall = async() =>{
    const userdata = await AsyncStorage.getItem("userToken");
    this.setState({
      userdata: userdata
    })
     const users = Firebase.firestore();
     users.collection('orderPres').where('userID','==',userdata).get().then(snapshot =>{
     if(snapshot.empty){
       console.log("no email registered")
     } else {
       const data = snapshot.docs.map(doc => doc.data())
       data.forEach(approve=> {
         if(approve.orderStatus === 'Approved'){
           this.setState({
             isApproved: true,
             orderPres: data
           })
         }
       })
       
     }
   })
  }

  apiCals = async () =>{
    const userdata = await AsyncStorage.getItem("userToken");
    this.setState({
      userdata: userdata
    })
     const users = Firebase.firestore();
     users.collection('orderDetail').where('userID','==',userdata).get().then(snapshot =>{
     if(snapshot.empty){
       console.log("no email registered")
     } else {
       const data = snapshot.docs.map(doc => doc.data())
       data.forEach(approve=> {
         if(approve.orderStatus === 'Approved'){
           this.setState({
             isApproved: true,
             orderDetail: data
           })
         }
       })
       
     }
   })
   
}

  apiCal(){
    var arr = [];
    var array = [];
    const users = Firebase.firestore();
    const user = users.collection('MedicineList').get().then(querySnapshot =>{
        const data = querySnapshot.docs.map(doc => doc.data());
        for(var i = 0; i < data.length; i++){
            array.push({
                id:data[i].medicineID,
                name:data[i].name
            })
        }
        this.setState({
            result: array
        })
    })
  }

  render() {
    const { result } = this.state;
    console.log("result data",result)
    var left = (
      <Left style={{flex:1}}>
        <Button onPress={() => this._sideMenuDrawer.open()} transparent>
          <Icon name='ios-menu' />
        </Button>
      </Left>
    );
    var right = (
      <Right style={{flex:1}}>
        <Button onPress={() => Actions.search()} transparent>
          <Icon name='ios-search' />
        </Button>
        {
          this.state.isApproved
          ?
          <Button onPress={() => Actions.approvedOrder()} transparent>
          <Icon name='ios-cart' />
          </Button>
          :
          <Button onPress={() => Actions.cart()} transparent>
          <Icon style={{color:'red'}} name='ios-cart' />
          </Button>
        }
      </Right>
    );
    return(
      <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
          <Container>
            <Navbar left={left} title="MediTouch" />
            <Content>
              <CategoryBlock result={result} sendData={this.setValue} />
            </Content>
          </Container>
      </SideMenuDrawer>
    );
  }

  sendData = async() =>{
    console.log("array of Medicine", this.state.arrayofMedicin, this.state.userdata)
    // var database = Firebase.firestore()
    var db = Firebase.firestore();
    let userRef = db.collection("orderDetail").add({
      orderStatus: "Pending",
      medicineName:this.state.arrayofMedicin,
      userID: this.state.userdata
    })
    .then(resp => {
      this.addId(resp)
    })
  }

  addId = (resp) => {
    let id = resp.id
    var db = Firebase.firestore();
    db.collection("orderDetail").where("userID", '==', this.state.userdata)
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
  }

  

  setValue = value =>{
    console.log("value of medicine data ", value)
    this.setState({
      arrayofMedicin: value.name
    })
  }
  renderCategories(result) {
    let cat = [];
    // const result = this.state;
    <CategoryBlock result={result} />
  }

}

var categories = [
  {
    id: 1,
    title: 'MEN',
    image: 'http://res.cloudinary.com/atf19/image/upload/c_scale,w_489/v1500284127/pexels-photo-497848_yenhuf.jpg'
  },
  {
    id: 2,
    title: 'WOMEN',
    image: 'http://res.cloudinary.com/atf19/image/upload/c_scale,w_460/v1500284237/pexels-photo-324030_wakzz4.jpg'
  },
  {
    id: 3,
    title: 'KIDS',
    image: 'http://res.cloudinary.com/atf19/image/upload/c_scale,w_445/v1500284286/child-childrens-baby-children-s_shcevh.jpg'
  },
  {
    id: 4,
    title: 'ACCESORIES',
    image: 'http://res.cloudinary.com/atf19/image/upload/c_scale,w_467/v1500284346/pexels-photo-293229_qxnjtd.jpg'
  }
];
