import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { Root } from 'native-base';
import { Scene, Router, Actions } from 'react-native-router-flux';


// Our custom files and classes import
import Home from './page/Home';
import initialPage from './page/initialPage'
// import Search from './page/Search';
import Cart from './page/Cart';
import WishList from './page/WishList';
import Newsletter from './page/Newsletter';
import Contact from './page/Contact';
import Category from './page/Category';
import Product from './page/Product';
import Search from './page/Search'
// import ImageGallery from './page/ImageGallery';
import Login from './page/Login';
import Signup from './page/Signup';
import CurrentOrder from './page/CurrentOrder'
import Checkout from './page/Checkout';
import DocumentPicker from './page/DocumentPicker'

export default class Main extends Component {
  componentWillMount = () => {
    BackHandler.addEventListener('hardwareBackPress', () => Actions.pop());
    console.disableYellowBox = true;
  };

  render() {
    return(
      <Root>
        <Router>
          <Scene key="root">
            <Scene initial key="home" component={Home} hideNavBar />
            <Scene key="login" component={Login} hideNavBar />
            <Scene key="signup" component={Signup} hideNavBar />
            <Scene key="cart" component={Cart} hideNavBar />
            <Scene key="search" component={Search} hideNavBar />
            <Scene key="initialPage" component={initialPage} hideNavBar />
            <Scene key="approvedOrder" component={CurrentOrder} hideNavBar />
            <Scene key="checkout" component={Checkout} hideNavBar />
            <Scene key="document" component={DocumentPicker} hideNavBar />
            <Scene key="product" component={Product} hideNavBar />
          </Scene>
        </Router>
      </Root>
    );
  }

}


// <Scene initial key="home" component={Home} hideNavBar />
// <Scene key="search" component={Search} modal hideNavBar />
// <Scene key="cart" component={Cart} modal hideNavBar />
// <Scene key="wishlist" component={WishList} modal hideNavBar />
// <Scene key="contact" component={Contact} modal hideNavBar />
// <Scene key="newsletter" component={Newsletter} modal hideNavBar />
// <Scene key="category" component={Category} hideNavBar />
// <Scene key="product" component={Product} hideNavBar />
// <Scene key="login" component={Login} hideNavBar />
// <Scene key="signup" component={Signup} hideNavBar />
// <Scene key="checkout" component={Checkout} hideNavBar />