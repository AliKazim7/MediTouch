/**
* This is the category component used in the home page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Image, Dimensions, TouchableOpacity,AsyncStorage, Alert } from 'react-native';
import { View, Content, CardItem ,Icon, Card, Body, Container } from 'native-base';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Text from './Text';
import { SearchBar } from 'react-native-elements';

export default class CategoryBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      search: '',
      afterSelect: false,
      items: []
    };
}
  componentDidMount() {
    console.log("props are category block", this.props)
    console.disableYellowBox = true;
    this.apicall()
   }

  apicall = async() =>{
    console.log("here data")
    const userdata = await AsyncStorage.getItem("userToken");
    console.log("userData", userdata)
    if(userdata === null){
      Actions.login()
    } else if(userdata){
      this.setState({
        userdata: userdata
      })
    }
  }

  componentWillReceiveProps(nextProps){
    console.disableYellowBox = true;
    console.log("nexxtProps",nextProps.result)
    
    this.apicall()
    if(nextProps){
      this.setState({
        result: nextProps.result
      })
    }
  }

  updateSearch = search => {
    this.setState({ search });
  };


  render() {
    const {search, result} = this.state
    console.log("result", result)
    return(
      <Container style={{flex:1,backgroundColor:'rgba(0,0,0,0.3)'}}>
      
          <Text style={{fontSize:30, color:'white', marginTop:'5%', marginLeft:'10%', marginBottom:'10%'}}>Buy Medicines Online</Text>
          <Text style={{fontSize:20, color:'white',marginLeft:'30%',marginBottom:'5%' }}>Search Medicine</Text>
          <Text style={{fontSize:20, color:'white', marginLeft:'30%', marginTop:'5%', marginBottom:'5%'}}>Upload Prescription</Text>

          <SearchableDropdown
          onItemSelect={(item) => {
            this.setState({ selectedItems: item, afterSelect: true });
          }}
            containerStyle={{ padding: 5 }}
            onRemoveItem={(item, index) => {
              const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
              this.setState({ selectedItems: items });
            }}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: '#ddd',
              borderColor: '#bbb',
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{ color: '#222' }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={result}
            defaultIndex={2}
            resetValue={false}
            textInputProps={
              {
                placeholder: "placeholder",
                underlineColorAndroid: "transparent",
                style: {
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                },
                onTextChange: text => {
                  this.setState({
                    selectedItems: text
                  })
                }
              }
            }
            listProps={
              {
                nestedScrollEnabled: true,
              }
            }
        />    
          
        <Body>
          <Icon onPress={ () => Actions.document()} style={{fontSize: 100 }} name="camera" />
          <Text style={{fontSize:20}} >Take Picture</Text>
        </Body>
        <Body>
          <Icon onPress={ () => Actions.document({userdata: this.state.userdata})} style={{fontSize: 100 }} name="folder" />
          <Text style={{fontSize:20}} >Choose File</Text>
        </Body>
      </Container>
    );
  }

  onPress = (item) => {
    console.log("items", item)
    this.props.sendData(item)
    // Actions.category({id: this.props.id, title: this.props.title});
  }
}

const styles = {
  text: {
    width: Dimensions.get('window').width,
    height: 200,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    color: '#fdfdfd',
    fontSize: 32
  },
  subtitle: {
    textAlign: 'center',
    color: '#fdfdfd',
    fontSize: 16,
    fontWeight: '100',
    fontStyle: 'italic'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 42, 54, 0.4)'
  },
  border: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(253, 253, 253, 0.2)'
  },
  image: {
    height: 200,
    width: null,
    flex: 1
  }
};
