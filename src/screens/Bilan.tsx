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


import { useIsFocused } from "@react-navigation/native";
import { Badge } from 'react-native-paper';
type Props = {
    timeStore: TimeStore;
} & StackScreenProps<MainStackParamList, "Main">;


const MainScreen = ({ navigation, timeStore }: Props) => {
    const [formatedDataEmploye, setFormatedDataEmploye] = React.useState<Object>([]);
    const [dataOnDateEmploye, setDataOnDateEmploye] = React.useState<Object>([]);

    const [formatedActivities, setFormatedActivities] = React.useState<Object>([]);
    const [formatedProjects, setFormatedProjects] = React.useState<Object>([]);
    const [project, setProject] = React.useState<Object>([]);
    const [activity, setActivity] = React.useState<Object>([]);

    const [dataOnDateClient, setDateOnDateClient] = React.useState<Object>([]);
    const [formatedDataClient, setFormatedDataClient] = React.useState<Object>([]);
    const [activitesList, setActivitesList] = React.useState<Object>([]);


    const [typeAccount, setTypeAccount] = React.useState<Number>();
    function getActivitiesNameWithPkId(pk_id) {
        for (let i = 0; i < activitesList.length; i++) {
            if (activitesList[i].pk_ID == pk_id) {
                return activitesList[i].Nom;
            }
        }
        return "";
    }
    function selectDate(date) {
        let dateObj = new Date(date);
        let month = ("0" + parseInt(dateObj.getMonth() + 1)).slice(-2);

        let day = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();

        let dateStr = month + "/" + day + "/" + dateObj.getFullYear();

        // var formattedNumber = ("0" + myNumber).slice(-2);
        let dataOnDateTemp = [];
        let indexDataOnDate = 0;
        let formatedData = [];
        if (SyncStorage.get('typeAccount') == 1) {
            formatedData = formatedDataClient;
        } else {
            formatedData = formatedDataEmploye;
        }

        for (let i = 0; i < formatedData.length; i++) {

            if (formatedData[i].StartDate == dateStr) {

                dataOnDateTemp[indexDataOnDate] = formatedData[i];
                indexDataOnDate++;
            }
        }

        timeStore.selectDate(date)
        if (SyncStorage.get('typeAccount') == 1) {
            setDateOnDateClient(dataOnDateTemp);
        } else if (SyncStorage.get('typeAccount') == 0) {
            setDataOnDateEmploye(dataOnDateTemp);
        } else {
            setDataOnDateEmploye([]);
            setDateOnDateClient([]);
        }

    }


    async function getRefreshData() {

        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');


        let layoutTemps = "mobile_TEMPS2";

        let month = timeStore.activeMonth + 1;
        let year = timeStore.activeYear;
        let nbJourMois = (getDaysInMonth(timeStore.activeMonth, year).length);
        if (SyncStorage.get("typeAccount") == 1) {
            if (SyncStorage.get('filterProject') && SyncStorage.get('filterActivity')) {
                setFormatedDataClient(await get(username, password, global.fmServer, global.fmDatabase, layoutTemps
                    , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_projet=" + SyncStorage.get('filterProject') + "&fk_activites=" + SyncStorage.get('filterActivity') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year));
            } else if (SyncStorage.get('filterProject')) {
                setFormatedDataClient(await get(username, password, global.fmServer, global.fmDatabase, layoutTemps
                    , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_projet=" + SyncStorage.get('filterProject') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year));
            } else if (SyncStorage.get('filterActivity')) {
                setFormatedDataClient(await get(username, password, global.fmServer, global.fmDatabase, layoutTemps
                    , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_activites=" + SyncStorage.get('filterActivity') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year));
            } else {
                setFormatedDataClient(await get(username, password, global.fmServer, global.fmDatabase, layoutTemps
                    , "&fk_client=" + SyncStorage.get('client_PK') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year));
            }
        } else {
            let fk_assignation = -1;
            if (SyncStorage.get('user'.pk_ID)) {
                fk_assignation = SyncStorage.get('user').pk_ID;
            }


            setFormatedDataEmploye(await get(username, password, global.fmServer, global.fmDatabase, layoutTemps
                , "&fk_assignation=" + fk_assignation + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year));
        }


    }
    const isFocused = useIsFocused();

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
            setFormatedProjects(await get(username, password, server, db, layoutProjet, "&fk_client=" + SyncStorage.get('client_PK')));
            setFormatedActivities(await get(username, password, server, db, layoutActivite, "&fk_client=" + SyncStorage.get('client_PK')));
        };


        setData(username, password, global.fmServer, global.fmDatabase, layoutClient, layoutProjet, layoutActivite);

    }, []);

    let notEmptyDates;

    notEmptyDates = getNotEmptyDates(formatedDataClient, "StartDate");



    let render;

    if (SyncStorage.get('typeAccount') == null) {

        render = null;
    } else {

        // alert(SyncStorage.get('filterActivity') > 0);
        let rightHeader = <View style={{ flexDirection: 'row' }}>

            <Button
                transparent
                onPress={async () => {
                    navigation.navigate('TempsDetailsFilter', { from: 'Main' });

                }}
            >

                {SyncStorage.get('filterProject') && SyncStorage.get('filterProject') > 0 || SyncStorage.get('filterActivity') && SyncStorage.get('filterActivity') > 0 ?
                    <Icon name="filter" type={"AntDesign"} style={{ fontSize: 30, marginRight: 0, color: 'red' }} >

                    </Icon>
                    :
                    <Icon name="filter" type={"AntDesign"} style={{ fontSize: 30, marginRight: 0, color: '#1f4598' }} >

                    </Icon>
                }
            </Button>
        </View>;

        if (SyncStorage.get('typeAccount') == 0) {
            rightHeader = <View style={{ flexDirection: 'row' }}>
                <Button
                    transparent
                    onPress={async () => {
                        navigation.openDrawer();

                    }}
                >
                    <Icon name="menu" type={"MaterialIcons"} style={{ fontSize: 30, color: '#1f4598' }} />
                </Button>

            </View>
        }

        render = (
            <Container style={{ flex: 1 }}>
                <Header>
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
                    <Right>
                        {rightHeader}

                    </Right>

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
                                }
                            }

                            setActivity(Number(value));
                        }}
                        placeholder={"Activités"}
                    />

                </View>

            </Container>
        );
    }
    return (
        render
    );

};
export default inject("timeStore")(observer(MainScreen));

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
