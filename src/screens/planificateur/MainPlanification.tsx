import { StackScreenProps } from "@react-navigation/stack";
import { DrawerActions } from "@react-navigation/core";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { RefreshControl, StyleSheet, View, FlatList } from "react-native";
import TimeStore from "../../stores/TimeStore";
import { MainStackParamList } from "../types";
import DateSlider from "../../components/DateSlider";
import { ScrollView, TouchableOpacity } from "react-native";
import { Container, Header, Button, Left, Icon, Text, Right, Body } from "native-base";
import { setNavigationState } from "../../utils/PersistState";
import { dateToFrench, getNotEmptyDates, getDaysInMonth } from "../../utils/date";
import { get, add } from '../../utils/connectorFileMaker';
import SyncStorage from 'sync-storage';
import { setReactionScheduler } from "mobx/lib/internal";
import { useIsFocused } from "@react-navigation/native";
import NetworkUtils from '../../utils/NetworkUtils';

import { Badge } from 'react-native-paper';
type Props = {
    timeStore: TimeStore;
} & StackScreenProps<MainStackParamList, "Main">;


const MainPlanification = ({ navigation, timeStore }: Props) => {
    const [formatedDataEmploye, setFormatedDataEmploye] = React.useState<Object>([]);
    const [dataOnDateEmploye, setDataOnDateEmploye] = React.useState<Object>([]);

    const [dataOnDateClient, setDateOnDateClient] = React.useState<Object>([]);
    const [formatedDataClient, setFormatedDataClient] = React.useState<Object>([]);
    const [activitesList, setActivitesList] = React.useState<Object>([]);
    const [modeRemplir, setModeRemplir] = React.useState<Boolean>(false);
    const [employeList, setEmployeList] = React.useState<Object>([]);
    const [typeAccount, setTypeAccount] = React.useState<Number>();

    if (!NetworkUtils.isNetworkAvailable()) {
        alert("Erreur de connexion.");
    }

    function getActivitiesNameWithPkId(pk_id) {
        for (let i = 0; i < activitesList.length; i++) {
            if (activitesList[i].pk_ID == pk_id) {
                return activitesList[i].Nom;
            }
        }
        return "";
    }
    function findIndexOfEmployePk_ID(pk_ID) {
        for (let i = 0; i < employeList.length; i++) {
            if (employeList[i].pk_ID == pk_ID) {
                return i;
            }
        }
        return 0;
    }

    async function selectDate(date) {
        let dateObj = new Date(date);
        let month = ("0" + parseInt(dateObj.getMonth() + 1)).slice(-2);

        let day = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();

        let dateStr = month + "/" + day + "/" + dateObj.getFullYear();

        // var formattedNumber = ("0" + myNumber).slice(-2);
        let dataOnDateTemp = [];
        let indexDataOnDate = 0;
        let formatedData = [];


        timeStore.selectDate(date)

        let feuilleTemps = await get(SyncStorage.get('username'), SyncStorage.get('password'), global.fmServer, global.fmDatabase, "mobile_TEMPS2"
            , "&flag_actif=1&StartDate=" + month + "/" + date.getDate() + "/" + date.getFullYear())

        let dispoArray = [];
        //array == ["LyesTamazouzt"] => dispoAm : false, dispoPm:true 


        //Creer le dispo array
        let finalDispoArray = [];
        for (let i = 0; i < employeList.length; i++) {
            // dispoArray[employeList[i].pk_ID.toString()] = {};
            employeList[i] = { ...employeList[i], AM: false, PM: false };
        }



        for (let i = 0; i < feuilleTemps.length; i++) {
            if (feuilleTemps[i].AM_PM == "AM") {
                employeList[findIndexOfEmployePk_ID(feuilleTemps[i].fk_assignation)].AM = true;
            } else {
                employeList[findIndexOfEmployePk_ID(feuilleTemps[i].fk_assignation)].false = true;
            }
        }

        setEmployeList(employeList);

    }


    async function getRefreshData() {

        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');


        let layoutTemps = "mobile_TEMPS2";

        let month = timeStore.activeMonth + 1;
        let year = timeStore.activeYear;
        let nbJourMois = (getDaysInMonth(timeStore.activeMonth, year).length);
        if (SyncStorage.get("typeAccount") == 1) {
            // alert("ICI");
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
            if (SyncStorage.get('user').pk_ID) {
                fk_assignation = SyncStorage.get('user').pk_ID;
            }

            setFormatedDataEmploye(await get(username, password, global.fmServer, global.fmDatabase, layoutTemps
                , "&fk_assignation=" + fk_assignation + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year));
        }


    }
    const renderItem = ({ item }) => {
        return (
            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, height: 60, borderColor: '#1f4598' }}>
                <View style={{ width: '50%' }}>
                    <Text>{item._C_nomComplet}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("SauvegarderPlanification", { nomComplet: item._C_nomComplet, pk_ID: item.pk_ID, periode: "AM" })

                }
                } style={{ width: '12%', backgroundColor: 'transparent' }}>
                    <Text style={{ color: item.AM ? "red" : "black" }}>{"AM"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '12%', backgroundColor: 'transparent' }}>
                    <Text style={{ color: item.PM ? "red" : "black" }}>{"PM"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '25%', backgroundColor: 'transparent' }}>
                    <Text style={{ color: item.AM && item.PM ? "red" : "black" }} >{"Journée"}</Text>
                </TouchableOpacity>
            </View>
        );
    }


    const isFocused = useIsFocused();

    React.useEffect(() => {
        if (SyncStorage.get('modeRemplir')) {
            setModeRemplir(true);
        }

        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
        let layoutAccount = "mobile_ACCOUNT2";
        const getListEmployes = async () => {
            let employes = (await get(username, password, global.fmServer, global.fmDatabase, layoutAccount, "&PrivilegeSet=0"));
            setEmployeList(employes);
        }

        getListEmployes();

    }, [isFocused]);
    let notEmptyDates;
    if (SyncStorage.get('typeAccount') == 1) {
        notEmptyDates = getNotEmptyDates(formatedDataClient, "StartDate");
    } else {
        notEmptyDates = getNotEmptyDates(formatedDataEmploye, "StartDate");
    }

    if (!NetworkUtils.isNetworkAvailable()) {
        alert("Erreur de connexion");
    }

    let render;

    if (SyncStorage.get('typeAccount') == null) {

        render = null;
    } else {

        // alert(SyncStorage.get('filterActivity') > 0);
        let rightHeader;
        rightHeader = <View style={{ flexDirection: 'row' }}>
            <Button
                transparent
                onPress={async () => {
                    navigation.openDrawer();

                }}
            >
                <Icon name="menu" type={"MaterialIcons"} style={{ fontSize: 30, color: '#1f4598' }} />
            </Button>

            <Button
                transparent
                onPress={async () => {
                    navigation.navigate('Planification');

                }}
            >
                <Icon name="plus" type={"AntDesign"} style={{ fontSize: 30, marginRight: 0, color: '#1f4598' }} >
                </Icon>
            </Button>
        </View>




        render = (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>

                        <View style={{ flexDirection: 'row' }}>

                            <Button
                                transparent
                                onPress={async () => {
                                    navigation.goBack();

                                }}
                            >
                                <Icon name="back" type="AntDesign" style={{ fontSize: 30, marginLeft: 2, color: '#1f4598' }} />
                            </Button>
                            <Button
                                transparent
                                onPress={async () => {
                                    navigation.goBack();

                                }}
                            >
                                {modeRemplir ?
                                    <View style={{ flexDirection: 'row' }}>

                                        <Icon name="clockcircle" type="AntDesign" style={{ fontSize: 30, marginLeft: 2, color: '#1f4598' }} />
                                        <View>
                                            <Text style={{ marginLeft: 5, color: 'black', fontSize: 15, fontWeight: 'bold' }}>
                                                {(SyncStorage.get('heureFacturable') + "/" + SyncStorage.get('budject'))}
                                            </Text>
                                            <Text style={{ marginLeft: 5, color: parseFloat(SyncStorage.get('budject') - SyncStorage.get('heureFacturable')) > 0 ? 'green' : 'red', fontSize: 15, fontWeight: 'bold' }}>
                                                Restant :  {parseFloat(SyncStorage.get('budject') - SyncStorage.get('heureFacturable'))}
                                            </Text>
                                        </View>

                                    </View>
                                    :

                                    null}


                            </Button>

                        </View>
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
                    {modeRemplir ?

                        <FlatList
                            data={employeList}
                            renderItem={renderItem}
                            keyExtractor={item => item.pk_ID}
                        />
                        :
                        null
                    }


                </ScrollView>
            </Container >
        );
    }
    return (
        render
    );

};
export default inject("timeStore")(observer(MainPlanification));

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
