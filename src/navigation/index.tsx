import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { Component } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { ColorSchemeName, View, Text, ImageBackground, Image, TouchableOpacity, DevSettings, Alert } from "react-native";

import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentOptions } from "@react-navigation/drawer";
//import BarcodeScreen from "../screens/BarcodeScreen";
import { RootStackParamList, MainStackParamList, LoginStackParamList, DrawerStackParamList } from "../types";
import { createStackNavigator } from "@react-navigation/stack";
type InitialRouteNames = "Logout" | "Login";
import LoginScreen from "../screens/LoginScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import PageIntro from "../screens/PageIntro";
import ClientScreen from "../screens/ClientScreen";
import Entypo from "react-native-vector-icons/Entypo";
import { EventRegister } from 'react-native-event-listeners'

import MainScreen from "../screens/MainScreen";
import Bilan from "../screens/Bilan";

import SupportScreen from "../screens/SupportScreen";


import Sidebar from "../components/Sidebar";
import SyncStorage from 'sync-storage';
import TempsDetailsScreen from "../screens/TempsDetailsScreen";
import TempsDetailsClient from "../screens/TempsDetailsClient";
import TempsDetailsFilter from "../screens/TempsDetailsFilter";

import { Icon } from "native-base";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SolutionMobileScreen from "../screens/SolutionMobileScreen";
import CalendrierModeList from "../screens/CalendrierModeList";

import SolutionSanteScreen from "../screens/SolutionSanteScreen";
import SolutionPortailScreen from "../screens/SolutionPortailScreen";
import SolutionVhmClassesScreen from "../screens/SolutionVhmClassesScreen";
import SolutionB2bScreen from "../screens/SolutionB2bScreen";

import SolutionScreen from "../screens/SolutionScreen";

import AccueilScreen from "../screens/AccueilScreen";
import SolutionInformatiqueDecisionnelScreen from "../screens/SolutionInformatiqueDecisionnelScreen";


// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            typeAccount: 0,
        };
    }


    async componentDidMount() {
        // alert("Component did mount");

        const data = await SyncStorage.init();
        if (SyncStorage.get('typeAccount')) {
            this.setState({ typeAccount: SyncStorage.get('typeAccount') });
        }

    }





    render() {
        // alert("Render navig");

        const Tab = createBottomTabNavigator();
        const Stack = createStackNavigator();
        const Drawer = createDrawerNavigator();
        // alert(this.state.typeAccount);

        let Object = this;

        function CustomDrawerContent(props) {
            return (
                <View>

                    <ImageBackground style={{ width: '100%', height: '100%' }}
                        source={require("../assets/images/accueil.png")}
                    >

                        <View>
                            <Image source={require("../assets/images/vhiculeMedia.png")} style={{ width: 175, top: 10, left: 25 }} resizeMode={'contain'} />
                        </View>




                        <View style={{ flexDirection: 'row', top: 25, height: 50, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                props.navigation.goBack()
                                props.navigation.navigate("PageIntro")
                            }
                            }
                            >
                                <Text style={{ color: '#1C1E53', fontWeight: 'bold' }}>  <Icon name="home" type="Ionicons" style={{ top: 15, fontSize: 24, color: "#1C1E53" }}> </Icon> Accueil </Text>
                            </TouchableOpacity>
                        </View>


                        {SyncStorage.get('connected') ?
                            <View style={{ flexDirection: 'row', top: 25, height: 50, alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => props.navigation.navigate("Main")}>
                                    <Text style={{ color: '#1C1E53', fontWeight: 'bold' }}>  <Icon name="calendar" style={{ top: 15, fontSize: 24, color: '#1C1E53' }}> </Icon> Calendrier </Text>
                                </TouchableOpacity>
                            </View>


                            : null}

                        <View style={{ flexDirection: 'row', top: 25, height: 50, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => props.navigation.navigate("SolutionsScreen")}>
                                <Text style={{ color: "#1C1E53", fontWeight: 'bold' }}>  <Icon name="lightbulb" type={"Foundation"} style={{ top: 15, fontSize: 24, color: '#1C1E53' }}> </Icon> Solutions </Text>

                            </TouchableOpacity>
                        </View>


                        <View style={{ flexDirection: 'row', top: 25, height: 50, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => props.navigation.navigate("Support")} >
                                <Text style={{ color: "#1C1E53", fontWeight: 'bold' }}>  <Icon name="customerservice" type="AntDesign" style={{ top: 15, fontSize: 24, color: "#1C1E53" }}> </Icon> Support </Text>

                            </TouchableOpacity>
                        </View>

                        {SyncStorage.get("connected") ?
                            <View style={{ flexDirection: 'row', top: 25, height: 50, alignItems: 'center' }}>
                                <TouchableOpacity onPress={async () => {
                                    await SyncStorage.getAllKeys().map(k => SyncStorage.remove(k));

                                    SyncStorage.set('typeAccount', 1);
                                    Object.setState({ typeAccount: "1" });
                                    props.navigation.navigate("PageIntro");
                                }
                                }>
                                    <Text style={{ color: "#1C1E53", fontWeight: 'bold' }}>  <Icon name="logout" type="AntDesign" style={{ top: 15, fontSize: 24, color: "#1C1E53" }}> </Icon> Deconnexion </Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{ flexDirection: 'row', top: 25, height: 50, alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => props.navigation.navigate("Login")}>
                                    <Text style={{ color: "#1C1E53", fontWeight: 'bold' }}>  <Icon name="login" type="AntDesign" style={{ top: 15, fontSize: 24, color: "#1C1E53" }}> </Icon> Connexion </Text>
                                </TouchableOpacity>
                            </View>
                        }

                        {SyncStorage.get("connected") ?
                            <View style={{ position: 'absolute', bottom: 0, height: 50, }}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>  {SyncStorage.get('user')._C_nomComplet} </Text>
                            </View>
                            :
                            null
                        }
                    </ImageBackground>
                </View>
            );
        }

        function CalendrierStack() {

            return (
                <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal" >
                    <Stack.Screen name="Main" component={MainScreen} />

                    <Stack.Screen name="TempsDetailsFilter" component={TempsDetailsFilter} />


                    <Stack.Screen name="TempsDetails" component={TempsDetailsScreen} />
                    <Stack.Screen name="TempsDetailsClient" component={TempsDetailsClient} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                </Stack.Navigator>
            );
        }

        function CalendrierListeStack() {

            return (
                <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal" >
                    <Stack.Screen name="CalendrierModeList" component={CalendrierModeList} />
                    <Stack.Screen name="TempsDetailsFilter" component={TempsDetailsFilter} />
                    <Stack.Screen name="TempsDetailsClient" component={TempsDetailsClient} />


                </Stack.Navigator>
            );
        }

        function BilanStack() {

            return (
                <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal" >
                    <Stack.Screen name="Bilan" component={Bilan} />
                </Stack.Navigator>
            );
        }


        function MainStack() {

            let render = null;
            if (SyncStorage.get('typeAccount') == "1") {
                render = <Tab.Navigator
                    tabBarOptions={{
                        activeTintColor: '#1f4598',
                        inactiveTintColor: 'gray',
                    }}
                    style={{
                        backgroundColor: 'blue',
                    }}

                >
                    <Stack.Screen options=
                        {{

                            tabBarLabel: 'Calendrier',
                            tabBarIcon: ({ color, size }) => (
                                <Entypo name="calendar" color={"#1f4598"} size={size} />
                            ),

                        }} name="Main" component={CalendrierStack} />
                    <Stack.Screen options=
                        {{
                            tabBarLabel: 'Mode Liste',
                            tabBarIcon: ({ color, size }) => (
                                <Entypo name="list" color={"#1f4598"} size={size} />
                            ),

                        }} name="CalendrierModeList" component={CalendrierListeStack} />
                    <Stack.Screen options=
                        {{
                            tabBarLabel: 'Mode Bilan',
                            tabBarIcon: ({ color, size }) => (
                                <Entypo name="bar-graph" color={"#1f4598"} size={size} />
                            ),
                        }} name="BilanStack" component={BilanStack} />
                </Tab.Navigator>


            } else {
                render = <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal" >
                    <Stack.Screen name="Main" component={MainScreen} />
                    <Stack.Screen name="PageIntro" component={PageIntro} />
                    <Stack.Screen name="TempsDetailsFilter" component={TempsDetailsFilter} />
                    <Stack.Screen name="TempsDetails" component={TempsDetailsScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                </Stack.Navigator>
            }
            return (
                render

            );
        }



        function IntroStack() {

            return (
                <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal" >
                    <Stack.Screen name="PageIntro" component={PageIntro} />
                    <Stack.Screen name="Main" component={MainScreen} />
                    <Stack.Screen name="TempsDetails" component={TempsDetailsScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Support" component={SupportScreen} />
                    <Stack.Screen name="SolutionsScreen" component={SolutionScreen} />
                    <Stack.Screen name="SolutionMobile" component={SolutionMobileScreen} />
                    <Stack.Screen name="SolutionB2b" component={SolutionB2bScreen} />
                    <Stack.Screen name="SolutionSante" component={SolutionSanteScreen} />
                    <Stack.Screen name="SolutionVhmClasses" component={SolutionVhmClassesScreen} />
                    <Stack.Screen name="SolutionPortail" component={SolutionPortailScreen} />
                    <Stack.Screen name="SolutionInformatiqueDecisionnel" component={SolutionInformatiqueDecisionnelScreen} />

                    <Stack.Screen name="Accueil" component={AccueilScreen} />
                </Stack.Navigator>
            );
        }

        function AccueilStack() {

            return (
                <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal" >
                    <Stack.Screen name="Accueil" component={AccueilScreen} />
                    <Stack.Screen name="PageIntro" component={PageIntro} />
                    <Stack.Screen name="TempsDetails" component={TempsDetailsScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Support" component={SupportScreen} />
                    <Stack.Screen name="SolutionsScreen" component={SolutionScreen} />
                    <Stack.Screen name="SolutionMobile" component={SolutionMobileScreen} />
                    <Stack.Screen name="SolutionB2b" component={SolutionB2bScreen} />
                    <Stack.Screen name="SolutionSante" component={SolutionSanteScreen} />
                    <Stack.Screen name="SolutionVhmClasses" component={SolutionVhmClassesScreen} />
                    <Stack.Screen name="SolutionPortail" component={SolutionPortailScreen} />
                    <Stack.Screen name="SolutionInformatiqueDecisionnel" component={SolutionInformatiqueDecisionnelScreen} />

                    <Stack.Screen name="Accueil" component={AccueilScreen} />
                </Stack.Navigator>
            );
        }


        function ClientStack() {

            return (
                <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal" >
                    <Stack.Screen name="Client" component={ClientScreen} />
                    <Stack.Screen name="PageIntro" component={PageIntro} />
                </Stack.Navigator>
            );
        }


        function SolutionStack() {

            return (
                <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal" >
                    <Stack.Screen name="SolutionsScreen" component={SolutionScreen} />
                    <Stack.Screen name="PageIntro" component={PageIntro} />
                </Stack.Navigator>
            );
        }


        function SupportStack() {

            return (
                <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal" >
                    <Stack.Screen name="SupportScreen" component={SupportScreen} />
                    <Stack.Screen name="PageIntro" component={PageIntro} />
                </Stack.Navigator>
            );
        }









        let initialRoute = "Accueil";



        global.fmServer = "vhmsoft.com";
        global.fmDatabase = "vhmsoft";

        if (SyncStorage.get("account") == "client") {
            initialRoute = "Calendrier"
        }

        console.log("Connected " + SyncStorage.get('connected'));



        let navigation =
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} />}

            >
                <Drawer.Screen name="PageIntro" component={PageIntro} />
                <Drawer.Screen name="Main" component={MainStack} />
                <Drawer.Screen name="TempsDetails" component={TempsDetailsScreen} />
                <Drawer.Screen name="Login" component={LoginScreen} />
                <Drawer.Screen name="Support" component={SupportScreen} />
                <Drawer.Screen name="Client" component={ClientScreen} />

                <Drawer.Screen name="SolutionsScreen" component={SolutionScreen} />
                <Drawer.Screen name="SolutionMobile" component={SolutionMobileScreen} />
                <Drawer.Screen name="SolutionB2b" component={SolutionB2bScreen} />
                <Drawer.Screen name="SolutionSante" component={SolutionSanteScreen} />
                <Drawer.Screen name="SolutionVhmClasses" component={SolutionVhmClassesScreen} />

                <Drawer.Screen name="SolutionPortail" component={SolutionPortailScreen} />
                <Drawer.Screen name="SolutionInformatiqueDecisionnel" component={SolutionInformatiqueDecisionnelScreen} />

                <Drawer.Screen name="Accueil" component={AccueilScreen} />

            </Drawer.Navigator>;
        return (
            <NavigationContainer>

                {navigation}

            </NavigationContainer>
        )
    }



}
