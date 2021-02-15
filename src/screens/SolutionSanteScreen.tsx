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
  Platform,
  ImageBackground,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
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
          <Header
            style={Platform.OS != 'ios' ? { backgroundColor: 'transparent', height: 80, justifyContent: 'center' } : null}
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
              <Text style={{ fontWeight: 'bold', color: '#1f4598' }}>Santé</Text>
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
            <View style={{ padding: 8 }}>
              <Unorderedlist><Text style={{ fontWeight: 'bold', color: 'black' }}>CRDS LLL (Laval-Laurentides-Lanaudière)</Text></Unorderedlist>
              <Unorderedlist><Text style={{ fontWeight: 'bold', color: 'black' }}>CRDS Montérégie</Text></Unorderedlist>
              <Unorderedlist><Text style={{ fontWeight: 'bold', color: 'black' }}>CRDS Gaspésie</Text></Unorderedlist>
              <Unorderedlist><Text style={{ fontWeight: 'bold', color: 'black' }}>
                Portail MD répondants</Text></Unorderedlist>

            </View>
            <View>

            </View>
            <ScrollView contentContainerStyle={{ top: 25, borderWidth: 0, borderColor: '#DDE9F9' }} >
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



            </ScrollView>



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
