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
                        <Text style={{ fontFamily: 'Arial', fontWeight: 'bold', color: '#1f4598' }}> Accueil </Text>
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

                <View>
                            
                            <Text style={{marginTop:10,fontWeight:'bold',fontSize:24}}>PROPOSITIONS ET ESTIMATION</Text>
                            <Text style={{fontSize:16,marginTop:5,fontSize:20}}>Nous vous proposons des solutions adaptées à vos besoins et à votre budget pour donner vie à tous vos projets.</Text>
                            <Text style={{fontWeight:'bold',fontSize:24,marginTop:10}}>DÉVELOPPEMENT SUR MESURE</Text>
                            <Text style={{marginTop:8,fontSize:20}}>Nous développons des solutions personnalisées et des applications sur mesure répondant à vos critères et vos enjeux de productivité.</Text>
                            <Text style={{fontWeight:'bold',fontSize:24,marginTop:8}}>SUPPORT 7 JOURS / 24H</Text>
                            <Text style={{marginTop:6,fontSize:20}}>Nous vous accompagnons bien au-delà de l'acquisition de votre nouveau système et nous vous offrons le support technique 7 jours par semaine, 24 heures sur 24, de façon à régler sur-le-champ tout problème ponctuel afin de faciliter le déploiement et l’adoption de notre solution.</Text>
                            
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
