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
import { useIsFocused } from "@react-navigation/native";
import { Badge } from 'react-native-paper';
type Props = {
    timeStore: TimeStore;
} & StackScreenProps<MainStackParamList, "Main">;


const MainScreen = ({ navigation, timeStore }: Props) => {
    const [formatedDataEmploye, setFormatedDataEmploye] = React.useState<Object>([]);
    const [dataOnDateEmploye, setDataOnDateEmploye] = React.useState<Object>([]);

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

        const setDataEmploye = async (username, password, server, db, month, year, nbJourMois) => {
            setFormatedDataEmploye(await get(username, password, server, db, layoutTemps
                , "&fk_assignation=" + fk_assignation + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year));
        }



        const setDataClient = async (username, password, server, db, month, year, nbJourMois) => {
            if (SyncStorage.get('filterProject') && SyncStorage.get('filterActivity')) {
                setFormatedDataClient(await get(username, password, server, db, layoutTemps
                    , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_projet=" + SyncStorage.get('filterProject') + "&fk_activites=" + SyncStorage.get('filterActivity') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year));
            } else if (SyncStorage.get('filterProject')) {
                setFormatedDataClient(await get(username, password, server, db, layoutTemps
                    , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_projet=" + SyncStorage.get('filterProject') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year));
            } else if (SyncStorage.get('filterActivity')) {
                setFormatedDataClient(await get(username, password, server, db, layoutTemps
                    , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_activites=" + SyncStorage.get('filterActivity') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year));
            } else {
                setFormatedDataClient(await get(username, password, server, db, layoutTemps
                    , "&fk_client=" + SyncStorage.get('client_PK') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year));
            }

        }


        const getDataOnDateEmploye = async (username, password, server, db, month, year, nbJourMois, dateSelected) => {
            setDataOnDateEmploye(await get(username, password, server, db, layoutTemps
                , "&fk_assignation=" + fk_assignation + "&flag_actif=1&StartDate=" + dateSelected.getMonth() + 1 + "/" + dateSelected.getDate() + "/" + dateSelected.getFullYear()));
        }

        const getDataOnDateClient = async (username, password, server, db, month, year, nbJourMois, dateSelected) => {
            if (SyncStorage.get('filterProject') && SyncStorage.get('filterActivity')) {
                setDateOnDateClient(await get(username, password, server, db, layoutTemps
                    , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_projet=" + SyncStorage.get('filterProject') + "&fk_activites=" + SyncStorage.get('filterActivity') + "&flag_actif=1&StartDate=" + dateSelected.getMonth() + 1 + "/" + dateSelected.getDate() + "/" + dateSelected.getFullYear()));
            } else if (SyncStorage.get('filterProject')) {
                setDateOnDateClient(await get(username, password, server, db, layoutTemps
                    , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_projet=" + SyncStorage.get('filterProject') + "&flag_actif=1&StartDate=" + dateSelected.getMonth() + 1 + "/" + dateSelected.getDate() + "/" + dateSelected.getFullYear()));
            } else if (SyncStorage.get('filterActivity')) {
                setDateOnDateClient(await get(username, password, server, db, layoutTemps
                    , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_activites=" + SyncStorage.get('filterActivity') + "&flag_actif=1&StartDate=" + dateSelected.getMonth() + 1 + "/" + dateSelected.getDate() + "/" + dateSelected.getFullYear()));
            } else {
                setDateOnDateClient(await get(username, password, server, db, layoutTemps
                    , "&fk_client=" + SyncStorage.get('client_PK') + "&flag_actif=1&StartDate=" + dateSelected.getMonth() + 1 + "/" + dateSelected.getDate() + "/" + dateSelected.getFullYear()));
            }



        }

        const setListActivities = async () => {
            setActivitesList(await get(username, password, global.fmServer, global.fmDatabase, "mobile_ACTIVITES2"
                , "&fk_client=" + SyncStorage.get('client_PK')));

        }




        let typeAccount = (SyncStorage.get('typeAccount'));

        setTypeAccount(typeAccount);

        let fk_assignation = SyncStorage.get('user') ? SyncStorage.get('user').pk_ID : -1;
        let pkIdClient;
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
        let db = "vhmsoft";
        let layoutTemps = "mobile_TEMPS2";
        selectDate(timeStore.selectedDate);
        let month = timeStore.activeMonth + 1;
        let year = timeStore.activeYear;
        let nbJourMois = (getDaysInMonth(timeStore.activeMonth, year).length);
        if (typeAccount == 1) { //PrivilegeSet est la valeur qui determine le compte (1 ==> client //  le reste ==> employé)
            //pk_id du client 
            pkIdClient = SyncStorage.get('client_PK');
            getDataOnDateClient(username, password, global.fmServer, global.fmDatabase, month, year, nbJourMois, timeStore.selectedDate);
            setDataClient(username, password, global.fmServer, global.fmDatabase, month, year, nbJourMois, timeStore);
            setListActivities();

            // alert(SyncStorage.get('pk_ID'));
        } else {

            getDataOnDateEmploye(username, password, global.fmServer, global.fmDatabase, month, year, nbJourMois, timeStore.selectedDate);
            setDataEmploye(username, password, global.fmServer, global.fmDatabase, month, year, nbJourMois, timeStore);
        }


    }, [isFocused]);
    let notEmptyDates;
    if (SyncStorage.get('typeAccount') == 1) {
        notEmptyDates = getNotEmptyDates(formatedDataClient, "StartDate");
    } else {
        notEmptyDates = getNotEmptyDates(formatedDataEmploye, "StartDate");
    }


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

                <DateSlider
                    onViewUpdate={(date: { month: number; year: number }) => {
                        timeStore.setMonth(date.month);
                        timeStore.setYear(date.year);
                        getRefreshData();
                    }}
                    noEmptyDates={notEmptyDates}
                    month={timeStore.activeMonth}
                    year={timeStore.activeYear}
                    selected={timeStore.selectedDate}
                    onSelect={(date: Date) => selectDate(date)}
                />
                <View style={{ maxHeight: 40, flex: 1, flexDirection: "row", paddingLeft: 20 }}>
                    <View style={{ height: 50, flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontWeight: "bold", color: '#1f4598' }}>{dateToFrench(timeStore.selectedDate)}</Text>
                    </View>

                    {!typeAccount ?

                        <View style={{ height: 50, flex: 1, justifyContent: "center" }}>
                            <Button
                                style={{ alignSelf: "flex-end" }}
                                transparent
                                onPress={() => {
                                    // crud.updateEditionMode("create");
                                    navigation.replace("TempsDetails", { editionMode: 'create' });
                                }}
                            >
                                <Text style={{ color: '#1f4598' }}>+ Nouvelle entrée</Text>
                            </Button>
                        </View>
                        :

                        null}


                </View>
                <ScrollView
                    style={styles.scrollview}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {

                            }}
                        />
                    }
                >
                    {SyncStorage.get('typeAccount') == 0 && dataOnDateEmploye.length === 0 || (dataOnDateEmploye.length == undefined) ? (
                        <Text style={styles.noItemText}>Aucune entrée de temps ne correspond à la date sélectionnée</Text>
                    ) : null}


                    {SyncStorage.get('typeAccount') == 0 && dataOnDateEmploye.length > 0 ?
                        (
                            dataOnDateEmploye.map((record) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        // crud.updateEditionMode("update");
                                        // alert("YER LA");
                                        navigation.navigate("TempsDetails", { pk_ID: record.pk_ID, editionMode: "update" });
                                    }}
                                    style={styles.item}
                                    key={record.pk_ID}
                                >
                                    <Text>{record.AM_PM}</Text>
                                    <Text>{record.Nom_projet}</Text>
                                    <Text>{record.Minutes} h</Text>
                                </TouchableOpacity>
                            ))
                        )
                        :
                        null
                    }

                    {SyncStorage.get('typeAccount') == 1 && dataOnDateClient.length === 0 ? (
                        <Text style={styles.noItemText}>Aucune entrée de temps ne correspond à la date sélectionnée</Text>

                    ) : null}


                    {SyncStorage.get('typeAccount') == 1 && dataOnDateClient.length > 0 ? (

                        dataOnDateClient.map((record) => (
                            <TouchableOpacity
                                onPress={() => {
                                    // crud.updateEditionMode("update");

                                    navigation.navigate("TempsDetailsClient", { pk_ID: record.pk_ID, editionMode: "read", comeFrom: 'Main' });
                                }}
                                style={styles.item}
                                key={record.pk_ID}
                            >
                                <Text>{record.Nom_assignation}</Text>
                                <Text>{getActivitiesNameWithPkId(record.fk_activites)}</Text>
                                <Text>{record.Minutes} h</Text>

                            </TouchableOpacity>
                        ))
                    )
                        :

                        null

                    }

                </ScrollView>
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
