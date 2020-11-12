import { StackScreenProps } from "@react-navigation/stack";
import { DrawerActions } from "@react-navigation/core";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { RefreshControl, StyleSheet, View } from "react-native";
import TimeStore from "../stores/TimeStore";
import { MainStackParamList } from "../types";
import DateSlider from "../components/DateSlider";
import { ScrollView, TouchableOpacity } from "react-native";
import { CustomPickerRow } from "../components/CustomPicker";
import { Client, Record, Projet, Activite } from "../stores/FMObjectTypes";
import { Container, Header, Button, Right, Left, Body, Icon, Text } from "native-base";
import { setNavigationState } from "../utils/PersistState";
import { dateToFrench } from "../utils/date";
type Props = {
    timeStore: TimeStore;
} & StackScreenProps<MainStackParamList, "Main">;

const MainScreen = ({ navigation, timeStore }: Props) => {
    const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
    const loadData = async () => {
        //await store.fetchHeures().finally(() => setIsRefreshing(false));
    };
    React.useEffect(() => {
        timeStore.loadConfigData().then(() => timeStore.fetchHeures());
        setIsRefreshing(true);
    }, []);
    const crud = timeStore.resources.heure;
    const heures = timeStore.selectedHeures;

    return (
        <Container style={{ flex: 1 }}>
            <Header>
                <Left>
                    <Button
                        transparent
                        onPress={() => {
                            navigation.dispatch(DrawerActions.closeDrawer());
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
                    timeStore.resources.client.clear();
                    timeStore.fetchHeures();
                }}
                noEmptyDates={timeStore.notEmptyDates}
                month={timeStore.activeMonth}
                year={timeStore.activeYear}
                selected={timeStore.selectedDate}
                onSelect={(date: Date) => timeStore.selectDate(date)}
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
                            crud.updateEditionMode("create");
                            navigation.navigate("TempsDetails");
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
                        refreshing={timeStore.resources.heure.isFetching}
                        onRefresh={() => {
                            timeStore.fetchHeures();
                        }}
                    />
                }
            >
                {heures.length === 0 ? (
                    <Text style={styles.noItemText}>Aucune entrée de temps ne correspond à la date sélectionnée</Text>
                ) : (
                    heures.map((record) => (
                        <TouchableOpacity
                            onPress={() => {
                                crud.updateEditionMode("update");
                                crud.select(record);
                                navigation.navigate("TempsDetails");
                            }}
                            style={styles.item}
                            key={record.fields.pk_ID}
                        >
                            <Text>{record.fields.Nom_projet}</Text>
                            <Text>{record.fields.Minutes} h</Text>
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
