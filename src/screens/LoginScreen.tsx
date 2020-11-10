import * as React from "react";
import { StyleSheet, SafeAreaView, FlatList } from "react-native";
import Constants from "expo-constants";

import { StackScreenProps } from "@react-navigation/stack";
import { LoginStackParamList, RootStackParamList } from "../types";

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
import { Image, ImageBackground, RefreshControl, ScrollView, View } from "react-native";
import AuthStore from "../stores/AuthStore";

type Props = {
    authStore: AuthStore;
} & StackScreenProps<RootStackParamList, "Logout">;

const LoginScreen = ({ navigation, authStore }: Props) => {
    return (
        <Root>
            <Container style={{ flexGrow: 1, flex: 1 }}>
                <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.content}>
                    <Content style={{ flexGrow: 1, flex: 1, flexDirection: "row" }}>
                        <Title style={{ margin: 30 }}>Connexion</Title>

                        <View style={[styles.subContainer, { justifyContent: "flex-start" }]}>
                            <Form style={styles.form}>
                                <Item>
                                    <Input
                                        value={authStore.username}
                                        onChange={(e) => (authStore.username = e.nativeEvent.text)}
                                        placeholder="Nom d'utilisateur"
                                    />
                                </Item>
                                <Item bordered={false}>
                                    <Input
                                        secureTextEntry={true}
                                        value={authStore.password}
                                        placeholder="Mot de passe"
                                        onChange={(e) => (authStore.password = e.nativeEvent.text)}
                                    />
                                </Item>
                            </Form>
                            <Button
                                onPress={() => {
                                    authStore.setToken();
                                    const store = authStore;

                                    authStore
                                        .login()
                                        .then((isAuthorized) => {
                                            if (isAuthorized) {
                                                navigation.navigate("Login");
                                                return;
                                            }
                                            Toast.show({
                                                position: "top",
                                                text: "Mauvais identifiants",
                                            });
                                        })
                                        .then((err) => {
                                            console.log(err);
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                                }}
                                style={[styles.button]}
                            >
                                {authStore.authLoading ? <Spinner color="white" /> : <Text> Se connecter</Text>}
                            </Button>

                            <Button
                                transparent
                                onPress={() => {
                                    navigation.goBack();
                                }}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignSelf: "center",
                                }}
                            >
                                <Text>Annuler</Text>
                            </Button>
                        </View>
                    </Content>
                </ScrollView>
            </Container>
        </Root>
    );
};
export default inject("authStore")(observer(LoginScreen));

const styles = StyleSheet.create({
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
        backgroundColor: "white",
    },
    subContainer: {
        flex: 1,

        justifyContent: "center",
    },
});
