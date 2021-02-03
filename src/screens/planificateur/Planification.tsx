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
import ProgressCircle from 'react-native-progress-circle'

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

const TempsDetailsFilter = ({ route, navigation, timeStore }: Props) => {
    const [formatedActivities, setFormatedActivities] = React.useState<Object>([]);
    const [formatedProjects, setFormatedProjects] = React.useState<Object>([]);
    const [formatedClient, setFormatedClient] = React.useState<Object>([]);

    const [project, setProject] = React.useState<Number>(0);
    const [activity, setActivity] = React.useState<Number>(0);

    const [client, setClient] = React.useState<Number>(0);

    const [heureFacturable, setHeureFacturable] = React.useState<Number>(0);
    const [budject, setBudject] = React.useState<Number>(0);
    const [pasDeBudject, setPasDeBudject] = React.useState<Number>(0);



    if (!NetworkUtils.isNetworkAvailable()) {
        alert("Erreur de connexion.");
    }


    React.useEffect(() => {
        SyncStorage.remove('modeRemplir');

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
            setFormatedClient(await get(username, password, server, db, layoutClient, "&pk_ID=>0&-sortfield.1=Nom&-sortorder.1=ascend"));
        }
        setData(username, password, global.fmServer, global.fmDatabase, layoutClient, layoutProjet, layoutActivite);

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
                    <Text style={{ color: '#1f4598', fontWeight: 'bold' }}>Filtre</Text>
                </Body>
                <Right>
                    <Button
                        transparent
                        onPress={async () => {
                            SyncStorage.set('filterProject', project);
                            SyncStorage.set('filterActivity', activity);
                            navigation.goBack();

                        }}
                    >

                        {SyncStorage.get('filterProject') && SyncStorage.get('filterProject') > 0 || SyncStorage.get('filterActivity') && SyncStorage.get('filterActivity') > 0 ?
                            <Icon name="filter" type={"AntDesign"} style={{ fontSize: 30, marginLeft: 2, color: 'red' }} /> :
                            <Icon name="filter" type={"AntDesign"} style={{ fontSize: 30, marginLeft: 2, color: '#1f4598' }} />}
                    </Button>
                </Right>
            </Header>
            <View style={{ padding: 20 }}>
                <CustomPickerRow<Client>
                    records={formatedClient}
                    valueKey={"pk_ID"}
                    getLabel={(client: Record<Client>) => client.Nom}
                    selectedValue={client}
                    onChange={async (value) => {
                        let tempFormatedProjects = await get(SyncStorage.get('username'), SyncStorage.get('password'), global.fmServer, global.fmDatabase, "mobile_PROJETS2", "&fk_client=" + value + "&flag_actif=1" + "&-sortfield.1=Nom&-sortorder.1=ascend")
                        let budgetTemp = 0;
                        let pasDeBudget = false;

                        for (let i = 0; i < tempFormatedProjects.length; i++) {
                            if (tempFormatedProjects[i].Type_de_projet == "Pas de budget déterminé") {
                                pasDeBudget = true;
                            }
                            if (tempFormatedProjects[i].Heures_budget) {
                                budgetTemp += parseFloat(tempFormatedProjects[i].Heures_budget);
                            }

                        }
                        let tempFormatedActivities = [];

                        if (tempFormatedProjects.length == 1) {
                            tempFormatedActivities = await get(SyncStorage.get('username'), SyncStorage.get('password'), global.fmServer, global.fmDatabase, "mobile_ACTIVITES2", "&flag_actif=1&fk_projet=" + tempFormatedProjects[0].pk_ID + "&-sortfield.1=Nom&-sortorder.1=ascend");
                        }
                        console.log(tempFormatedActivities);
                        let heureFacturableTemp = 0;

                        for (let i = 0; i < tempFormatedActivities.length; i++) {
                            if (tempFormatedActivities[i].Heures_budget_auto) {
                                heureFacturableTemp += parseFloat(tempFormatedActivities[i].Heures_budget_auto);
                            }
                        }

                        if (pasDeBudget) {
                            heureFacturableTemp = budgetTemp;
                        }

                        setHeureFacturable(heureFacturableTemp);


                        setBudject(budgetTemp);
                        setPasDeBudject(pasDeBudget);

                        setFormatedProjects(tempFormatedProjects);
                        console.log(tempFormatedActivities);
                        setFormatedActivities(tempFormatedActivities);
                        setClient(Number(value));
                    }}
                    placeholder={"Client"}
                />
            </View>

            <View style={{ padding: 20 }}>
                <CustomPickerRow<Projet>
                    records={formatedProjects}
                    valueKey={"pk_ID"}
                    getLabel={(projet: Record<Projet>) => projet.Nom}
                    selectedValue={project}
                    onChange={async (value) => {
                        let tempFormatedProjects = await get(SyncStorage.get('username'), SyncStorage.get('password'), global.fmServer, global.fmDatabase, "mobile_PROJETS2", "&pk_ID=" + value + "&fk_client=" + client + "&flag_actif=1" + "&-sortfield.1=Nom&-sortorder.1=ascend")
                        let budgetTemp = 0;
                        let pasDeBudget = false;
                        for (let i = 0; i < tempFormatedProjects.length; i++) {
                            if (tempFormatedProjects[i].Type_de_projet == "Pas de budget déterminé") {

                                pasDeBudget = true;
                            }
                            if (tempFormatedProjects[i].Heures_budget) {
                                budgetTemp += parseFloat(tempFormatedProjects[i].Heures_budget);
                            }

                        }



                        let tempFormatedActivities = await get(SyncStorage.get('username'), SyncStorage.get('password'), global.fmServer, global.fmDatabase, "mobile_ACTIVITES2", "&fk_projet=" + value + "&fk_client=" + client + "&flag_actif=1" + "&-sortfield.1=Nom&-sortorder.1=ascend");
                        ;
                        let heureFacturableTemp = 0;

                        for (let i = 0; i < tempFormatedActivities.length; i++) {
                            if (tempFormatedActivities[i].Heures_budget_auto) {
                                heureFacturableTemp += parseFloat(tempFormatedActivities[i].Heures_budget_auto);
                            }
                        }

                        setHeureFacturable(heureFacturableTemp);
                        if (pasDeBudget) {
                            budgetTemp = heureFacturableTemp;
                        }
                        console.log("Formated activities " + tempFormatedActivities);
                        setBudject(budgetTemp);

                        setFormatedProjects(tempFormatedProjects);

                        setFormatedActivities(tempFormatedActivities); setProject(Number(value));
                    }}
                    placeholder={"Projet"}
                />
            </View>
            <View style={{ padding: 20 }}>
                <CustomPickerRow<Activite>
                    records={formatedActivities}
                    valueKey={"pk_ID"}
                    getLabel={(activite: Record<Activite>) => activite.Nom}
                    selectedValue={activity}
                    onChange={(value) => {
                        let projet;
                        for (let i = 0; i < formatedActivities.length; i++) {
                            if (formatedActivities[i].pk_ID == Number(value)) {
                                projet = (formatedActivities[i].fk_projet);
                                setHeureFacturable(formatedActivities[i].Heures_budget_auto);
                                setBudject(formatedActivities[i].Heures_budget);

                                setProject(Number(projet));
                            }
                        }
                        setActivity(Number(value));
                    }}
                    placeholder={"Activité"}
                />

            </View>

            <Button style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                    SyncStorage.set('filterClient', client);
                    SyncStorage.set('filterProject', project);
                    SyncStorage.set('filterActivity', activity);
                    SyncStorage.set('pasDeBudget', pasDeBudject);
                    SyncStorage.set('budject', budject)
                    SyncStorage.set('heureFacturable', heureFacturable);
                    SyncStorage.set('modeRemplir', true);
                    if (client && formatedProjects.length == 0) {
                        alert("Ce client n'a aucun projet actif.")
                    } else {
                        navigation.goBack();
                    }
                }
                }
            >
                <Text style={{ textAlign: 'center' }}>
                    Rechercher
                </Text>
            </Button>


            <Button style={{ width: '100%', top: '1%', justifyContent: 'center', backgroundColor: 'red' }}
                onPress={async () => {
                    SyncStorage.remove("filterProject");
                    SyncStorage.remove("filterActivity");
                    setProject("");
                    setActivity("");
                }}
            >
                <Text style={{ textAlign: 'center' }}>
                    Annuler les filtres
                </Text>
            </Button>
            {2 == 2 ?
                <ScrollView>
                    <View>


                        {formatedProjects.length == 1 && project == 0 && activity == 0 && client > 0 ?
                            <View>
                                <View style={{ flexDirection: 'row', padding: 20 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                                        Nombre d'heures complétés : {heureFacturable}/{budject}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 25 }}>
                                    <ProgressCircle
                                        percent={parseFloat(((heureFacturable / budject) * 100))}
                                        radius={50}
                                        borderWidth={8}
                                        color="#1f4598"
                                        shadowColor="#999"
                                        bgColor="#fff"
                                    >
                                        <Text style={{ fontSize: 18 }}>{((heureFacturable / budject)).toFixed(2) * 100}%</Text>
                                    </ProgressCircle>
                                </View>
                            </View>
                            :
                            null
                        }

                        {activity > 0 ?
                            <View>
                                <View style={{ flexDirection: 'row', padding: 20 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                                        Nombre d'heures complétés : {heureFacturable}/{budject}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', padding: 20 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                                        {pasDeBudject ?
                                            <Text> Nombre d'heures restantes : Pas de budget déterminé </Text>
                                            :
                                            <Text> Nombre d'heures restantes : {parseFloat(budject - heureFacturable)} </Text>
                                        }

                                    </Text>
                                </View>
                            </View>
                            :
                            null
                        }

                        {formatedProjects.length == 0 && client > 0 ?
                            <View style={{ flexDirection: 'row', padding: 20 }}>

                                <Text style={{ fontWeight: 'bold', color: 'red' }}>
                                    Ce client n'a aucun projet actif.
                            </Text>
                            </View>
                            :
                            null
                        }

                        {formatedProjects.length > 1 && client > 0 ?
                            <View style={{ flexDirection: 'row', padding: 20 }}>

                                <Text style={{ fontWeight: 'bold', color: 'red' }}>
                                    Ce client contient plusieurs projets veuillez sélectionner un projet pour obtenir les statistiques.
                            </Text>
                            </View>
                            :
                            null
                        }


                        {activity == 0 && project > 0 ?
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 25 }}>

                                <ProgressCircle
                                    percent={parseFloat(((heureFacturable / budject) * 100))}
                                    radius={50}
                                    borderWidth={8}
                                    color="#1f4598"
                                    shadowColor="#999"
                                    bgColor="#fff"
                                >
                                    <Text style={{ fontSize: 18 }}>{((heureFacturable / budject)).toFixed(2) * 100}%</Text>
                                </ProgressCircle>
                            </View>
                            :
                            null
                        }

                        {activity > 0 ?
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 25 }}>

                                <ProgressCircle
                                    percent={parseFloat(((heureFacturable / budject) * 100))}
                                    radius={50}
                                    borderWidth={8}
                                    color="#1f4598"
                                    shadowColor="#999"
                                    bgColor="#fff"
                                >
                                    <Text style={{ fontSize: 18 }}>{((heureFacturable / budject)).toFixed(2) * 100}%</Text>
                                </ProgressCircle>
                            </View>

                            :
                            null
                        }

                    </View>

                </ScrollView>
                :

                null}



        </Container>
    );
};
export default inject("timeStore")(observer(TempsDetailsFilter));

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
