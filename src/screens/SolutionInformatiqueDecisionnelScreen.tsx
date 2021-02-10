/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import Unorderedlist from 'react-native-unordered-list';

import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import SyncStorage from 'sync-storage';

import { useFonts } from 'expo-font';
import { Container, Header, Button, Right, Left, Body, Icon, Text } from "native-base";

import {
  Modal,
  StyleSheet,
  ImageBackground,


  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";


class SolutionMobileScreen extends Component {

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
            style={Platform.OS != 'ios' ? { backgroundColor: 'transparent', height: 80, justifyContent: 'center', top: 15 } : { backgroundColor: 'transparent' }}
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
              <Text style={{ fontFamily: 'Arial', fontWeight: 'bold', color: '#1f4598' }}>Solutions</Text>
            </Body>

            <Right>
              <Button
                transparent
                onPress={async () => {
                  this.props.navigation.openDrawer();

                }}
              >
                <Icon name="menu" type={"MaterialIcons"} style={{ fontSize: 30, marginLeft: 2, color: '#1f4598' }} />
              </Button>
            </Right>
          </Header>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', marginLeft: 2, marginRight: 2, marginBottom: 4 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                DÉVELOPPEMENT
                MOBILE NATIF
                IOS ET ANDROID
              </Text>
            </View>
            <View style={{ maxHeight: 100, padding: 8 }}>
              <Text>Nous développons des solutions mobiles natives reliées à votre FileMaker...
              sans nécessiter de licence concurente
              </Text>

            </View>
            <View style={{ alignItems: 'center', maxHeight: 150 }}>
              <Image source={require("../assets/images/developpementnatif.png")} style={{ width: 400, maxHeight: 150 }} resizeMode={'contain'} />

            </View>
            <View style={{ padding: 8 }}>

              <Unorderedlist><Text style={{ fontWeight: 'bold' }}>IOS et Android</Text></Unorderedlist>
              <Unorderedlist><Text style={{ fontWeight: 'bold' }}>Aucune licence concurrente</Text></Unorderedlist>
              <Unorderedlist><Text style={{ fontWeight: 'bold' }}>Supporte 200 usagers simultanés</Text></Unorderedlist>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Button style={{ backgroundColor: '#1f4598' }}>
                <Text>
                  Plus d'infos
                  </Text>

              </Button>
            </View>

          </View>


        </ImageBackground>

      </View>
    );
  }


}
export default inject("authStore")(observer(SolutionMobileScreen));
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

  },

});
