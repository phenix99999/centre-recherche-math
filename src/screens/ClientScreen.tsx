/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import SyncStorage from 'sync-storage';

import { useFonts } from 'expo-font';
import { Container, Header, Button, Right, Left, Body, Icon, Text } from "native-base";

import {
  Modal,
  StyleSheet,
  ImageBackground,
  ScrollView,

  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";


class SolutionScreen extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ height: '100%' }}>


        <ImageBackground
          source={require("../assets/images/accueil.png")}
          style={styles.imgBackground}
          imageStyle={{ opacity: 1 }}
        >
          <Header
            style={Platform.OS != 'ios' ? { backgroundColor: 'transparent', height: 80, justifyContent: 'center', borderWidth: 0 } : { backgroundColor: 'transparent' }}

          >
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
              <Text style={{ fontWeight: 'bold', color: '#1f4598' }}>Clients</Text>
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

          <View style={{ padding: 20 }}>

            <View style={{ width: '100%', height: 60, backgroundColor: '#1f4598' }}>
              <View style={{ padding: 10 }}>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
                  V-hicule Média dessert une clientèle variée dans les secteurs public et privé.
</Text>
                <Text style={{ color: 'white', fontSize: 15 }}>

                </Text>
              </View>
            </View>


            <ScrollView contentContainerStyle={{ paddingBottom: 200, top: 25, borderWidth: 0, borderColor: '#DDE9F9' }} >
              <View style={{ flexDirection: 'row', padding: 30, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }} >
                {/* <Text> HEllo</Text> */}
                <Image source={require('../assets/images/clients/c1.png')} style={{ width: '80%', maxHeight: 300 }} resizeMode={'contain'} />

              </View>
              <View style={{ flexDirection: 'row', padding: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }} >
                {/* <Text> HEllo</Text> */}
                <Image source={require('../assets/images/clients/c2.png')} style={{ width: '80%', maxHeight: 300 }} resizeMode={'contain'} />
              </View>

              <View style={{ flexDirection: 'row', padding: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }} >
                {/* <Text> HEllo</Text> */}
                <Image source={require('../assets/images/clients/c3.jpg')} style={{ width: '80%', maxHeight: 300 }} resizeMode={'contain'} />
              </View>
              <View style={{ flexDirection: 'row', padding: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }} >
                {/* <Text> HEllo</Text> */}
                <Image source={require('../assets/images/clients/c4.png')} style={{ width: '80%', maxHeight: 300 }} resizeMode={'contain'} />
              </View>
              <View style={{ flexDirection: 'row', padding: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }} >
                {/* <Text> HEllo</Text> */}
                <Image source={require('../assets/images/clients/c5.png')} style={{ width: '80%', maxHeight: 300 }} resizeMode={'contain'} />
              </View>

              <View style={{ flexDirection: 'row', padding: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }} >
                {/* <Text> HEllo</Text> */}
                <Image source={require('../assets/images/clients/c6.png')} resizeMode={'contain'} style={{ width: '80%', maxHeight: 300 }} />
              </View>

              <View style={{ flexDirection: 'row', padding: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }} >
                {/* <Text> HEllo</Text> */}
                <Image source={require('../assets/images/clients/c7.png')} resizeMode={'contain'} style={{ width: '80%', maxHeight: 300 }} />
              </View>

            </ScrollView>
          </View>


        </ImageBackground>

      </View>
    );
  }


}
export default inject("authStore")(observer(SolutionScreen));
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
