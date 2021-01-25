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


class PageIntro extends Component {

  constructor(props) {
    super(props);
    SyncStorage.remove("connected");
    SyncStorage.remove("user");
    SyncStorage.remove('username');
    SyncStorage.remove('password');
    
  }

  render() {
    return (
      <View style={{ height: '100%' }}>


        <ImageBackground
          source={require("../assets/images/accueil.png")}
          style={styles.imgBackground}
          imageStyle={{ opacity: 1 }}
        >
          <Image
            style={{ width: '50%' }}
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
    width: "100%",
    height: "100%",
    alignItems: "center",
  },

});
