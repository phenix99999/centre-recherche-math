import { StackScreenProps } from "@react-navigation/stack";
import { DrawerActions } from "@react-navigation/core";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { RefreshControl, StyleSheet, View, NativeModules, Image, ImageBackground } from "react-native";
import TimeStore from "../stores/TimeStore";
import { MainStackParamList } from "../types";
import DateSlider from "../components/DateSlider";
import SyncStorage from 'sync-storage';
import { ScrollView, TouchableOpacity, FlatList } from "react-native";

import { get, add, edit } from '../utils/connectorFileMaker';
import { Container, Header, Button, Right, Left, Body, Icon, Text } from "native-base";
import { setNavigationState } from "../utils/PersistState";
import { dateToFrench, getDaysInMonth, getNotEmptyDates, dateToFMDate } from "../utils/date";
import { allowStateReadsStart } from "mobx/lib/internal";

type Props = {
    timeStore: TimeStore;
} & StackScreenProps<MainStackParamList, "Main">;

let timeStoreData;
let notEmptyDates = [];
let dateWeAre = "";
let role = SyncStorage.get("account");

const Seance = ({ pk_ID, startDate, nomAssignation, nomActivite, duree, nomProjet, navigation }) => (

    <TouchableOpacity
        style={styles.item}
        onPress={() => {
            // test();
            navigation.navigate("TempsDetailsClient", { pk_ID: pk_ID, editionMode: "read", comeFrom: 'CalendrierModeList' });

        }}
    >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>{nomProjet}</Text>



        <View style={{ flexDirection: 'row', padding: 2 }}>
            <Text style={{ color: '#808080', fontWeight: 'bold' }}>Nom : <Text style={{ color: '#808080', fontWeight: 'normal' }}>{nomAssignation}</Text></Text>
        </View>

        <View style={{ flexDirection: 'row', padding: 2 }}>
            <Text style={{ color: '#808080', fontWeight: 'bold' }}>Activités : <Text style={{ color: '#808080', fontWeight: 'normal' }}>{nomActivite} h</Text></Text>
        </View>


        <View style={{ flexDirection: 'row', padding: 2 }}>
            <Text style={{ color: '#808080', fontWeight: 'bold' }}>Durée : <Text style={{ color: '#808080', fontWeight: 'normal' }}>{duree} h</Text></Text>
        </View>
    </TouchableOpacity>
);

function findIndexOfClientsArray(clientsArray, id) {
    let index = 0;
    for (index = 0; index < clientsArray.length; index++) {
        if (clientsArray[index].pk_ID == id) {
            return index;
        }
    }

    if (index) {
        index = index - 1;
    }
    return index;
}



function convertFMDateToReactDate() {
    let dateConverted = [];
    let dateTemp;
    let dayTemp;
    let monthTemp;
    let yearTemp;
    let dateNextTemp = [];
    for (let i = 0; i < timeStoreData.notEmptyDates.length; i++) {
        dateTemp = timeStoreData.notEmptyDates[i];
        yearTemp = dateTemp.getFullYear();
        monthTemp = dateTemp.getMonth() + 1;
        dayTemp = dateTemp.getDate();

        if (dayTemp < 10) {
            dayTemp = "0" + dayTemp;
        }

        dateNextTemp[i] = monthTemp + "/" + dayTemp + "/" + yearTemp;
    }
    return dateNextTemp;
}

const renderItem = ({ item }) => {


    let showHeader = false;
    let dateItem = item.startDate;

    let notEmptyDateFM = [];
    for (let i = 0; i < notEmptyDates.length; i++) {
        notEmptyDateFM[i] = dateToFMDate(new Date(notEmptyDates[i]));
    }

    if (dateWeAre.length == 0) {
        dateWeAre = notEmptyDateFM[0];
        showHeader = true;
    } else if (dateWeAre == dateItem && showHeader == false) {
        showHeader = false;
    } else {
        for (let i = 0; i < notEmptyDateFM.length; i++) {
            if (notEmptyDateFM[i] == dateItem) {
                dateWeAre = dateItem;
            }
        }
        showHeader = true;
    }

    let dateStr = "";
    let dateObj = new Date(item.startDate);

    return (
        <View>

            {showHeader ? <View style={{ flexDirection: 'row', alignSelf: 'center', borderTopColor: 'black' }}><Text style={{ "fontWeight": 'bold', color: 'black', fontSize: 17 }}> {dateToFrench(new Date(item.startDate))}</Text></View> : null}
            <Seance pk_ID={item.pk_ID || ""} startDate={item.startDate} nomAssignation={item.nomAssignation} nomActivite={item.nomActivite} duree={item.duree} nomProjet={item.nomProjet} navigation={item.navigation}
            >
            </Seance>
        </View>
    );
}


