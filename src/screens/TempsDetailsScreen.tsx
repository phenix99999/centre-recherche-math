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
import { dateToFrench, getNotEmptyDates, getDaysInMonth, dateToFMDate } from "../utils/date";

import * as React from "react";
import { Alert, StyleSheet, Platform, View,ActivityIndicator } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { CustomPickerRow, DetachedCustomPickerRow } from "../components/CustomPicker";
import { Record, Client, Activite, Projet, Type_de_projet } from "../stores/FMObjectTypes";
import TimeStore from "../stores/TimeStore";
import { MainStackParamList } from "../types";
import CrudResource from "../stores/FMMobxResource";
import { get, add, edit, execScript } from '../utils/connectorFileMaker';
import { create } from "mobx-persist";
import { extendObservableObjectWithProperties } from "mobx/lib/internal";
type Props = {
    timeStore: TimeStore;
} & StackScreenProps<MainStackParamList, "Main">;


var radio_props = [
    { label: 'Oui', value: 1 },
    { label: 'Non', value: 0 },
];

let formatedTaches = [
    "Analyse",
    "Gestion de projet",
    "Programmation",
    "Support",
    "Rencontre",
    "Appel téléphonique",
    "Améliorations continues",
    "Suivis",
    "Rédaction",
    "Pilotage",
    "Recherche",
    "Design",
];


