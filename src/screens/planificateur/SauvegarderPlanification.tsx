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
import { Alert, StyleSheet, unstable_batchedUpdates, View } from "react-native";
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

const SauvegarderPlanification = ({ route, navigation, timeStore }: Props) => {
    const [heure, setHeure] = React.useState<Number>(0);


    if (!NetworkUtils.isNetworkAvailable()) {
        alert("Erreur de connexion.");
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
                <View style={styles.inputWrapper}>


                    <Text>Nom Employé assigné :  </Text>
                    <View style={{ marginLeft: 'auto' }}>
                        <Text> {route.params.nomComplet} </Text>
                    </View>
                </View>

                <View style={styles.inputWrapper}>

                    <Text>Client :  </Text>
                    <View style={{ marginLeft: 'auto' }}>
                        <Text style={{ fontWeight: 'bold' }}>{SyncStorage.get('filterClientName')} </Text>
                    </View>

                </View>



                <View style={styles.inputWrapper}>
                    <Text>Projet :  </Text>
                    <View style={{ marginLeft: 'auto' }}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{SyncStorage.get('filterProjectName')} </Text>
                    </View>

                </View>

                <View style={styles.inputWrapper}>
                    <Text>Activité :  </Text>
                    <View style={{ marginLeft: 'auto', }}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{SyncStorage.get('filterActivityName')} </Text>
                    </View>

                </View>



                <View style={{ flexDirection: 'row', padding: 20 }}>
                    <Text>Nb d'heure :</Text>
                    <View style={{ marginLeft: 'auto' }}>
                        <TextInput
                            keyboardType='numeric'
                            value={heure}
                            onChange={(e) => (setHeure(e.nativeEvent.text))}
                            placeholder="Nombre d'heure"
                        />
                    </View>
                </View>
            </Content>


            <Button style={{ width: '100%', justifyContent: 'center', backgroundColor: '#1f4598' }}
                onPress={async () => {
                    let planification = SyncStorage.get('planification');
                    if (!planification) {
                        //pk_ID
                        //selectedDate
                        //AM
                        //duree
                        //client
                        //projet
                        //activity
                        planification = [];
                        planification[0] = {};
                        planification[0].employerPkId = route.params.pk_ID;
                        planification[0].duree = heure;
                        planification[0].client = SyncStorage.get('client');
                        planification[0].projet = "";
                        planification[0].activity = "";

                        console.log(planification);
                    } else {
                        planification[planification.length] = {};
                        planification[planification.length].employerPkId = "";
                        planification[planification.length].duree = "";
                        planification[planification.length].client = "";
                        planification[planification.length].projet = "";
                        planification[planification.length].activity = "";

                    }

                    console.log(planification);


                }}
            >

                <Text style={{ textAlign: 'center' }}>
                    Confirmer planification
                </Text>
            </Button>


            <Button style={{ width: '100%', justifyContent: 'center', marginTop: 25, backgroundColor: 'red' }}
                onPress={async () => {
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
export default inject("timeStore")(observer(SauvegarderPlanification));

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