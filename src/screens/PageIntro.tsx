/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import SyncStorage from 'sync-storage';
import { Icon } from 'native-base';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';

import {
  Modal,
  StyleSheet,
  ImageBackground,
  Text,
  StatusBar,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";


class PageIntro extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    (async () => await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    }))();

    // alert("Component did mount");
  }



  render() {

    return (
      <View style={{ height: '100%' }}>

        <StatusBar hidden />

        <ImageBackground
          source={require("../assets/images/accueil.png")}
          style={styles.imgBackground}
          imageStyle={{ opacity: 1 }}
        >
          <Image
            style={{ width: '50%', top: 25 }}
            resizeMode={"contain"}
            source={require("../assets/images/vhiculeMedia.png")}
          />

          <TouchableOpacity
            style={styles.accueil}
            onPress={() => {
              this.props.navigation.navigate('Accueil');
            }}
          >

            <View style={styles.buttonTitle}>
              <View style={{ width: '30%', marginLeft: 10 }}>
                <Icon name="home" type={"MaterialCommunityIcons"} style={{ fontSize: 24, marginLeft: 2, color: 'white' }} />
              </View>
              <View style={{ justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 20 }}>{"Accueil"}</Text>
              </View>

            </View>

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.accueil}
            onPress={() => {
              this.props.navigation.navigate('Client');
            }}
          >

            <View style={styles.buttonTitle}>
              <View style={{ width: '30%', marginLeft: 10 }}>
                <Icon name="organization" type={"SimpleLineIcons"} style={{ fontSize: 24, marginLeft: 2, color: 'white' }} />
              </View>
              <View style={{ justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 20 }}>{"Clients"}</Text>
              </View>

            </View>

          </TouchableOpacity>



          <TouchableOpacity
            style={styles.solutions}
            onPress={() => {
              this.props.navigation.navigate('SolutionsScreen');
            }}

          >
            <View style={styles.buttonTitle}>

              <View style={{ width: '30%', marginLeft: 10 }}>
                <Icon name="lightbulb" type={"Foundation"} style={{ fontSize: 24, marginLeft: 2, color: 'black' }} />
              </View>


              <View style={{ justifyContent: 'center' }}>
                <Text style={{ color: 'black', fontSize: 20 }}>{"Solutions"}</Text>
              </View>

            </View>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.support}
            onPress={() => {
              this.props.navigation.navigate('Support');
            }}

          >
            <View style={styles.buttonTitle}>

              <View style={{ width: '30%', marginLeft: 10 }}>
                <Icon name="customerservice" type={"AntDesign"} style={{ fontSize: 24, marginLeft: 2, color: 'black' }} />
              </View>


              <View style={{ justifyContent: 'center' }}>
                <Text style={{ color: 'black', fontSize: 20 }}>{"Support"}</Text>
              </View>

            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonLogin}
            onPress={() => {
              // alert(SyncStorage.get('connected'));
              if (SyncStorage.get('connected')) {
                this.props.navigation.navigate('Main');
              } else {
                this.props.navigation.navigate('Login');
              }

            }}

          >
            <View style={styles.buttonTitle}>

              <View style={{ width: '30%', marginLeft: 10 }}>
                <Icon name="login" type={"AntDesign"} style={{ fontSize: 24, marginLeft: 2, color: 'white' }} />

              </View>

              <View style={{ justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 20 }}>{"Connexion"}</Text>
              </View>

            </View>
          </TouchableOpacity>

        </ImageBackground>

      </View>
    );
  }


}
export default inject("authStore")(observer(PageIntro));
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
    top: 50,
    marginTop: 10,
    backgroundColor: '#1C1E53',
    width: '50%',
    height: 50,
    justifyContent: 'center',
    borderColor: 'black',
    borderRadius: 15,
  },

  support: {
    top: 50,
    marginTop: 10,
    backgroundColor: 'white',
    width: '50%',
    height: 50,
    justifyContent: 'center',
    borderColor: 'black',
    borderRadius: 15,
  },

  solutions: {
    top: 50,
    marginTop: 10,
    backgroundColor: 'white',
    width: '50%',
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
    top: '90%',
    position: 'absolute',
    backgroundColor: '#1C1E53',
    marginTop: 10,
    width: '50%',
    height: 50,
    justifyContent: 'center',
    borderColor: 'black',
    borderRadius: 15,
  },

  imgBackground: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },

});
