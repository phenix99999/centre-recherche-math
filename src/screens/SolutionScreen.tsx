/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import SyncStorage from 'sync-storage';
import { Container, Header, Button, Right, Left, Body, Icon } from "native-base";

import { useFonts } from 'expo-font';

import {
  Modal,
  StyleSheet,
  ImageBackground,
  Text,

  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";


class AccueilScreen extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (


      <ImageBackground
        source={require("../assets/images/accueil.png")}
        style={styles.imgBackground}
        imageStyle={{ opacity: 1 }}
      >

        <Header style={{ backgroundColor: 'transparent' }}>
          <Left>
            <Button
              transparent
              onPress={async () => {
                this.props.navigation.goBack();

              }}
            >

              <Icon name="back" type="AntDesign" style={{ fontSize: 30, marginLeft: 2, color: '#1f4598' }} />
            </Button>
          </Left>

          <Body>
            <Text style={{ fontFamily: 'Arial', fontWeight: 'bold', color: '#1f4598' }}> Solutions </Text>
          </Body>

          <Right>

            <Button
              transparent
              onPress={async () => {
                this.props.navigation.openDrawer();

              }}
            >
              <Icon name="menu" type={"MaterialIcons"} style={{ fontSize: 30, marginLeft: 2, color: 'white' }} />
            </Button>
          </Right>
        </Header>

        <View style={{ width: '100%' }}>

          <Button style={{ width: '100%', height: 125,backgroundColor: '#1f4598' }} onPress={() => this.props.navigation.navigate('SolutionMobile')}>
            <View style={{ width: '50%' }}>
              <Text style={{color:'white',fontWeight:'bold',fontSize:17,marginLeft:10}}>
                DÉVELOPPEMENT
          MOBILE NATIF IOS ET ANDROID</Text>
            </View>
            <View style={{ width: '50%',backgroundColor:'white' }}>
              <Image source={require("../assets/images/developpementnatif.png")} style={{ width: 200, maxHeight: 125 }} resizeMode={'contain'} />
            </View>
          </Button>

        </View>
        <View style={{ width: '100%',marginTop:25 }}>

<Button style={{ width: '100%', height: 100,backgroundColor: '#1f4598' }} onPress={() => this.props.navigation.navigate('SolutionPortail')}>
  <View style={{ width: '50%' }}>
    <Text style={{color:'white',fontWeight:'bold',fontSize:17,marginLeft:10}}>
    DÉVELOPPEMENT
DE PORTAIL WEB
POUR FILEMAKER</Text>
  </View>
  <View style={{ width: '50%',backgroundColor:'white' }}>
    <Image source={require("../assets/images/portailfilemaker.png")} style={{ width: 200, maxHeight: 100 }} resizeMode={'contain'} />
  </View>
</Button>

</View>
 
        <View style={{ width: '100%',marginTop:25 }}>

<Button style={{ width: '100%', height: 125,backgroundColor: 'white',marginTop:5 }} onPress={() => this.props.navigation.navigate('SolutionSante')}>
  <View style={{ width: '32%' }}>
    <Text style={{color:'black',fontWeight:'bold',fontSize:14,marginLeft:10}}>
INFORMATIQUE EN SANTÉ</Text>
  </View>
  <View style={{ width: '68%' }}>
    <Image source={require("../assets/images/clientssantes.png")} style={{ width: 294, maxHeight: 100 }}  />
  </View>
</Button>

</View>

<View style={{ width: '100%',marginTop:25 }}>

<Button style={{ width: '100%', height: 100,backgroundColor: 'white' }} onPress={() => this.props.navigation.navigate('SolutionB2b')}>

  <View style={{ width: '100%' }}>
    <Image source={require("../assets/images/b2b.png")} style={{ width: '100%', maxHeight: 100 }} resizeMode={'contain'} />
  </View>
</Button>

</View>
<View style={{ width: '100%',marginTop:25 }}>

<Button style={{ width: '100%', height: 100,backgroundColor: '#1f4598' }} onPress={() => this.props.navigation.navigate('SolutionVhmClasses')} >
 
  <View style={{ width: '100%',backgroundColor:'white' }}>
    <Image source={require("../assets/images/vhmclasses.png")} style={{ width: '100%', maxHeight: 100 }} resizeMode={'contain'} />
  </View>
</Button>

</View>


 


      </ImageBackground>


    );
  }


}
export default inject("authStore")(observer(AccueilScreen));
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  modalContent: {
    height: 100,
  },

  inputLogin: {
    textAlign: 'center',

  },



  buttonTitle: {
    flexDirection: "row",
    flex: 1,
    alignItems: 'center',
    borderTopWidth: 1,
    maxHeight: 35,
    borderTopColor: "transparent",
  },
  accueil: {
    marginTop: 10,
    backgroundColor: '#1C1E53',
    width: '75%',
    height: 50,

    justifyContent: 'center',
    borderColor: 'black',
    borderRadius: 15,
  },

  support: {
    marginTop: 10,
    backgroundColor: 'white',
    width: '75%',
    height: 50,

    justifyContent: 'center',
    borderColor: 'black',
    borderRadius: 15,
  },

  solutions: {
    marginTop: 10,
    backgroundColor: 'white',
    width: '75%',
    height: 50,
    justifyContent: 'center',
    borderColor: 'black',
    borderRadius: 15,
  },

  image: {
    flex: 1,
    alignItems: 'center',
  },

  buttonLogin: {
    top: 250,
    backgroundColor: '#1C1E53',
    marginTop: 10,
    width: '75%',
    height: 50,
    justifyContent: 'center',
    borderColor: 'black',
    borderRadius: 15,
  },

  imgBackground: {
    flex: 1,
    flexDirection: "column",
  },

});
