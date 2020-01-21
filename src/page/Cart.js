/**
* This is the Main file
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Alert, AsyncStorage,TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container, Content, View, Header, Icon, Button, Left, Right, Body, Title, List, ListItem, Thumbnail, Grid, Col } from 'native-base';
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
        medicineData:[]
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
        <Button transparent onPress={() => Actions.pop()}>
          <Icon name="ios-close" size={38} style={{fontSize: 38}} />
        </Button>
      </Left>
    );
    return(
      <Container style={{backgroundColor: '#fdfdfd'}}>
          {this.state.showLoader ? <ActivityIndicator /> : null}
          <Navbar left={left} title="Medicine List" />
          {this.state.showfile ?
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.textStyle}>
            File Name:{' '}
            {this.state.singleFile.name ? this.state.singleFile.name : ''}
            
           </Text>
           <Button success onPress={this.addData}>
            <Text style={{color:'white'}}>Add to cart</Text>
            </Button>
            </View>
            :
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
              <Grid style={{marginTop: 20, marginBottom: 10}}>
                <Col style={{paddingLeft: 10,paddingRight: 5}}>
                <TouchableOpacity
                activeOpacity={0.5}
                style={styles.buttonStyle}
                onPress={() =>this.selectOneFile()}>
                {/*Single file selection button*/}
                <Text style={{ marginRight: 10, fontSize: 19 }}>
                  Click here to pick one file
                </Text>
                
              </TouchableOpacity>
                </Col>
              </Grid>
              
              <Grid style={{marginTop: 20, marginBottom: 10}}>
                <Col style={{paddingLeft: 10,paddingRight: 5}}>
                <Text style={{ marginRight: 10, fontSize: 19 }}>
                  OR
                </Text>
                
                </Col>
              </Grid>

              <Grid style={{marginTop: 20, marginBottom: 10}}>
                <Col style={{paddingLeft: 10,paddingRight: 5}}>
                  <Button onPress={() => this.checkout()} style={{backgroundColor: Colors.navbarBackgroundColor}} block iconLeft>
                    <Icon name='ios-card' />
                    <Text style={{color: '#fdfdfd'}}>Checkout</Text>
                  </Button>
                </Col>
                
              </Grid>
            </Content>
          }
      </Container>
    );
  }

  addData = async () =>{
    console.log("data added", this.state.singleFile)
    let uri = this.state.singleFile.uri
    var result = await this.uriToBlob(uri)
    console.log("resulted value", result)
    var storageRef = Firebase.storage().ref();
    storageRef.child(`users/${this.state.singleFile.name}`).put(result)
    .then(snapshot =>{
      // console.log("snapShot",snapshot)
      this.dataResponse(snapshot)
    })
  }

  dataResponse(data){
    var storageRef = Firebase.storage().ref();
    storageRef.child(`users/${this.state.singleFile.name}`).getDownloadURL().then(url =>{
      console.log("url data", url)
      this.addFile(url)
    })
    // .then(
    //   resp => {
    //     this.addFile()
    //   }
    // )
    // storageRef().ref('users').child(this.state.singleFile.name).getDownloadURL().then(url =>{
    //   console.log("url", url)
    // })
  }

  addFile = (url) =>{
    const db = Firebase.firestore()
    let userRef = db.collection("orderPres").add({
      orderStatus: "Pending",
      userName:this.state.userdata,
      medicineName:url,
      userID: this.state.userdata
     })
     .then(res => {
       this.addId(res)
     })
  }

  uriToBlob = (uri) => {
    console.log("uri to blob")
    return new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest();

      xhr.onload = function() {
        // return the blob
        resolve(xhr.response);
      };
      
      xhr.onerror = function() {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };

      // this helps us get a blob
      xhr.responseType = 'blob';

      xhr.open('GET', uri, true);
      xhr.send(null);

    });

  }

  addId = (resp) => {
    let id = resp.id
     
    var db = Firebase.firestore();
    db.collection("orderPres").where("userID", '==', this.state.userdata)
    .get()
    .then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        db.collection("orderPres")
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

  selectOneFile = async() => {
    console.log("here")
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      if(res){
        FileViewer.open(res.uri).then(()=>{

        })
      }
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      //Setting the state to show single file attributes
      this.setState({ singleFile: res, showfile:true });
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
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
    Actions.checkout({cartItems: this.state.medicineData});
  }

  itemClicked(item) {
    const { medicineData } = this.state;
    medicineData.push(item)
    this.setState({
      medicineData:medicineData
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
