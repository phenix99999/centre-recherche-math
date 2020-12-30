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
import { CustomPickerRow, DetachedCustomPickerRow } from "../components/CustomPicker";
import { Record, Client, Activite, Projet, Type_de_projet } from "../stores/FMObjectTypes";
import TimeStore from "../stores/TimeStore";
import { MainStackParamList } from "../types";

type Props = {
    timeStore: TimeStore;
} & StackScreenProps<MainStackParamList, "Main">;

const TempsDetails = ({ navigation, timeStore }: Props) => {
    const editionMode = timeStore.resources.heure.editionMode;
    const crud = timeStore.resources.heure;
    const record = crud.selectedRecord;
    const [showQuestion, setShowQuestion] = React.useState(0);

    React.useEffect(() => {
        timeStore.loadPickerData();
    }, []);

    const computeColor = (activite?: Record<Activite>) => {
        //rouge si
        //Activite::Heures_budget_auto  >  Activite::Heures_budget
        if (activite === undefined) return "green";
        return Number(activite.fields.Heures_budget_auto) >= Number(activite.fields.Heures_budget) ? "red" : "green";
    };

    const isProjectRunningBill = (projet?: Record<Projet>) => {
        if (projet === undefined) return false;
        const map: {
            [key in Type_de_projet]: boolean;
        } = {
            "Budget du total des budgets d'activités": true,
            "Budget du total du projet": true,
            "Budget par mois": false,
            "Pas de budget déterminé": false,
            "": false,
        };
        return map[projet.fields.Type_de_projet];
    };

    const selectedActivite = timeStore.resources.activite.records.find(
        (record) => Number(crud.shownValue("fk_activites")) === Number(record.fields.pk_ID)
    );

    const selectedProjet = timeStore.resources.projet.records.find(
        (record) => Number(crud.shownValue("fk_projet")) === Number(record.fields.pk_ID)
    );

    const color = computeColor(selectedActivite);

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
                <View style={styles.inputWrapper}>
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
                </View>
                <View style={styles.inputWrapper}>
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
                </View>

                <View style={styles.inputWrapper}>
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
                </View>

                <View style={styles.inputWrapper}>
                    <DetachedCustomPickerRow
                        values={["AM", "PM"]}
                        //label={(activite: Record<Activite>) => activite.fields.Nom}
                        selectedValue={crud.shownValue("AM_PM")}
                        onChange={(value) => {
                            //console.log("change", value);
                            crud.updateValue("AM_PM", value, true);
                            if (editionMode === "update") {
                                timeStore.fetchHeures();
                            }
                        }}
                        placeholder={"AM / PM "}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text>Description:</Text>
                    <Textarea
                        placeholder={"Écrivez la description ici"}
                        bordered
                        underline
                        style={styles.inputBorder}
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
                </View>
                <View style={styles.inputWrapper}>
                    <Text>Nombre d'heures planifiées:</Text>
                    <Input
                        style={styles.inputBorder}
                        placeholder={"Écrivez ici"}
                        value={crud.shownValue("Minutes_planifie")}
                        onChangeText={(text) => crud.updateValue("Minutes_planifie", text)}
                        keyboardType={"numeric"}
                        onBlur={() => {
                            if (editionMode == "update") {
                                crud.save();
                                timeStore.fetchHeures();
                            }
                        }}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text>Nombre d'heures réelles:</Text>
                    <Input
                        style={styles.inputBorder}
                        placeholder={"Écrivez ici"}
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
                </View>

                    
{/* 
                {isProjectRunningBill(selectedProjet) ? (
                    <View style={styles.inputWrapper}>
                        <Text>Nombre d'heures restantes pour accomplir la tâche:</Text>
                        <Input
                            style={styles.inputBorder}
                            placeholder={"Écrivez ici"}
                            value={crud.shownValue("Minutes_restantes")}
                            onChangeText={(text) => crud.updateValue("Minutes_restantes", text)}
                            keyboardType={"numeric"}
                            onBlur={() => {
                                if (editionMode == "update") {
                                    crud.save();
                                    timeStore.fetchHeures();
                                }
                            }}
                        />
                    </View>
                ) : null} */}

            <View style={styles.inputWrapper}>
                    <Text>Est-ce que ça complète la tâche?(Oui/Non)</Text>
                    <Input
                        style={styles.inputBorder}
                        placeholder={"Écrivez ici"}
                        value={crud.shownValue("Flag_termine")}
                        onChangeText={(text) => 
                            {
                                if(text.toLowerCase()=="oui"){
                                    crud.updateValue("Flag_termine", "1");
                                    setShowQuestion(0);
                                }else if(text.toLowerCase()=="non"){
                                    crud.updateValue("Flag_termine", "0");
                                    setShowQuestion(1);
                                } else{

                                    crud.updateValue("Flag_termine", text); 
                                }
    
                        }}
                        onBlur={() => {
                            if (editionMode == "update") {
                                crud.save();
                                timeStore.fetchHeures();
                            }
                        }}
                    />
                </View>
                

                {showQuestion == 1 ?  
                <View>
                                <View style={styles.inputWrapper}>
                                <Text>Combien d'heure de plus ça prendrait pour terminer la tâche? </Text>
                                <Input
                                    style={styles.inputBorder}
                                    placeholder={"Écrivez ici"}
                                    value={crud.shownValue("Minutes_restantes")}
                                    onChangeText={(text) => crud.updateValue("Minutes_restantes", text)}
                                    keyboardType={"numeric"}
                                    onBlur={() => {
                                        if (editionMode == "update") {
                                            crud.save();
                                            timeStore.fetchHeures();
                                        }
                                    }}
                                />
                            </View>
            
                            <View style={styles.inputWrapper}>
                                <Text>Brève description sur ce qui reste à accomplir :</Text>
                                <Textarea
                                    placeholder={"Écrivez la description ici"}
                                    bordered
                                    underline
                                    style={styles.inputBorder}
                                    rowSpan={5}
                                    value={crud.shownValue("Minutes_restantes_tache")}
                                    onChangeText={(text) => crud.updateValue("Minutes_restantes_tache", text)}
                                    onBlur={() => {
                                        if (editionMode == "update") {
                                            crud.save();
                                            timeStore.fetchHeures();
                                        }
                                    }}
                                />
                            </View>
                            </View>
                : null}
    

                {record !== undefined && editionMode === "update" ? (
                    <Button
                        danger
                        transparent
                        style={{ alignSelf: "center" }}
                        onPress={() => {
                            timeStore.delete(record);
                            navigation.goBack();
                        }}
                    >
                        <Text>Supprimer</Text>
                    </Button>
                ) : null}
            </Content>
        </Container>
    );
};
export default inject("timeStore")(observer(TempsDetails));

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    inputWrapper: {
        padding: 20,
    },
    inputBorder: {
        borderWidth: 1,
        borderColor: "black",
    },
});