const TempsDetails = ({ route, navigation, timeStore }: Props) => {
    const editionMode = route.params.editionMode;

    const [record, setRecord] = React.useState<Object>({});
    const [isLoading, setLoading] = React.useState<Boolean>(false);

    const [formatedActivities, setFormatedActivities] = React.useState<Object>([]);
    const [formatedClients, setFormatedClients] = React.useState<Object>([]);
    const [formatedProjects, setFormatedProjects] = React.useState<Object>([]);

    const [tache, setTache] = React.useState<String>("");
    const [activityName, setActivityName] = React.useState<String>("");
    const [activity, setActivity] = React.useState<Object>({});
    const [projectName, setProjectName] = React.useState<String>("");
    const [project, setProject] = React.useState<Object>({});

    const [initialeValueFlagComplet, setInitialeValueFlagComplet] = React.useState<String>("");
    const [initialJobComplete, setInitialJobComplete] = React.useState<Number>();
    const [initialFacturable, setInitialFacturable] = React.useState<Number>();
    const [initialRd, setInitialRd] = React.useState<Number>();





    async function getProjects(fk_client) {
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');

        let layoutProjet = "mobile_PROJETS2";
        

        setFormatedProjects(await get(username, password, global.fmServer, global.fmDatabase, layoutProjet, "&fk_client=" + fk_client + "&flag_actif=1&-sortfield.1=Nom&-sortorder.1=ascend"));
    }

    async function getActivities(fk_projet) {
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');

        let db = "vhmsoft";
        let layoutActivite = "mobile_ACTIVITES2";

        setFormatedActivities(await get(username, password, global.fmServer, global.fmDatabase, layoutActivite, "&flag_actif=1&fk_projet=" + fk_projet + "&-sortfield.1=Nom&-sortorder.1=ascend"));
    }


    async function setActivityData(fk_activites,nomActivite) {
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');

        let db = "vhmsoft";
        let layoutActivite = "mobile_ACTIVITES2";
      
        setActivityName(nomActivite);
    }


    async function setProjectData(fk_project) {
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');

        let db = "vhmsoft";
        let layoutActivite = "mobile_PROJETS2";

        let project = await get(username, password, global.fmServer, global.fmDatabase, layoutActivite, "&pk_ID=" + fk_project);
        setProject(project[0]);
        setProjectName(project[0].Nom);
    }

    React.useEffect(() => {
        // alert(route.params.pk_ID);
        setLoading(true);
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');

        let db = "vhmsoft";

        let layoutClient = "mobile_CLIENTS2";
        let layoutProjet = "mobile_PROJETS2";
        let layoutActivite = "mobile_ACTIVITES2";
        let layoutTemps = "mobile_TEMPS2";
        let pk_ID;
        if (editionMode == "update") {

            pk_ID = route.params.pk_ID;

        }

        const setDataToUpdate = async (pk_ID) => {

            if (editionMode == "update") {

                let theRecord = (await get(username, password, global.fmServer, global.fmDatabase, layoutTemps, "&pk_ID=" + pk_ID));

                if (theRecord[0].fk_activites) {
                    setActivityData(theRecord[0].fk_activites,theRecord[0].Nom_activite);

                }


                if (theRecord[0].Flag_termine == "1") {

                    setInitialJobComplete(0);

                } else if (theRecord[0].Flag_termine == "0") {
                    setInitialJobComplete(1);
                }

                if (theRecord[0].Flag_facturable == 1) {
                    setInitialFacturable(0);
                } else if (theRecord[0].Flag_facturable == 0) {
                    setInitialFacturable(1);
                }


                if (theRecord[0].flag_R_et_D == "1") {
                    setInitialRd(0);
                } else if (theRecord[0].flag_R_et_D == "0") {
                    setInitialRd(1);
                }

                setRecord(theRecord[0]);
            }
        };

        const setData = async (username, password, server, db, layoutClient, layoutProjet, layoutActivite) => {
            if(Platform.OS != "ios"){
                setFormatedClients([{pk_ID:-1,Nom:'Choisissez un client',fk_client:-1}].concat(await get(username, password, server, db, layoutClient, "&pk_ID=>0&-sortfield.1=Nom&-sortorder.1=ascend")));
            }else{
                setFormatedClients((await get(username, password, server, db, layoutClient, "&pk_ID=>0&-sortfield.1=Nom&-sortorder.1=ascend")));

            }
            // setFormatedProjects(await get(username, password, server, db, layoutProjet, "&flag_actif=1&-sortfield.1=Nom&-sortorder.1=ascend"));
        };


        setData(username, password, global.fmServer, global.fmDatabase, layoutClient, layoutProjet, layoutActivite);
        if (editionMode == "update") {
            setDataToUpdate(pk_ID);

        } else {
            setRecord({ flag_R_et_D: 0, Flag_facturable: 1, Flag_termine: '1' });
        }
        setLoading(false);
       
    }, []);

    function addAndUpdateQuery(deleteVar = false) {
        let StartDate = dateToFMDate(timeStore.selectedDate);
        let fk_assignation = SyncStorage.get('user').pk_ID;
        let fk_client = record.fk_client;
        let fk_projet = record.fk_projet;
        let Minutes = record.Minutes || "";
        let Minutes_planifie = record.Minutes_planifie || "";

        let AM_PM = record.AM_PM || "";
        let fk_activites = record.fk_activites || "";
        let flag_actif = deleteVar == true ? 0 : 1;
        let Description = record.Description || "";
        let Flag_termine = record.Flag_termine;

        let facturable = record.Flag_facturable;
        let rd = record.flag_R_et_D;
        let tache = record.Taches
        let Minutes_restantes = record.Minutes_restantes || "";
        let Minutes_restantes_tache = record.Minutes_restantes_tache || "";

        return "&StartDate=" + StartDate + "&fk_assignation=" + fk_assignation + "&fk_client=" + fk_client + "&fk_projet=" + fk_projet + "&Taches=" + tache + "&Flag_facturable=" + facturable + "&flag_R_et_D=" + rd
            + "&Minutes=" + Minutes + "&Minutes_planifie=" + Minutes_planifie + "&AM_PM=" + AM_PM + "&fk_activites=" + fk_activites + "&flag_actif=" + flag_actif + "&Description=" + Description + "&Flag_termine=" + Flag_termine + "&Minutes_restantes=" + Minutes_restantes + "&Minutes_restantes_tache=" + Minutes_restantes_tache;

    }



    async function create() {
        //  POUR AJOUTER


        if (!record.fk_client || !record.fk_projet || !record.fk_activites) {
            alert("Veuillez remplir le client,projet et activites s.v.p");
        } else {
            let username = SyncStorage.get('username');
            let password = SyncStorage.get('password');


            let db = "vhmsoft";

            let layoutTemps = "mobile_TEMPS2";

            await add(username, password, global.fmServer, global.fmDatabase, layoutTemps, addAndUpdateQuery());
            navigation.goBack();
        }
    }

    async function update() {
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
        let db = "vhmsoft";

        let layoutTemps = "mobile_TEMPS2";
        //  alert(record.Minutes_restantes_tache.length);
        if (record.Minutes_restantes_tache.length < 5 && record.Flag_termine == 0) {
            alert("Veuillez entrez une description de ce qui reste à accomplir s.v.p.")
            return false;
        } else {
            await edit(username, password, global.fmServer, global.fmDatabase, layoutTemps, record['record-id'], addAndUpdateQuery());
            if (record.Flag_termine == 0 && initialJobComplete == 1) {
                let scriptName = "replanification";
                let scriptParam = record.pk_ID;
                let username = SyncStorage.get('username');
                let password = SyncStorage.get('password');
                let layoutClient = "mobile_CLIENTS2";

                execScript(username, password, global.fmServer, global.fmDatabase, layoutClient, scriptName, scriptParam);

            }
            return true;
        }
    }

    const computeColor = (activite?: Record<Activite>) => {
        //rouge si
        //Activite::Heures_budget_auto  >  Activite::Heures_budget
        if (activite === undefined) return "green";
        return Number(activite.Heures_budget_auto) >= Number(activite.Heures_budget) ? "red" : "green";
    };

    const isProjectRunningBill = (projet?: Record<Projet>) => {
        if (projet === undefined) return false;
        const map: {
            [key in Type_de_projet]: boolean;
        } = {
            "Budget du total des budgets d'activités": true,
            "Budget du total du projet": true,
            "Budget par mois": false,
            "Pas de budget déterminé": false,
            "": false,
        };
        return map[projet.Type_de_projet];
    };



    const color = computeColor(activity);

    // alert(initialFacturable);


    return (


        <Container>
            { isLoading ?
                <View style={[styles.container, styles.horizontal]}>

                    <ActivityIndicator size="large" color="black" />

                </View>


                :
                <View style={{flex:1}}>

     
        <Header
            style={Platform.OS != 'ios' ? { backgroundColor: 'transparent', height: 80, justifyContent: 'center' } : { backgroundColor: 'transparent' }}
            >
          
    
                <Left>
                    <Button
                        onPress={() => {
                            navigation.goBack();
                        }}
                        transparent
                    >
                        {editionMode === "create" ?                             <Icon name="back" type="AntDesign" style={{ fontSize: 30, marginLeft: 2, color: '#1f4598' }} />
 :                    <Icon name="back" type="AntDesign" style={{ fontSize: 30, marginLeft: 2, color: '#1f4598' }} />
}
                    </Button>
                </Left>

                <Body style={{alignItems:'center'}}>
                    <Text>{editionMode === "create" ? "Nouvelle entrée" : "Modifier"}</Text>
                </Body>
                <Right>
                    {editionMode == "update" ? 
                    <Button
                    transparent
                    onPress={async () => {
         
                        if(await update()){
                            navigation.goBack();
                        }
                    }}
                >
                    <Text>Modifier</Text>
                </Button>
                : 
                <Button
                transparent
                onPress={() => {
                    create();
            
                }}
            >
    <Icon name="plus" type="AntDesign" style={{ fontSize: 30, marginLeft: 2, color: '#1f4598' }} />

            </Button>
                }
               
     
           
                </Right>
          
            </Header>

            <Content style={{ flex: 1, flexDirection: "column" }}>
                <View style={styles.inputWrapper}>
                    {editionMode == "update"  ? 
                    <Text>
                                Clients  :&nbsp;&nbsp;&nbsp;&nbsp;
                                 
                {record.Nom_client}
            
                            </Text>
                       
                
                    :   
                    
                    <CustomPickerRow<Client>
         
                    records={formatedClients}
                    valueKey={"pk_ID"}
                    getLabel={(client: Record<Client>) => client.Nom}
                    selectedValue={Number(record.fk_client)}
                    name={"Sélectionner Client"}
                    onChange={(value) => {

                        if(value !=-1){
                            setRecord({...record,"fk_client":value});
                            getProjects(value);
                        }
                     
              
                     
                    }}
                    placeholder={"Client"}
                /> }
         
                </View>
                <View style={styles.inputWrapper}>
                   
                {editionMode == "update" ? 
               <Text>
                                Projets  :&nbsp;&nbsp;&nbsp;&nbsp;
                                 
               {record.Nom_projet}

                       </Text>
                : 

                    <CustomPickerRow<Projet>
                        records={formatedProjects}
                        valueKey={"pk_ID"}
                        name={"Sélectionner Projet"}
                        getLabel={(projet: Record<Projet>) => projet.Nom}
                        selectedValue={Number(record.fk_projet)} 
                        onChange={(value) => {
                            setRecord({...record,"fk_projet":value});
                            getActivities(value);

                        }}
                        placeholder={"Projets"}
                    />
                 }
                </View>

                <View style={styles.inputWrapper}>

                {editionMode == "update" ? 
               <Text>
                                Activités  :&nbsp;&nbsp;&nbsp;&nbsp;  
                                 
          {record.Nom_activite}
                       </Text>
                : 

                <CustomPickerRow<Activite>
                name={"Sélectionner Activité"}
                records={formatedActivities}
                valueKey={"pk_ID"}
                getLabel={(activite: Record<Activite>) => activite.Nom}
                selectedValue={Number(record.fk_activites)}
                onChange={(value) => {
                    setRecord({...record,"fk_activites" : value})
                }}
                placeholder={"Activités"}
            />
                 }

                 
                </View>

                <View style={styles.inputWrapper}>
 
                    {editionMode == "update" ?
                        <Text>
                                Tâches  :&nbsp;&nbsp;&nbsp;&nbsp;

                        {record.Taches}
                        </Text>
                        :

                <DetachedCustomPickerRow
     
                        name={"Sélectionner Tâches"}
                        values={formatedTaches}
                        label={(tache: Record<Activite>) => tache.name}
                        selectedValue={record.Taches}
                        onChange={(value) => {
                            setRecord({ ...record, "Taches": value })
                        }}
                        placeholder={"Tâches"}
                    />
                    }

                </View>

                <View style={styles.inputWrapper}>
              
                    <DetachedCustomPickerRow
                        name={"Sélectionner Période"}
                        values={["AM", "PM"]}
                        label={(activite: Record<Activite>) => activite.fields.Nom}
                        selectedValue={record.AM_PM}
                        onChange={(value) => {
                            setRecord({...record,"AM_PM":value});
                        }}
                        placeholder={"AM / PM "}
                    />
      
                              </View>
                <View style={styles.inputWrapper}>
                    <Text>Description:</Text>
                    <Textarea
                        placeholder={"Écrivez la description ici"}
                        bordered
                        underline
                        style={styles.inputBorder}
                        rowSpan={5}
                        value={record.Description}
                        onChangeText={(text) => {
                            setRecord({...record,"Description": text});
                        }}
                    />
                </View>
         
                {editionMode == "update" && record.Minutes_planifie != "" ? 
       
        <View style={styles.inputWrapper}>
                    <Text>Nombre d'heures planifiées:</Text>
                    <Text> {record.Minutes_planifie}</Text>
                    </View>
                    : 
                    null
           
                      }
                
    
                <View style={styles.inputWrapper}>
                    <Text>Nombre d'heures réelles:</Text>
                    <Input
                        style={styles.inputBorder}
                        placeholder={"Écrivez ici"}
                        value={record.Minutes}
                        onChangeText={(text) => setRecord({...record,"Minutes": text})}
                        keyboardType={"numeric"}
        
                    />
                </View>


                
                {isProjectRunningBill(project) ? (
                    <View style={styles.inputWrapper}>
                        <Text>Nombre d'heures restantes pour accomplir la tâche:</Text>
                        <Input
                            style={styles.inputBorder}
                            placeholder={"Écrivez ici"}
                            value={record.Minutes_restantes}
                            onChangeText={(text) => setRecord({...record,"Minutes_restantes": text})}
                            keyboardType={"numeric"}
                        
                        />
                    </View>
                ) : null}


               
                        <View style={styles.inputWrapper}>
                        <Text>Est-ce que c'est facturable?</Text>
                   
                        <View style={{ flexDirection: 'row' }}>
                            
                            {record.Flag_facturable == 1 ? 
                                    <RadioForm
                                    radio_props={radio_props}
                                    initial={(0)}
                                    formHorizontal={true}
                                    labelHorizontal={true}
                                    style={{ left: 10 }}
                                    radioStyle={{ paddingRight: 20 }}
                                    onPress={(value) => {
                                        setRecord({...record,"Flag_facturable":Number(value)})
                                        
                                    }
                                    }
                                />
                            : 
                            
                            null}

                        {record.Flag_facturable == 0 ? 
                                    <RadioForm
                                    radio_props={radio_props}
                                    initial={(1)}
                                    formHorizontal={true}
                                    labelHorizontal={true}
                                    style={{ left: 10 }}
                                    radioStyle={{ paddingRight: 20 }}
                                    onPress={(value) => {
                                        setRecord({...record,"Flag_facturable":Number(value)})
                                        
                                    }
                                    }
                                />
                            : 
                            
                            null}

                        </View>

                        </View>


                        <View style={styles.inputWrapper}>
                    <Text>Est-ce que c'est du R&D ?</Text>
                    <View style={{ flexDirection: 'row' }}>
                                            
                    {record.flag_R_et_D == 1 ? 
                            <RadioForm
                            radio_props={radio_props}
                            initial={(0)}
                            formHorizontal={true}
                            labelHorizontal={true}
                            style={{ left: 10 }}
                                radioStyle={{ paddingRight: 20 }}
                                onPress={(value) => {
                                    setRecord({...record,"flag_R_et_D":Number(value)})                               
                                }
                                }
                            />
                                :
                                null
                                    }

                    {record.flag_R_et_D == 0 ? 
                                <RadioForm
                                radio_props={radio_props}
                                initial={(1)}
                                formHorizontal={true}
                                labelHorizontal={true}
                                style={{ left: 10 }}
                                radioStyle={{ paddingRight: 20 }}
                                onPress={(value) => {
                                    setRecord({...record,"flag_R_et_D":Number(value)})                               
                                }
                                }
                            />
                    :
                                null
                                    }
          

                    
                       
                        </View>

                        </View>
 
                    
 
                        

                        {editionMode == "update" && record.Flag_termine == 1 ? 
                        <View style={styles.inputWrapper}>
                        <Text>Est-ce que ça complète la tâche?(Oui/Non)</Text>
                        <View style={{ flexDirection: 'row' }}>
                            
                            
                            <RadioForm
                            radio_props={radio_props}
                            initial={(0)}
                            formHorizontal={true}
                            labelHorizontal={true}
                            style={{ left: 10 }}
                            radioStyle={{ paddingRight: 20 }}
                            onPress={(value) => {

                                // alert(Number(value));
                            
                                setRecord({...record,"Flag_termine":Number(value)})
                               
                            }
                            }
                        />
                        
                            
                        </View>

                        </View>

                        :
                        null
                        }

                {editionMode == "update" && record.Flag_termine ==0 ? 
                        <View style={styles.inputWrapper}>
                        <Text>Est-ce que ça complète la tâche?(Oui/Non)</Text>
                        <View style={{ flexDirection: 'row' }}>
                            
                            
                            <RadioForm
                            radio_props={radio_props}
                            initial={(1)}
                            formHorizontal={true}
                            labelHorizontal={true}
                            style={{ left: 10 }}
                            radioStyle={{ paddingRight: 20 }}
                            onPress={(value) => {

                                // alert(Number(value));
                            
                                setRecord({...record,"Flag_termine":Number(value)})
                               
                            }
                            }
                        />
                        
                            
                        </View>

                        </View>

                        :
                        null
                        }

    

                {(record.Flag_termine == "0") && editionMode == "update" ?
                    <View>
                        <View style={styles.inputWrapper}>
                            <Text>Combien d'heure de plus ça prendrait pour terminer la tâche? </Text>
                            <Input
                                style={styles.inputBorder}
                                placeholder={"Écrivez ici"}
                                value={record.Minutes_restantes}
                                onChangeText={(text) => setRecord({...record,"Minutes_restantes":text})}
                                keyboardType={"numeric"}
                               
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text>Brève description sur ce qui reste à accomplir :</Text>
                            <Textarea
                                placeholder={"Écrivez la description ici"}
                                bordered
                                underline
                                style={styles.inputBorder}
                                rowSpan={5}
                                value={record.Minutes_restantes_tache}
                                onChangeText={(text) =>  setRecord({...record,"Minutes_restantes_tache":text})}
                               
                            />
                        </View>
                    </View>
                    : null}


                {record !== undefined && editionMode === "update" ? (
                    <Button
                        danger
                        transparent
                        style={{ alignSelf: "center" }}
                        onPress={async () => {
                            let username = SyncStorage.get('username');
                            let password = SyncStorage.get('password');
                            
                            let server = "vhmsoft.com";
                            let db = "vhmsoft";
                           
                            let layoutTemps = "mobile_TEMPS2";
                           
                            await edit(username,password,global.fmServer,global.fmDatabase,layoutTemps,record['record-id'],addAndUpdateQuery(true));
                            navigation.goBack();

                        }}
                    >
                        <Text>Supprimer</Text>
                    </Button>
                ) :
                <View style={{flexDirection:'row',left:'15%'}}>
                <Button
  
                onPress={() => {
                    create();
            
                }}
            >
<Text>Créer</Text>
            </Button>
            </View>
                }
            </Content>
            </View>
            }
            
        </Container>
    );
};
export default inject("timeStore")(observer(TempsDetails));

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
