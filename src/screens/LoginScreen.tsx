import * as React from "react";
import { StyleSheet, SafeAreaView, FlatList, Alert } from "react-native";
import Constants from "expo-constants";

import { StackScreenProps } from "@react-navigation/stack";
import { LoginStackParamList, RootStackParamList } from "../types";
import SyncStorage from 'sync-storage';

import { Root } from "native-base";
import { inject, observer } from "mobx-react";
import {
    Toast,
    Title,
    List,
    ListItem,
    Content,
    Left,
    Right,
    Icon,
    Text,
    Body,
    Button,
    Container,
    Header,
    Form,
    Item,
    Input,
    Spinner,
} from "native-base";
import { Image, ImageBackground, RefreshControl, ScrollView, View, TextInput, Keyboard, ActivityIndicator } from "react-native";
import AuthStore from "../stores/AuthStore";
import { authentification, get } from '../utils/connectorFileMaker';
import NetworkUtils from '../utils/NetworkUtils';
type Props = {
    authStore: AuthStore;
} & StackScreenProps<RootStackParamList, "Logout">;
import RNRestart from 'react-native-restart'; // Import package from node modules


let keyboardDidHideListener;

const LoginScreen = ({ navigation, authStore }: Props) => {
    const [isLoading, setLoading] = React.useState<Boolean>(false);
    const [isLoadingTemp, setLoadingTemp] = React.useState<Boolean>(false);


    async function onLogin() {

        let layout = "mobile_ACCOUNT2";
        if (!isLoadingTemp) {
            setLoadingTemp(true);
            setLoading(true);

            let user = await authentification(authStore.username, authStore.password, global.fmServer, global.fmDatabase, layout, "&_C_nomComplet=" + authStore.username);


            if (user == -1) {
                // alert("Mauvais password");
                setLoading(false);
                setLoadingTemp(false);
                Toast.show({
                    position: "top",
                    text: "Mauvais identifiants",
                });

            } else {
                // alert("Ici");
                let role = "";
                SyncStorage.set('connected', true);
                SyncStorage.set('username', authStore.username);
                SyncStorage.set('user', user[0]);
                //1 = client 0 = employe
                if (user[0].PrivilegeSet == 1) {
                    await SyncStorage.set('typeAccount', 1)
                } else if (user[0].PrivilegeSet == 2) {
                    await SyncStorage.set('typeAccount', 2)
                } else {
                    //planification
                    await SyncStorage.set('typeAccount', 0);
                }
                if (user[0].PrivilegeSet == 1) {
                    //Client id
                    let client = await get(authStore.username, authStore.password, global.fmServer, global.fmDatabase, "mobile_CLIENTS2"
                        , "&Nom=" + authStore.username);

                    SyncStorage.set('client_PK', client[0].pk_ID);
                }

                SyncStorage.set('password', authStore.password);
                navigation.goBack();
                authStore.password = "";
                navigation.navigate("Main");
                setLoading(false);
                setLoadingTemp(false);
            }
        }
    }


    async function _keyboardDidHide() {
        // alert("Keyboard did hide " + authStore.username.length + " " + authStore.password.length);
        if (!isLoadingTemp && authStore.password.length > 2) {
            // alert("Avant executer onconnected");
            setLoadingTemp(true);
            await onLogin();
        }
    }


    React.useEffect(() => {
        if (SyncStorage.get('username')) {
            authStore.username = SyncStorage.get('username');
        }
        // keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow());
        keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
        return () => {
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        }
    });

    if (!NetworkUtils.isNetworkAvailable()) {
        alert("Erreur de connexion");
    }

    return (


        <Root>
            { isLoading ?
                <View style={[styles.container, styles.horizontal]}>

                    <ActivityIndicator size="large" color="black" />

                </View>


                :
                <ImageBackground
                    source={require("../assets/images/accueil.png")}
                    style={styles.imgBackground}
                    imageStyle={{ opacity: 1 }}
                >
                    <Container style={{ flexGrow: 1, flex: 1, backgroundColor: 'transparent' }}>

                        <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.content}>
                            <Content style={{ flexGrow: 1, flex: 1, flexDirection: "row" }}>
                                <Title style={{ margin: 30 }}>Portail V-hicule Média</Title>

                                <View style={[styles.subContainer, { justifyContent: "flex-start" }]}>
                                    <Form style={styles.form}>
                                        <Image
                                            style={{ width: '100%' }}
                                            resizeMode={"contain"}
                                            source={require("../assets/images/vhiculeMedia.png")}
                                        />

                                        <TextInput
                                            placeholderTextColor="#404040"
                                            style={{ height: 44, width: '90%', borderWidth: 0.5, borderColor: '#303030', padding: 15 }}
                                            value={authStore.username}
                                            onChange={(e) => (authStore.username = e.nativeEvent.text)}
                                            placeholder="Nom d'utilisateur"
                                        />



                                        <TextInput
                                            placeholderTextColor="#404040"

                                            secureTextEntry={true}
                                            value={authStore.password}
                                            placeholder="Mot de passe"
                                            onChange={(e) => (authStore.password = e.nativeEvent.text)}
                                            style={{ height: 44, width: '90%', borderWidth: 0.5, borderColor: '#303030', padding: 15, marginTop: 10 }}

                                        />

                                    </Form>

                                    <Button
                                        onPress={async () => {
                                            await onLogin()
                                        }}
                                        style={[styles.button]}
                                    >
                                        <Text> Se connecter</Text>
                                    </Button>

                                    <Button

                                        onPress={() => {
                                            navigation.goBack();
                                        }}
                                        style={[styles.button]}
                                    >
                                        <Text style={{ color: 'white' }}>Annuler</Text>
                                    </Button>
                                </View>
                            </Content>
                        </ScrollView>
                    </Container>
                </ImageBackground>
            }


        </Root>
    );
};
export default inject("authStore")(observer(LoginScreen));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },

    imgBackground: {
        width: "100%",
        height: "100%",
        alignItems: "center",
    },
    content: {
        flexDirection: "column",
        flex: 1,
        flexGrow: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        width: 200,
        margin: 20,
        alignSelf: "center",
        textAlign: "center",
        justifyContent: "center",
        backgroundColor: "#0F29AC",
    },
    horizontalRule: {
        borderBottomColor: "black",
        borderBottomWidth: 1,
        marginTop: 10,
        marginBottom: 10,
    },
    form: {
        backgroundColor: "transparent",
    },
    subContainer: {
        flex: 1,

        justifyContent: "center",
    },
});
