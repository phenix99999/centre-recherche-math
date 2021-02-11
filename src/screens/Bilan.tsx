import { StackScreenProps } from "@react-navigation/stack";
import { DrawerActions } from "@react-navigation/core";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { RefreshControl, StyleSheet, View } from "react-native";
import TimeStore from "../stores/TimeStore";
import { MainStackParamList } from "../types";
import DateSlider from "../components/DateSlider";
import { ScrollView, TouchableOpacity } from "react-native";
import { Container, Header, Button, Left, Icon, Text, Right, Body } from "native-base";
import { setNavigationState } from "../utils/PersistState";
import { dateToFrench, getNotEmptyDates, getDaysInMonth } from "../utils/date";
import { get, add } from '../utils/connectorFileMaker';
import SyncStorage from 'sync-storage';
import { setReactionScheduler } from "mobx/lib/internal";
import { CustomPickerRow, DetachedCustomPickerRow } from "../components/CustomPicker";
import ProgressCircle from 'react-native-progress-circle'


import { useIsFocused } from "@react-navigation/native";
import { Badge } from 'react-native-paper';
type Props = {
    timeStore: TimeStore;
} & StackScreenProps<MainStackParamList, "Main">;


const Bilan = ({ navigation, timeStore }: Props) => {
    const [formatedDataEmploye, setFormatedDataEmploye] = React.useState<Object>([]);
    const [dataOnDateEmploye, setDataOnDateEmploye] = React.useState<Object>([]);

    const [formatedActivities, setFormatedActivities] = React.useState<Object>([]);
    const [formatedProjects, setFormatedProjects] = React.useState<Object>([]);
    const [project, setProject] = React.useState<Object>([]);
    const [budject, setBudject] = React.useState<Number>(0);
    const [heureFacturable, setHeureFacturable] = React.useState<Number>(0);
    const [heureRestante, setHeureRestante] = React.useState<Number>(0);
    const [activity, setActivity] = React.useState<Object>([]);

    const [dataOnDateClient, setDateOnDateClient] = React.useState<Object>([]);
    const [formatedDataClient, setFormatedDataClient] = React.useState<Object>([]);
    const [activitesList, setActivitesList] = React.useState<Object>([]);


    const [typeAccount, setTypeAccount] = React.useState<Number>();
    async function getNombreHeuresCompleterActivite(activite) {
        let temps = await get(SyncStorage.get('username'), SyncStorage.get('password'), global.fmServer, global.fmDatabase, "mobile_TEMPS2"
            , "&fk_client=" + SyncStorage.get('client_PK') + "&Flag_facturable=" + 1 + "&flag_actif=1&fk_activites=" + activite);
        let heuresTotal = 0;
        for (let i = 0; i < temps.length; i++) {
            heuresTotal = parseFloat(heuresTotal) + parseFloat(temps[i].Minutes);
        }
        setHeureFacturable(heuresTotal);
        return heuresTotal;
    }



    async function getNombreHeuresCompleterProjet(projet) {
        let heuresTotal = 0;
        let budjectTotale = 0;

        for (let i = 0; i < formatedActivities.length; i++) {
            heuresTotal = parseFloat(heuresTotal) + parseFloat(await getNombreHeuresCompleterActivite(formatedActivities[i].pk_ID));
        }



        setBudject(getBudjectForProject());
        setHeureFacturable(heuresTotal);
    }

    function getBudjectForProject() {
        let budjectTotale = 0;
        for (let i = 0; i < formatedActivities.length; i++) {
            budjectTotale = parseFloat(budjectTotale) + parseFloat(formatedActivities[i].Heures_budget);
        }
        return budjectTotale;
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

        const setData = async (username, password, server, db, layoutClient, layoutProjet, layoutActivite) => {
            // setFormatedClients(await get(username, password, server, db, layoutClient));
            setFormatedProjects(await get(username, password, global.fmServer, global.fmDatabase, layoutProjet, "&flag_actif=1&fk_client=" + SyncStorage.get('client_PK') + "&-sortfield.1=Nom&-sortorder.1=ascend"));
            setFormatedActivities(await get(username, password, global.fmServer, global.fmDatabase, layoutActivite, "&flag_actif=1&fk_client=" + SyncStorage.get('client_PK') + "&-sortfield.1=Nom&-sortorder.1=ascend"));
        };


        setData(username, password, global.fmServer, global.fmDatabase, layoutClient, layoutProjet, layoutActivite);

    }, []);


    let render;

    if (SyncStorage.get('typeAccount') == null) {

        render = null;
    } else {

        // alert(SyncStorage.get('filterActivity') > 0);

        render = (
            <Container style={{ flex: 1 }}>
                <Header
                    style={Platform.OS != 'ios' ? { backgroundColor: 'transparent', height: 80, justifyContent: 'center' } : { backgroundColor: 'transparent' }}
                >
                    <Left>
                        <Button
                            transparent
                            onPress={async () => {
                                navigation.openDrawer();

                            }}
                        >
                            <Icon name="menu" type={"MaterialIcons"} style={{ fontSize: 30, color: '#1f4598' }} />
                        </Button>

                    </Left>

                </Header>

                <View style={{ padding: 20 }}>
                    <CustomPickerRow<Projet>
                        records={formatedProjects}
                        valueKey={"pk_ID"}
                        getLabel={(projet: Record<Projet>) => projet.Nom}
                        selectedValue={project}
                        onChange={async (value) => {
                            setFormatedActivities(await get(SyncStorage.get('username'), SyncStorage.get('password'), global.fmServer, global.fmDatabase, "mobile_ACTIVITES2", "&fk_client=" + SyncStorage.get('client_PK') + "&fk_projet=" + value));
                            setProject(Number(value));

                            getNombreHeuresCompleterProjet(value);
                        }}
                        placeholder={"Projets"}
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
                                    setProject(Number(projet));
                                    setBudject(formatedActivities[i].Heures_budget)
                                }
                            }
                            setActivity(Number(value));

                            getNombreHeuresCompleterActivite(value);


                        }}
                        placeholder={"Activités"}
                    />
                </View>

                {activity != "" || project != "" ?
                    <View style={{ padding: 20 }}>

                        <View style={{ flexDirection: 'row', marginTop: 25 }}>
                            <Text>
                                Nombre d'heures restantes : {budject - heureFacturable}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Text>
                                Nombre d'heures complétés : {heureFacturable} / {budject}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Text>
                                Nombre d'heures facturables : {heureFacturable}
                            </Text>
                        </View>


                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 25 }}>
                            <ProgressCircle
                                percent={((heureFacturable / budject) * 100)}
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


            </Container>
        );
    }
    return (
        render
    );

};
export default inject("timeStore")(observer(Bilan));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        flexDirection: "column",
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
    },

    subtitle: {
        fontSize: 14,
        color: "blue",
    },

    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },

    item: {
        backgroundColor: "rgb(240, 240, 240)",
        marginVertical: 8,
        padding: 10,
        margin: 20,
    },
    noItemText: {
        margin: 20,
        textAlign: "center",
    },
    scrollview: {
        flexGrow: 1,
        flex: 1,
    },
});
