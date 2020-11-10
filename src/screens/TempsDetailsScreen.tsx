import { StackScreenProps } from "@react-navigation/stack";
import { inject, observer } from "mobx-react";
import {
    Content,
    Form,
    Input,
    Item,
    Label,
    Left,
    Right,
    Header,
    Container,
    Body,
    Icon,
    Button,
    Text,
    Textarea,
} from "native-base";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { CustomPickerRow } from "../components/CustomPicker";
import { Record, Client, Activite, Projet } from "../stores/FMObjectTypes";
import TimeStore from "../stores/TimeStore";
import { MainStackParamList } from "../types";

type Props = {
    timeStore: TimeStore;
} & StackScreenProps<MainStackParamList, "Main">;

const TempsDetails = ({ navigation, timeStore }: Props) => {
    const record = timeStore.selectedHeure;
    const editionMode = timeStore.resources.heure.editionMode;
    const crud = timeStore.resources.heure;

    React.useEffect(() => {
        timeStore.loadPickerData();
    }, []);

    return (
        <Container>
            <Header>
                <Left>
                    <Button
                        onPress={() => {
                            crud.clear();
                            navigation.goBack();
                        }}
                        transparent
                    >
                        {editionMode === "create" ? <Text>Annuler</Text> : <Icon name="arrow-back"></Icon>}
                    </Button>
                </Left>

                <Body>
                    <Text>{editionMode === "create" ? "Nouvelle entrée" : "Modifier"}</Text>
                </Body>
                <Right>
                    {editionMode === "create" ? (
                        <Button
                            transparent
                            onPress={() => {
                                timeStore.create();
                                timeStore.fetchHeures();
                                navigation.goBack();
                            }}
                        >
                            <Text>Créer</Text>
                        </Button>
                    ) : null}
                </Right>
            </Header>

            <Content style={{ flex: 1, flexDirection: "column" }}>
                <CustomPickerRow<Client>
                    records={timeStore.resources.client.records}
                    valueKey={"pk_ID"}
                    getLabel={(client: Record<Client>) => client.fields.Nom}
                    selectedValue={Number(crud.shownValue("fk_client"))}
                    onChange={(value) => {
                        crud.updateValue("fk_client", value, true);
                        timeStore.loadPickerData();
                        if (editionMode === "update") {
                            timeStore.fetchHeures();
                        }
                    }}
                    placeholder={"Client"}
                />
                <CustomPickerRow<Projet>
                    records={timeStore.resources.projet.records}
                    valueKey={"pk_ID"}
                    getLabel={(projet: Record<Projet>) => projet.fields.Nom}
                    selectedValue={Number(crud.shownValue("fk_projet"))}
                    onChange={(value) => {
                        crud.updateValue("fk_projet", value, true);
                        if (editionMode === "update") {
                            timeStore.fetchHeures();
                        }
                    }}
                    placeholder={"Projets"}
                />
                <CustomPickerRow<Activite>
                    records={timeStore.resources.activite.records}
                    valueKey={"pk_ID"}
                    getLabel={(activite: Record<Activite>) => activite.fields.Nom}
                    selectedValue={Number(crud.shownValue("fk_activites"))}
                    onChange={(value) => {
                        crud.updateValue("fk_activites", value, true);
                        if (editionMode === "update") {
                            timeStore.fetchHeures();
                        }
                    }}
                    placeholder={"Activités"}
                />
                <Text>Description</Text>
                <Textarea
                    placeholder={"Écrivez la description ici"}
                    bordered
                    underline
                    style={{ backgroundColor: "rgb(222, 222, 222)" }}
                    rowSpan={5}
                    value={crud.shownValue("Description")}
                    onChangeText={(text) => crud.updateValue("Description", text)}
                    onBlur={() => {
                        if (editionMode == "update") {
                            crud.save();
                            timeStore.fetchHeures();
                        }
                    }}
                />
                <Form>
                    <Item floatingLabel last>
                        <Label>Nombre d'heures</Label>
                        <Input
                            value={crud.shownValue("Minutes")}
                            onChangeText={(text) => crud.updateValue("Minutes", text)}
                            keyboardType={"numeric"}
                            onBlur={() => {
                                if (editionMode == "update") {
                                    crud.save();
                                    timeStore.fetchHeures();
                                }
                            }}
                        />
                    </Item>
                </Form>
            </Content>
        </Container>
    );
};
export default inject("timeStore")(observer(TempsDetails));

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
