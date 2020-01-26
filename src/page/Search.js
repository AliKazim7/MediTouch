/**
* This is the Search file
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Container, Content, View, Header, Body, Icon, Item, Input, Thumbnail, Button, Right, Grid, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';

import SearchableDropdown from 'react-native-searchable-dropdown';
// Our custom files and classes import
import Colors from '../Colors';
import Text from '../component/Text';
import Product from '../component/Product';

export default class Search extends Component {
  constructor(props) {
      super(props);
      this.state = {
        searchText: '',
        items: [
          {
            id: 1,
            name: 'JavaScript',
          },
          {
            id: 2,
            name: 'Java',
          },
          {
            id: 3,
            name: 'Ruby',
          },
          {
            id: 4,
            name: 'React Native',
          },
          {
            id: 5,
            name: 'PHP',
          },
          {
            id: 6,
            name: 'Python',
          },
          {
            id: 7,
            name: 'Go',
          },
          {
            id: 8,
            name: 'Swift',
          },
        ]
      };
  }

  componentWillMount() {
    if(this.props.searchText) {
      this.setState({searchText: this.props.searchText});
      this.search(this.props.searchText);
    }
  }

  render() {
    const { search, items } = this.state
    return(
      <Container style={{backgroundColor: '#fdfdfd'}}>
        <Header
          searchBar
          rounded
          style={{backgroundColor: Colors.navbarBackgroundColor}}
          backgroundColor={Colors.navbarBackgroundColor}
          androidStatusBarColor={Colors.statusBarColor}
          noShadow={true}
        >
        <SearchableDropdown
        multi={true}
        selectedItems={this.state.selectedItems}
        onItemSelect={(item) => {
          const items = this.state.selectedItems;
          items.push(item)
          this.setState({ selectedItems: items });
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
        items={items}
        defaultIndex={2}
        chip={true}
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
            onTextChange: text => alert(text)
          }
        }
        listProps={
          {
            nestedScrollEnabled: true,
          }
        }
      />
          </Header>
          {this.state.items.length <=0 ?
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="ios-search" size={38} style={{fontSize: 38, color: '#95a5a6', marginBottom: 7}} />
              <Text style={{color: '#95a5a6'}}>Search a product...</Text>
            </View>
            :
            <Content padder>
                  {this.renderResult()}
            </Content>
          }
      </Container>
    );
  }

  renderResult() {
    let items = [];
    let stateItems = this.state.items
    for(var i=0; i<stateItems.length; i+=2 ) {
      if(stateItems[i+1]) {
        items.push(
          <Grid key={i}>
            <Product key={stateItems[i].id} product={stateItems[i]} />
            <Product key={stateItems[i+1].id} product={stateItems[i+1]} isRight />
          </Grid>
        );
      }
      else {
        items.push(
          <Grid key={i}>
            <Product key={stateItems[i].id} product={stateItems[i]} />
            <Col key={i+1} />
          </Grid>
        );
      }
    }
    return items;
  }

  search(text) {
    var searchResult = [
      {id: 1, title: 'Black Hat', categoryId: 5, categoryTitle: 'MEN', price: '22$', image: 'http://res.cloudinary.com/atf19/image/upload/c_crop,h_250,w_358,x_150/v1500465309/pexels-photo-206470_nwtgor.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
      {id: 2, title: 'V Neck T-Shirt', categoryId: 2, categoryTitle: 'WOMEN', price: '12$', image: 'http://res.cloudinary.com/atf19/image/upload/c_crop,h_250,x_226,y_54/v1500465309/pexels-photo-521197_hg8kak.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
      {id: 10, title: 'Black Leather Hat', categoryId: 1, categoryTitle: 'KIDS', price: '2$', image: 'http://res.cloudinary.com/atf19/image/upload/c_crop,g_face,h_250,x_248/v1500465308/fashion-men-s-individuality-black-and-white-157675_wnctss.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
      {id: 15, title: 'Long Sleeves T-Shirt', categoryId: 5, categoryTitle: 'MEN', price: '120$', image: 'http://res.cloudinary.com/atf19/image/upload/c_crop,h_250,x_100,y_50/v1500465308/pexels-photo-500034_uvxwcq.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
      {id: 11, title: 'Pink Diamond Watch', categoryId: 5, categoryTitle: 'MEN', price: '22$', image: 'http://res.cloudinary.com/atf19/image/upload/c_crop,h_250/v1500465308/pexels-photo-179909_ddlsmt.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
      {id: 22, title: 'Golden Tie', categoryId: 2, categoryTitle: 'WOMEN', price: '12$', image: 'http://res.cloudinary.com/atf19/image/upload/c_scale,w_300/v1500284127/pexels-photo-497848_yenhuf.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
      {id: 100, title: 'Black Pearl Earrings', categoryId: 1, categoryTitle: 'KIDS', price: '2$', image: 'http://res.cloudinary.com/atf19/image/upload/c_crop,g_center,h_250/v1500465307/pexels-photo-262226_kbjbl3.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
      {id: 215, title: 'Grey Blazer', categoryId: 5, categoryTitle: 'MEN', price: '120$', image: 'http://res.cloudinary.com/atf19/image/upload/c_scale,w_300/v1500284127/pexels-photo-497848_yenhuf.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
      {id: 12, title: 'Mirror Sunglasses', categoryId: 5, categoryTitle: 'MEN', price: '22$', image: 'http://res.cloudinary.com/atf19/image/upload/c_crop,g_face,h_250/v1500465307/pexels-photo-488541_s0si3h.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
      {id: 29, title: 'White Shirt', categoryId: 2, categoryTitle: 'WOMEN', price: '12$', image: 'http://res.cloudinary.com/atf19/image/upload/c_scale,w_300/v1500284127/pexels-photo-497848_yenhuf.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
      {id: 16, title: 'Tie', categoryId: 1, categoryTitle: 'KIDS', price: '2$', image: 'http://res.cloudinary.com/atf19/image/upload/c_scale,w_300/v1500284127/pexels-photo-497848_yenhuf.jpg', description: "Hello there, i'm a cool product with a heart of gold."},
    ];
    this.setState({items: searchResult});
  }

}