const CalendarModeList = ({ navigation, timeStore }: Props) => {
    const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
    const [formatedData, setFormatedData] = React.useState<Object>([]);
    const [activitesList, setActivitesList] = React.useState<Object>([]);


    let username = SyncStorage.get('username');
    let password = SyncStorage.get('password');

    let db = "vhmsoft";
    let layoutTemps = "mobile_TEMPS2";

    let month = timeStore.activeMonth + 1;
    let year = timeStore.activeYear;
    let nbJourMois = (getDaysInMonth(timeStore.activeMonth, year).length);

    let fk_assignation = SyncStorage.get('user').pk_ID;


    React.useEffect(() => {
        // alert("set effect");
        const setData = async (username, password, server, db, month, year, nbJourMois, query) => {
            setFormatedData(await get(username, password, server, db, layoutTemps
                , query));
        }
        if (SyncStorage.get('filterProject') && SyncStorage.get('filterActivity')) {
            setData(username, password, global.fmServer, global.fmDatabase, month, year, nbJourMois
                , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_projet=" + SyncStorage.get('filterProject') + "&fk_activites=" + SyncStorage.get('filterActivity') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year
                + "&-sortfield.1=StartDate&-sortorder.1=descend"
            );
        } else if (SyncStorage.get('filterProject')) {
            setData(username, password, global.fmServer, global.fmDatabase, month, year, nbJourMois
                , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_projet=" + SyncStorage.get('filterProject') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year
                + "&-sortfield.1=StartDate&-sortorder.1=descend"
            );

        } else if (SyncStorage.get('filterActivity')) {
            setData(username, password, global.fmServer, global.fmDatabase, month, year, nbJourMois
                , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_activites=" + SyncStorage.get('filterActivity') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year
                + "&-sortfield.1=StartDate&-sortorder.1=descend"
            );

        } else {
            setData(username, password, global.fmServer, global.fmDatabase, month, year, nbJourMois,
                "&fk_client=" + SyncStorage.get('client_PK') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year + "&-sortfield.1=StartDate&-sortorder.1=descend"
            );
        }
        const setListActivities = async () => {
            setActivitesList(await get(username, password, global.fmServer, global.fmDatabase, "mobile_ACTIVITES2"
                , "&fk_client=" + SyncStorage.get('client_PK')));

        }
        setListActivities();

    }, []);

    function getActivitiesNameWithPkId(pk_id) {
        for (let i = 0; i < activitesList.length; i++) {
            if (activitesList[i].pk_ID == pk_id) {
                return activitesList[i].Nom;
            }
        }
        return "";
    }

    async function getRefreshData() {
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');


        let layoutTemps = "mobile_TEMPS2";

        let month = timeStore.activeMonth + 1;
        let year = timeStore.activeYear;
        let nbJourMois = (getDaysInMonth(timeStore.activeMonth, year).length);
        let fk_assignation = SyncStorage.get('user').pk_ID;


        if (SyncStorage.get('filterProject') && SyncStorage.get('filterActivity')) {
            setFormatedData(await get(username, password, global.fmServer, global.fmDatabase, layoutTemps
                , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_projet=" + SyncStorage.get('filterProject') + "&fk_activites=" + SyncStorage.get('filterActivity') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year
                + "&-sortfield.1=StartDate&-sortorder.1=descend"
            ));
        } else if (SyncStorage.get('filterProject')) {
            setFormatedData(await get(username, password, global.fmServer, global.fmDatabase, layoutTemps
                , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_projet=" + SyncStorage.get('filterProject') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year
                + "&-sortfield.1=StartDate&-sortorder.1=descend"
            ));

        } else if (SyncStorage.get('filterActivity')) {
            setFormatedData(await get(username, password, global.fmServer, global.fmDatabase, layoutTemps
                , "&fk_client=" + SyncStorage.get('client_PK') + "&fk_activites=" + SyncStorage.get('filterActivity') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year
                + "&-sortfield.1=StartDate&-sortorder.1=descend"
            ));

        } else {
            setFormatedData(await get(username, password, global.fmServer, global.fmDatabase, layoutTemps,
                "&fk_client=" + SyncStorage.get('client_PK') + "&flag_actif=1&StartDate=" + month + "/1/" + year + "..." + month + "/" + nbJourMois + "/" + year + "&-sortfield.1=StartDate&-sortorder.1=descend"
            ));
        }



    }


    function changeMonth(increment) {
        let newMonth = (timeStore.activeMonth + increment);

        const newYear = newMonth >= 0 && newMonth <= 11 ? timeStore.activeYear : timeStore.activeYear + increment;
        if (newMonth == -1) {
            newMonth = 11;
        }

        if (newMonth == 12) {
            newMonth = 0;
        }

        timeStore.setMonth(newMonth);
        timeStore.setYear(newYear);

        getRefreshData();
    }



    timeStoreData = timeStore;
    notEmptyDates = getNotEmptyDates(formatedData, "StartDate");

    let record = [];
    let data = [];

    for (let i = 0; i < formatedData.length; i++) {
        record = formatedData[i];
        data[i] = {};
        data[i].pk_ID = record['pk_ID'];
        data[i].nomActivite = getActivitiesNameWithPkId(record['fk_activites']);
        data[i].nomAssignation = record['Nom_assignation'];
        data[i].duree = record['Minutes'];
        data[i].nomProjet = record['Nom_projet'];
        data[i].startDate = record['StartDate'];
        data[i].nomRdv = record['Nom_incertitude_contexte'];
        data[i].navigation = navigation;

    }

    // Pour trier date
    // data.sort(function (a, b) {
    //     var keyA = new Date(a.startDate),
    //         keyB = new Date(b.startDate);
    //     // Compare the 2 dates
    //     if (keyA < keyB) return -1;
    //     if (keyA > keyB) return 1;
    //     return 0;
    // });

    function showMonth(month) {

        // alert("month" + month);

        switch (month) {
            case 0:
                return "Janvier";
                break;
            case 1:
                return "Février";
                break;
            case 2:
                return "Mars";
                break;

            case 3:
                return "Avril";
                break;
            case 4:
                return "Mai";
                break;

            case 5:
                return "Juin";
                break;
            case 6:
                return "Juillet";
                break;

            case 7:
                return "Août";
                break;
            case 8:
                return "Septembre";
                break;

            case 9:
                return "Octobre";
                break;
            case 10:
                return "Novembre";
                break;

            case 11:
                return "Décembre";
                break;
        }
    }

    function getMonthAndYear() {
        return showMonth(timeStore.activeMonth) + " " + timeStore.activeYear;
    }

    return (

        <View style={styles.container}


        >
            <Header>
                <Left>
                    <Button
                        transparent
                        onPress={async () => {
                            navigation.goBack();

                        }}
                    >
                        <Icon name="back" type="AntDesign" style={{ fontSize: 30, marginLeft: 2, color: '#1f4598' }} />
                    </Button>

                </Left>
                <Right>
                    <View style={{ flexDirection: 'row' }}>
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
                                navigation.navigate('TempsDetailsFilter', { from: 'CalendrierModeList' });

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
                    </View>

                </Right>


            </Header>


            <View style={styles.monthRow}>
                <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthButton}>
                    <Icon name="arrow-back" style={[styles.monthButtonText, { paddingRight: 10, color: "#1f4598" }]}></Icon>
                </TouchableOpacity>

                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.currentMonth, { color: '#1f4598' }]}>{getMonthAndYear()}</Text>
                </View>

                <TouchableOpacity onPress={() => changeMonth(1)} style={{ marginLeft: 'auto' }}>

                    <Icon name="arrow-forward" style={[styles.monthButtonText, { paddingLeft: 10, color: '#1f4598' }]}></Icon>
                </TouchableOpacity>
            </View>

            {data.length > 0 ?


                <FlatList
                    data={data}

                    renderItem={renderItem}
                    keyExtractor={item => item.pk_ID}
                />
                :
                <View style={{ padding: 10 }}>

                    <Text style={{ color: "#1f4598", fontSize: 16 }}>
                        Vous n'avez rien de planifié pour le mois de {showMonth(timeStore.activeMonth) + " " + timeStore.activeYear}.
            </Text>

                </View>

            }
        </View>
    );
};
export default inject("timeStore")(observer(CalendarModeList));

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        backgroundColor: "white",
        marginVertical: 8,
        borderBottomColor: 'black',


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
    baseCell: {
        justifyContent: "center", //Centered vertically
        alignItems: "center", // Centered horizontally
        flex: 1,
        padding: 3,
    },
    weekDay: {
        flex: 1,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 10,
    },
    cellWeekday: {
        color: "black",
    },
    cellWeekend: {
        color: "grey",
    },
    dayCell: {
        flex: 1,
    },
    blankDayCell: {
        flex: 1,
    },
    weekRow: {
        flexDirection: "row",
        flex: 1,
        borderTopWidth: 1,
        maxHeight: 35,
        borderTopColor: "rgb(222, 222,222)",
    },
    calendar: {
        minHeight: 35 * 6,
        width: "100%",
    },
    dayButton: {
        flex: 1,
        width: "100%",
        borderRadius: 30,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    selectedDayText: {
        fontWeight: "bold",
        color: "white",
    },
    notEmptyButton: {
        //backgroundColor: "rgb(242,79,59)",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    selectedDayButton: {
        //backgroundColor: "rgb(242,79,59)",
        backgroundColor: "#1f4598",
    },
    todayButton: {
        backgroundColor: "rgba(242,79,59, 0.6)",
    },
    todayAndSelectedButton: {
        backgroundColor: "rgb(242,79,59)",
    },
    monthRow: {
        height: 50,
        flexDirection: "row",
        width: "100%",
    },
    monthButton: {
        alignItems: 'center'
    },
    monthButtonText: {
        fontSize: 24,
        margin: 10,
        color: "rgb(23,125,247)",
    },
    currentMonth: {
        flex: 1,
        fontSize: 20,
        margin: 10,
        fontWeight: "bold",
        textAlign: "center",
    },

});
