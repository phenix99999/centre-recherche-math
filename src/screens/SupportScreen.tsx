/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import SyncStorage from 'sync-storage';

import { useFonts } from 'expo-font';
import { Container, Header, Button, Right, Left, Body, Icon, Text,Textarea } from "native-base";


import {
    Modal,
    StyleSheet,
    ImageBackground,
    Picker,
    SafeAreaView,
    View,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";


class SupportScreen extends Component {

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
                        <Text style={{ fontFamily: 'Arial', fontWeight: 'bold', color: '#1f4598' }}>Support</Text>
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


                <SafeAreaView style={{ padding: 20, backgroundColor: 'transparent', top: 10, marginLeft: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1C1E53' }}>
                        Un problème ? Nos experts sont à votre service. Rédigez votre billet de support avec le plus de détails possibles et nous vous garantissons un retour dans les  meilleurs délais.

                            </Text>

             
                    <View style={{ flexDirection: 'row',zIndex:500, alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontSize: 14 }}>
                            Nom
                </Text>
                        <TextInput
                            style={{ height: 30, width: '70%', padding: 2, borderColor: 'black', borderWidth: 1, marginLeft: 'auto', marginRight: 25,backgroundColor:'white' }}

                        />
                    </View>
                    <View style={{flexDirection:'row',height:10,zIndex:500}}>

                    </View>

                    <View style={{ flexDirection: 'row',zIndex:500, alignItems: 'center' }}>
                        <Text style={{ fontSize: 14 }}>
                            Courriel
                </Text>
                        <TextInput
                            style={{ height: 30, width: '70%', padding: 2, borderColor: 'black',backgroundColor:'white', borderWidth: 1, marginLeft: 'auto', marginRight: 25 }}

                        />
                    </View>



                    <View style={{ flexDirection: 'row', alignItems: 'center' ,marginTop: 13 }}>
                        <Text style={{ fontSize: 14 }}>
                            Priorité
                </Text>
                 <Picker
                        selectedValue={""}
                        style={{height: 25, width: 25,top:-100,left:50}}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({language: itemValue})
                        }>
                        <Picker.Item label="1" value="1" />
                        <Picker.Item label="2" value="2" />
                        <Picker.Item label="3" value="3" />
                        <Picker.Item label="4" value="4" />
                        <Picker.Item label="5" value="5" />
                        </Picker>
                </View>
                    



                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10,zIndex:5000 }}>
                        <Text style={{ fontSize: 14 }}>
                            Description
                </Text>
                        {/* <TextInput
                            style={{ height: 30, width: '70%', padding: 2, borderColor: 'black', borderWidth: 1, marginLeft: 'auto', marginRight: 25 }}

                        /> */}

                    <Textarea
                        placeholder={"Écrivez la description ici"}
                        bordered
                        underline
                        style={{ width: '70%', padding: 2, borderColor: 'black',backgroundColor:'white', borderWidth: 1, marginLeft: 'auto', marginRight: 25 }}
                        rowSpan={5}
                     
                        value={""}
                        onChangeText={(text) => {

                            // setRecord({...record,"Description": text});
                        }}
                    />

                    </View>


                    <View style={{ alignItems: 'center', marginTop: 25 }}>



                        <TouchableOpacity onPress={() => alert("A venir!")} style={{ padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1f4598', width: "60%" }}>
                            <Text style={{ color: 'white' }}> Envoyer </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

            </ImageBackground>


        );
    }


}
export default inject("authStore")(observer(SupportScreen));
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
