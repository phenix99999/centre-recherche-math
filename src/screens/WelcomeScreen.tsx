import * as React from "react";
import { StyleSheet, SafeAreaView, FlatList } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, LoginStackParamList } from "../types";

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
import { TextInput } from "react-native-gesture-handler";

type Props = {
    authStore: AuthStore;
} & StackScreenProps<LoginStackParamList, "Welcome">;

const WelcomeScreen = ({ navigation, authStore }: Props) => {
    return (
        <Container style={{ flexGrow: 1, flex: 1 }}>
            <ImageBackground
                source={require("../assets/images/accueil.png")}
                style={styles.imgBackground}
                imageStyle={{ opacity: 1 }}
            >
                <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.content}>
                    <Image
                        style={{ width: 250, marginTop: 30 }}
                        resizeMode={"contain"}
                        source={require("../assets/images/header.png")}
                    />

                    <Content style={{ flex: 1, flexDirection: "row" }}>
                        <View style={[styles.subContainer, { justifyContent: "flex-end" }]}>
                            <Button
                                onPress={() => {
                                    navigation.navigate("WelcomeForm");
                                }}
                                style={[styles.button]}
                            >
                                <Text>Connexion</Text>
                            </Button>
                        </View>
                    </Content>
                </ScrollView>
            </ImageBackground>
        </Container>
    );
};
export default inject("authStore")(observer(WelcomeScreen));

const styles = StyleSheet.create({
    imgBackground: {
        width: "100%",
        height: "100%",
        alignItems: "center",
    },
    content: {
        flexDirection: "column",
        flex: 1,
        alignItems: "center",
    },
    button: {
        width: 200,
        margin: 20,
        alignSelf: "center",
        textAlign: "center",
        backgroundColor: "#0F29AC",
        justifyContent: "center",
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
    },
});
