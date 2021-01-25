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


class SolutionSanteScreen extends Component {

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
              <Text style={{ fontFamily: 'Arial', fontWeight: 'bold', color: '#1f4598' }}>              Informatique en Santé</Text>
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

              </Text>
            </View>
            <View style={{ maxHeight: 200, padding: 8 }}>
              <Text>Nous développons des plateformes reconnues dans les centres de santé au Québec

              Nos solutions sont déployées depuis plusieurs années dans les grands centres hospitaliers du Québec. Dans le cadre du CRDS (Centre de répartiton de demandes de service), nous avons traité plus d'un miliion de dossiers-patient dans le processus de référencement des médecins spécialistes.
              </Text>

            </View>
            <View style={{ alignItems: 'center', maxHeight: 250,backgroundColor:'white' }}>
              <Image source={require("../assets/images/clientssantes.png")} style={{ width: 400, maxHeight: 245 }} resizeMode={'contain'} />

            </View>
            <View style={{ padding: 8 }}>
              <Unorderedlist><Text style={{ fontWeight: 'bold',color:'white' }}>CRDS LLL (Laval-Laurentides-Lanaudière)</Text></Unorderedlist>
              <Unorderedlist><Text style={{ fontWeight: 'bold',color:'white' }}>CRDS Montérégie</Text></Unorderedlist>
              <Unorderedlist><Text style={{ fontWeight: 'bold',color:'white' }}>CRDS Gaspésie</Text></Unorderedlist>
              <Unorderedlist><Text style={{ fontWeight: 'bold',color:'white' }}>
                Portail MD répondants</Text></Unorderedlist>

            </View>
       

          </View>


        </ImageBackground>

      </View>
    );
  }


}
export default inject("authStore")(observer(SolutionSanteScreen));
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
