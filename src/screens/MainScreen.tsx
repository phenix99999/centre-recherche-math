import { StackScreenProps } from "@react-navigation/stack";
import { DrawerActions } from "@react-navigation/core";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { RefreshControl, StyleSheet, View } from "react-native";
import TimeStore from "../stores/TimeStore";
import { MainStackParamList } from "../types";
import DateSlider from "../components/DateSlider";
import { ScrollView, TouchableOpacity } from "react-native";
import { Container, Header, Button, Left, Icon, Text } from "native-base";
import { setNavigationState } from "../utils/PersistState";
import { dateToFrench, getNotEmptyDates, getDaysInMonth } from "../utils/date";
import { get, add } from '../utils/connectorFileMaker';
import SyncStorage from 'sync-storage';
import { setReactionScheduler } from "mobx/lib/internal";

type Props = {
    timeStore: TimeStore;
} & StackScreenProps<MainStackParamList, "Main">;


const MainScreen = ({ navigation, timeStore }: Props) => {
    const [formatedData, setFormatedData] = React.useState<Object>([]);
    const [formatedProjectData, setFormatedProjectData] = React.useState<Object>([]);
    const [notEmptyDate, setNotEmptyDate] = React.useState<Object>([]);
    const [dataOnDate, setDataOnDate] = React.useState<Object>([]);



    function selectDate(date) {
        let dateObj = new Date(date);
        let month = ("0" + parseInt(dateObj.getMonth() + 1)).slice(-2);

        let day = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();

        let dateStr = month + "/" + day + "/" + dateObj.getFullYear();

        // var formattedNumber = ("0" + myNumber).slice(-2);
        let dataOnDateTemp = [];
        let indexDataOnDate = 0;


        for (let i = 0; i < formatedData.length; i++) {

            if (formatedData[i].StartDate == dateStr) {

                dataOnDateTemp[indexDataOnDate] = formatedData[i];
                indexDataOnDate++;
            }
        }

        timeStore.selectDate(date)
        setDataOnDate(dataOnDateTemp);
    }


    async function getRefreshData() {
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
       
        let db = "vhmsoft";
        let layoutTemps = "mobile_TEMPS2";

        let month = timeStore.activeMonth + 1;
        let year = timeStore.activeYear;
        let nbJourMois = (getDaysInMonth(timeStore.activeMonth, year).length);
        let fk_assignation = SyncStorage.get('user').pk_ID;

        setFormatedData(await get(username, password,global.fmServer, db, layoutTemps
            , "&fk_assignation=" + fk_assignation + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year));

    }

    React.useEffect(() => {
        // timeStore.loadConfigData().then(() => timeStore.fetchHeures());
        const setData = async (username, password, server, db, month, year, nbJourMois) => {
            setFormatedData(await get(username, password, server, db, layoutTemps
                , "&fk_assignation=" + fk_assignation + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year));
        }

        const getDataOnDate = async (username, password, server, db, month, year, nbJourMois, dateSelected) => {
            setDataOnDate(await get(username, password, server, db, layoutTemps
                , "&fk_assignation=" + fk_assignation + "&flag_actif=1&StartDate=" + dateSelected.getMonth() + 1 + "/" + dateSelected.getDate() + "/" + dateSelected.getFullYear()));
        }



        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
    
        let db = "vhmsoft";
        let layoutTemps = "mobile_TEMPS2";
        selectDate(timeStore.selectedDate);
        let month = timeStore.activeMonth + 1;
        let year = timeStore.activeYear;
        let nbJourMois = (getDaysInMonth(timeStore.activeMonth, year).length);

        let fk_assignation = SyncStorage.get('user').pk_ID;



        getDataOnDate(username, password,  global.fmServer, db, month, year, nbJourMois, timeStore.selectedDate);

        setData(username, password,  global.fmServer, db, month, year, nbJourMois, timeStore);

    }, []);
  
    let notEmptyDates = getNotEmptyDates(formatedData, "StartDate");

    return (
        <Container style={{ flex: 1 }}>
            <Header>
                <Left>
                    <Button
                        transparent
                        onPress={() => {
                            navigation.navigate("Logout");
                            setNavigationState("Logout");
                        }}
                    >
                        <Icon name="logout" type={"AntDesign"} style={{ fontSize: 14, marginLeft: 2 }} />
                        <Text style={{ fontSize: 14 }}>Déconnexion</Text>
                    </Button>
                </Left>
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
                    <Text style={{ fontWeight: "bold" }}>{dateToFrench(timeStore.selectedDate)}</Text>
                </View>
                <View style={{ height: 50, flex: 1, justifyContent: "center" }}>
                    <Button
                        style={{ alignSelf: "flex-end" }}
                        transparent
                        onPress={() => {
                            // crud.updateEditionMode("create");
                            navigation.replace("TempsDetails",{editionMode: 'create'});
                        }}
                    >
                        <Text>+ Nouvelle entrée</Text>
                    </Button>
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
                {dataOnDate.length === 0 ? (
                    <Text style={styles.noItemText}>Aucune entrée de temps ne correspond à la date sélectionnée</Text>
                ) : (
                        dataOnDate.map((record) => (
                            <TouchableOpacity
                                onPress={() => {
                                    // crud.updateEditionMode("update");

                                    navigation.navigate("TempsDetails", { pk_ID: record.pk_ID,editionMode: "update"});
                                }}
                                style={styles.item}
                                key={record.pk_ID}
                            >
                                <Text>{record.AM_PM}</Text>
                                <Text>{record.Nom_projet}</Text>
                                <Text>{record.Minutes} h</Text>
                            </TouchableOpacity>
                        ))
                    )}
            </ScrollView>
        </Container>
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
