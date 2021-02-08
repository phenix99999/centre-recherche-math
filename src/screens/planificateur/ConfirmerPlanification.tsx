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
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import SyncStorage from 'sync-storage';
import { dateToFrench, getNotEmptyDates, getDaysInMonth, dateToFMDate } from "../../utils/date";
import NetworkUtils from '../../utils/NetworkUtils';

import * as React from "react";
import { Alert, StyleSheet, unstable_batchedUpdates, View, ScrollView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { CustomPickerRow, DetachedCustomPickerRow } from "../../components/CustomPicker";
import { Record, Client, Activite, Projet, Type_de_projet } from "../../stores/FMObjectTypes";
import TimeStore from "../../stores/TimeStore";
import { MainStackParamList } from "../../types";
import CrudResource from "../../stores/FMMobxResource";
import { get, add, edit, execScript } from '../../utils/connectorFileMaker';
import { create } from "mobx-persist";
import { extendObservableObjectWithProperties } from "mobx/lib/internal";
type Props = {
    timeStore: TimeStore;
} & StackScreenProps<MainStackParamList, "Main">;

const ConfirmerPlanification = ({ route, navigation, timeStore }: Props) => {
    const [heure, setHeure] = React.useState<Number>(0);


    if (!NetworkUtils.isNetworkAvailable()) {
        alert("Erreur de connexion.");
    }

    async function addAndUpdateQuery(records) {

        let query = "";
        let layout = "mobile_TEMPS2";
        for (let i = 0; i < records.length; i++) {
            let username = SyncStorage.get('username');
            let password = SyncStorage.get('password');
            query = "&StartDate=" + records[i].StartDate + "&fk_assignation=" + records[i].fk_assignation + "&fk_client=" + records[i].fk_client + "&fk_projet=" + records[i].fk_projet
                + "&Minutes_planifie=" + records[i].Minutes_planifie + "&AM_PM=" + records[i].AM_PM + "&fk_activites=" + records[i].fk_activities + "&flag_actif=" + 1 + "&Taches=" + records[i].Taches;
            await add(username, password, global.fmServer, global.fmDatabase, layout, query);

        }


        // return "&StartDate=" + StartDate + "&fk_assignation=" + fk_assignation + "&fk_client=" + fk_client + "&fk_projet=" + fk_projet + "&Taches=" + tache + "&Flag_facturable=" + facturable + "&flag_R_et_D=" + rd
        //     + "&Minutes=" + Minutes + "&Minutes_planifie=" + Minutes_planifie + "&AM_PM=" + AM_PM + "&fk_activites=" + fk_activites + "&flag_actif=" + flag_actif + "&Description=" + Description + "&Flag_termine=" + Flag_termine + "&Minutes_restantes=" + Minutes_restantes + "&Minutes_restantes_tache=" + Minutes_restantes_tache;

    }


    React.useEffect(() => {
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
        let db = "vhmsoft";
        let layoutClient = "mobile_CLIENTS2";
        let layoutProjet = "mobile_PROJETS2";
        let layoutActivite = "mobile_ACTIVITES2";
        let layoutTemps = "mobile_TEMPS2";
        let layoutAccount = "mobile_ACCOUNT2";
        // if (SyncStorage.get('filterProject')) {
        //     setProject(SyncStorage.get('filterProject'));
        // }
        // if (SyncStorage.get('filterActivity')) {
        //     setActivity(SyncStorage.get('filterActivity'));

        // }

        const setData = async (username, password, server, db, layoutClient, layoutProjet, layoutActivite) => {
            // setFormatedClients(await get(username, password, server, db, layoutClient));
            if (SyncStorage.get('typeAccount') == "1") {
                setFormatedProjects(await get(username, password, server, db, layoutProjet, "&fk_client=" + SyncStorage.get('client_PK') + "&flag_actif=1" + "&-sortfield.1=Nom&-sortorder.1=ascend"));
                setFormatedActivities(await get(username, password, server, db, layoutActivite, "&fk_client=" + SyncStorage.get('client_PK') + "&flag_actif=1" + "&-sortfield.1=Nom&-sortorder.1=ascend"));
            } else {
                setFormatedProjects(await get(username, password, server, db, layoutProjet, "&flag_actif=1&-sortfield.1 = Nom & -sortorder.1 = ascend"));
                setFormatedActivities(await get(username, password, server, db, layoutActivite, "&flag_actif=1&-sortfield.1 = Nom & -sortorder.1 = ascend"));
            }

        };


        // setData(username, password, global.fmServer, global.fmDatabase, layoutClient, layoutProjet, layoutActivite);

    }, []);



    return (


        <Container>
            <Header>
                <Left>
                    <Button
                        onPress={() => {
                            navigation.goBack();
                        }}
                        transparent
                    >
                        <Icon name="back" type="AntDesign" style={{ fontSize: 30, marginLeft: 2, color: '#1f4598' }} >
                        </Icon>
                    </Button>

                </Left>

                <Body>
                    <Text style={{ color: '#1f4598', fontWeight: 'bold' }}>Confirmation planification</Text>
                </Body>
                <Right>


                </Right>
            </Header>


            <Content style={{ flex: 1, flexDirection: "column" }}>
                <ScrollView>

                    {SyncStorage.get('planification').map((planification) => (
                        <View>
                            <View style={styles.inputWrapper}>
                                <Text>Date: </Text>
                                <View style={{ marginLeft: 'auto' }}>
                                    <Text> {dateToFrench(new Date(planification.date))} </Text>
                                </View>
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text>Nom Employé assigné :  </Text>
                                <View style={{ marginLeft: 'auto' }}>
                                    <Text> {planification.nom} </Text>
                                </View>
                            </View>

                            <View style={{ padding: 30 }}>

                                <Text>Client :  </Text>
                                <View style={{ marginLeft: 'auto' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{planification.clientName} </Text>
                                </View>

                            </View>



                            <View style={{ padding: 30 }}>
                                <Text>Projet :  </Text>
                                <View style={{ marginLeft: 'auto' }}>
                                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{planification.projectName} </Text>
                                </View>

                            </View>

                            <View style={{ padding: 30 }}>
                                <Text>Activité :  </Text>
                                <View style={{ marginLeft: 'auto', }}>
                                    <Text numberOfLines={0.5} ellipsizeMode='tail' style={{ fontSize: 12, fontWeight: 'bold' }}>{planification.activityName} </Text>
                                </View>

                            </View>



                            <View style={{ flexDirection: 'row', padding: 20 }}>
                                <Text>Nb d'heure :</Text>
                                <View style={{ marginLeft: 'auto', }}>
                                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{planification.duree} </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', padding: 20 }}>
                                <Text>Tache</Text>
                                <View style={{ marginLeft: 'auto', }}>
                                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{planification.tache} </Text>
                                </View>
                            </View>
                            <View style={{ borderBottomWidth: 1, borderColor: 'black' }}>

                            </View>
                        </View>

                    ))
                    }
                </ScrollView>
            </Content>


            <Button style={{ width: '100%', justifyContent: 'center', backgroundColor: '#1f4598' }}
                onPress={async () => {

                    // console.log(SyncStorage.get('planification'));
                    // alert("a venir!")
                    let planification = SyncStorage.get('planification');
                    let StartDate = "";
                    let fk_assignation = "";
                    let fk_client = "";
                    let fk_projet = "";
                    let Minutes_planifie = "";
                    let AM_PM = "";
                    let fk_actif = 1;
                    //TACHE ?!
                    // let tache = "Programmation";
                    let records = [];
                    for (let i = 0; i < planification.length; i++) {
                        records[i] = {};
                        records[i].Taches = planification[i].tache;
                        records[i].StartDate = dateToFMDate(new Date(planification[i].date));
                        records[i].fk_assignation = planification[i].employerPkId;
                        records[i].fk_client = planification[i].client;
                        records[i].fk_projet = planification[i].projet;
                        records[i].fk_activities = planification[i].activity;
                        records[i].Minutes_planifie = planification[i].duree;
                        records[i].fk_actif = "1";
                        records[i].AM_PM = planification[i].periode;
                    }
                    // console.log(records);
                    await addAndUpdateQuery(records);
                    SyncStorage.remove('planification');
                    SyncStorage.remove('budject');
                    SyncStorage.remove('modeRemplir');

                    navigation.goBack();
                }}
            >

                <Text style={{ textAlign: 'center' }}>
                    Confirmer planification
                </Text>
            </Button>


            <Button style={{ width: '100%', justifyContent: 'center', marginTop: 25, backgroundColor: 'red' }}
                onPress={async () => {
                    SyncStorage.remove('planification');
                    navigation.goBack();
                }}
            >

                <Text style={{ textAlign: 'center' }}>
                    Annuler planification
                </Text>
            </Button>


        </Container>
    );
};
export default inject("timeStore")(observer(ConfirmerPlanification));

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    inputWrapper: {
        padding: 20,
        flexDirection: 'row'
    },
    inputBorder: {
        borderWidth: 1,
        borderColor: "black",
    },
});
