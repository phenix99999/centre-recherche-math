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
import { dateToFrench, getNotEmptyDates, getDaysInMonth,dateToFMDate } from "../utils/date";

import * as React from "react";
import { StyleSheet, unstable_batchedUpdates, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { CustomPickerRow, DetachedCustomPickerRow } from "../components/CustomPicker";
import { Record, Client, Activite, Projet, Type_de_projet } from "../stores/FMObjectTypes";
import TimeStore from "../stores/TimeStore";
import { MainStackParamList } from "../types";
import CrudResource from "../stores/FMMobxResource";
import { get,add,edit,execScript } from '../utils/connectorFileMaker';
import { create } from "mobx-persist";
import { extendObservableObjectWithProperties } from "mobx/lib/internal";
type Props = {
    timeStore: TimeStore;
} & StackScreenProps<MainStackParamList, "Main">;

let initialValueCompleteJob;
var radio_props = [
    { label: 'Oui', value: 1 },
    { label: 'Non', value: 0 },
];
let initialJobComplete = -1;

const TempsDetails = ({ route,navigation, timeStore }: Props) => {
    const editionMode = timeStore.resources.heure.editionMode;
    const crud = timeStore.resources.heure;
    // const record = crud.selectedRecord;
    const [showQuestion, setShowQuestion] = React.useState(0);
    const [formatedActivities, setFormatedActivities] = React.useState<Object>([]);
    const [formatedClients, setFormatedClients] = React.useState<Object>([]);
    const [record,setRecord] = React.useState<Object>({});
    const [formatedProjects, setFormatedProjects] = React.useState<Object>([]);


    async function getAll(query=null){
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
        let server = "vhmsoft.com";
        let db = "vhmsoft";

        let layoutClient = "mobile_CLIENTS2";
        let layoutProjet = "mobile_PROJETS2";
        let layoutActivite = "mobile_ACTIVITES2";
      
        setFormatedClients(await get(username, password, server, db, layoutClient));
        setFormatedProjects(await get(username, password, server, db, layoutProjet));
        setFormatedActivities(await get(username, password, server, db, layoutActivite));

    }

    async function getProjects(fk_client){
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
        let server = "vhmsoft.com";
        let db = "vhmsoft";
        let layoutProjet = "mobile_PROJETS2";

        setFormatedProjects(await get(username, password, server, db, layoutProjet,"&fk_client=" + fk_client));
    }

    async function getActivities(fk_projet){
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
        let server = "vhmsoft.com";
        let db = "vhmsoft";
        let layoutActivite = "mobile_ACTIVITES2";

        setFormatedActivities(await get(username, password, server, db, layoutActivite,"&fk_projet=" + fk_projet));
    }


    React.useEffect(() => {

        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
        let server = "vhmsoft.com";
        let db = "vhmsoft";

        let layoutClient = "mobile_CLIENTS2";
        let layoutProjet = "mobile_PROJETS2";
        let layoutActivite = "mobile_ACTIVITES2";
        let layoutTemps = "mobile_TEMPS2";
        let pk_ID;
        if(editionMode == "update"){
 
             pk_ID = route.params.pk_ID;
        }
        const setDataToUpdate = async (pk_ID) => {
            if(editionMode == "update"){
       
                let theRecord = (await get(username, password, server, db, layoutTemps,"&pk_ID="+pk_ID));
                console.log("The record ");
                console.log(theRecord);
                if(theRecord[0].Flag_termine == 1){
                    initialValueCompleteJob = 0;
                } else if(theRecord[0].Flag_termine == 0){
                    initialValueCompleteJob = 1;
                } else{
                    initialValueCompleteJob = -1;
                }
                console.log("Initial value complete job " + initialValueCompleteJob);
                setRecord(theRecord[0]);
            }
        };

        const setData = async (username,password,server,db,layoutClient,layoutProjet,layoutActivite) => {
            setFormatedClients(await get(username, password, server, db, layoutClient));
            setFormatedProjects(await get(username, password, server, db, layoutProjet));
            setFormatedActivities(await get(username, password, server, db, layoutActivite));
        };
    

        setData(username,password,server,db,layoutClient,layoutProjet,layoutActivite);
  
        setDataToUpdate(pk_ID);

        // if (editionMode === "update") {
        //     if (crud.shownValue("Flag_termine").localeCompare("0") == 0) {
        //         initialJobComplete =0;
        //         setShowQuestion(1);
        //     } else if (crud.shownValue("Flag_termine").localeCompare("1") == 0) {
        //         initialJobComplete =0;
        //         setShowQuestion(0);
        //     } else {
        //         initialJobComplete =-1;
        //     }
 
        // }
    }, []);

    function addAndUpdateQuery(deleteVar=false){
     let StartDate = dateToFMDate(timeStore.selectedDate);
     let fk_assignation = SyncStorage.get('user').pk_ID;
     let fk_client = record.fk_client;
     let fk_projet = record.fk_projet;
     let Minutes  = record.Minutes;
     let Minutes_planifie = record.Minutes_planifie;
     
     let AM_PM = record.AM_PM;
     let fk_activites = record.fk_activites;
     let flag_actif = deleteVar == true ? 0 : 1;
     let Description = record.Description;
     let Flag_termine = record.Flag_termine;
     let Minutes_restantes = record.Minutes_restantes;
     let Minutes_restantes_tache = record.Minutes_restantes_tache;

     return "&StartDate=" + StartDate + "&fk_assignation=" + fk_assignation +"&fk_client=" + fk_client +"&fk_projet=" + fk_projet
     + "&Minutes="+Minutes+"&Minutes_planifie="+Minutes_planifie+"&AM_PM="+AM_PM+"&fk_activites="+fk_activites+"&flag_actif="+flag_actif+"&Description="+Description+"&Flag_termine=" + Flag_termine + "&Minutes_restantes=" + Minutes_restantes + "&Minutes_restantes_tache="+Minutes_restantes_tache;

    }

  

    async function create(){
        //  POUR AJOUTER

        if(!record.fk_client || !record.fk_projet || !record.fk_activites ){
            alert("Veuillez remplir le client,projet et activites s.v.p");
        }
         let username = SyncStorage.get('username');
         let password = SyncStorage.get('password');
         
         let server = "vhmsoft.com";
         let db = "vhmsoft";
        
         let layoutTemps = "mobile_TEMPS2";
 
        await add(username,password,server,db,layoutTemps,addAndUpdateQuery());
         
    }

    async function update(){

  
         let username = SyncStorage.get('username');
         let password = SyncStorage.get('password');
         
         let server = "vhmsoft.com";
         let db = "vhmsoft";
        
         let layoutTemps = "mobile_TEMPS2";
        await edit(username,password,server,db,layoutTemps,record['record-id'],addAndUpdateQuery());
    }
 
    const computeColor = (activite?: Record<Activite>) => {
        //rouge si
        //Activite::Heures_budget_auto  >  Activite::Heures_budget
        if (activite === undefined) return "green";
        return Number(activite.fields.Heures_budget_auto) >= Number(activite.fields.Heures_budget) ? "red" : "green";
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
        return map[projet.fields.Type_de_projet];
    };

    const selectedActivite = timeStore.resources.activite.records.find(
        (record) => Number(crud.shownValue("fk_activites")) === Number(record.fields.pk_ID)
    );

    const selectedProjet = timeStore.resources.projet.records.find(
        (record) => Number(crud.shownValue("fk_projet")) === Number(record.fields.pk_ID)
    );

    const color = computeColor(selectedActivite);


    return (
    

        <Container>
            <Header>
                <Left>
                    <Button
                        onPress={() => {
                           
                            navigation.replace('Main');
                        }}
                        transparent
                    >
                        {editionMode === "create" ? <Text>Annuler</Text> : <Icon name="arrow-back"></Icon>}
                    </Button>
                </Left>

                <Body>
                    <Text>{editionMode === "create" ? "Nouvelle entrée" : "Modifier"}</Text>
                </Body>
                <Right>
                    {editionMode == "update" ? 
                    <Button
                    transparent
                    onPress={async () => {
                       
                       
                        update();

                        if(record.Flag_termine == 0){
                            let scriptName = "replanification";
                            let scriptParam = record.pk_ID;
                            let username = SyncStorage.get('username');
                            let password = SyncStorage.get('password');
                            let server = "vhmsoft.com";
                            let db = "vhmsoft";
                    
                            let layoutClient = "mobile_CLIENTS2";

                            execScript(username,password,server,db,layoutClient,scriptName,scriptParam);
                        }
                         navigation.replace('Main');


                        // const scriptOptions = {
                        //     script:'replanification',
                        //     params:[crud.shownValue("pk_ID")]
                        // }
                        // crud.updateValue("AM_PM", timeStore.objTemp.AM_PM, true);
                        // await crud.save();
                        // await timeStore.fetchHeures();


                        // crud.updateValue("flag_actif",0);
                        // if(crud.shownValue("Flag_termine") === "0"){
                        //     await timeStore.create(scriptOptions);
                        // }
            

                        // await timeStore.fetchHeures();
              
                   

                    }}
                >
                    <Text>Modifier</Text>
                </Button>
                : 
                <Button
                transparent
                onPress={() => {
                    create();
                    navigation.replace('Main');
                    // timeStore.create();
                    // timeStore.fetchHeures();
                    // navigation.goBack();
                }}
            >
                <Text>Créer</Text>
            </Button>
                }
               
     
           
                </Right>
            </Header>

            <Content style={{ flex: 1, flexDirection: "column" }}>
                <View style={styles.inputWrapper}>
                    {editionMode == "update"  ? 
                    <Text>
                Clients  :&nbsp;&nbsp;&nbsp;&nbsp;
               
                {formatedClients.find(client => client.pk_ID == record.fk_client)?.Nom}
                     {/* {timeStore.resources.projet.records.find(record => record.fields.pk_ID == crud.shownValue("fk_projet"))?.fields.Nom} */}

                            </Text>
                       
                
                    :   
                    
                    <CustomPickerRow<Client>
                    records={formatedClients}
                    valueKey={"pk_ID"}
                    getLabel={(client: Record<Client>) => client.Nom}
                    selectedValue={Number(record.fk_client)}
                 
                    onChange={(value) => {
                        setRecord({...record,"fk_client":value,"fk_projet":-1,"fk_activites":-1});
                        getProjects(value);
                     
                    }}
                    placeholder={"Client"}
                /> }
         
                </View>
                <View style={styles.inputWrapper}>
                   
                {editionMode == "update" ? 
               <Text>
               Projets  :&nbsp;&nbsp;&nbsp;&nbsp;
     
               {formatedProjects.find(project => project.pk_ID == record.fk_projet)?.Nom}
             {/* {timeStore.resources.projet.records.find(record => record.fields.pk_ID == crud.shownValue("fk_projet"))?.fields.Nom} */}
                       </Text>
                : 

                    <CustomPickerRow<Projet>
                        records={formatedProjects}
                        valueKey={"pk_ID"}
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
   
             {formatedActivities.find(activity => activity.pk_ID == record.fk_activites)?.Nom}
                       </Text>
                : 

                <CustomPickerRow<Activite>
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
              
                    <DetachedCustomPickerRow
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
                <View style={styles.inputWrapper}>
                    <Text>Nombre d'heures planifiées:</Text>
                    {editionMode == "update" ? 
                    <Text> {"ASDF"}</Text>
                    : 
                    <Input
                    style={styles.inputBorder}
                    placeholder={"Écrivez ici"}
                    value={record.Minutes_planifie}
                    onChangeText={(text) =>  setRecord({...record,"Minutes_planifie": text})}
                    keyboardType={"numeric"}
           
                />}
                
                </View>
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


                
                {isProjectRunningBill(selectedProjet) ? (
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
                        {editionMode == "update" ? 
                        <View style={styles.inputWrapper}>
                        <Text>Est-ce que ça complète la tâche?(Oui/Non)</Text>
                        <View style={{ flexDirection: 'row' }}>
                            
                            
                            
                            <RadioForm
                            radio_props={radio_props}
                            initial={initialValueCompleteJob}
                            formHorizontal={true}
                            labelHorizontal={true}
                            style={{ left: 10 }}
                            radioStyle={{ paddingRight: 20 }}
                            onPress={(value) => {
                                
                                console.log(value);
                       
                                setRecord({...record,"Flag_termine":value})
                               
                            }
                            }
                        />
                        
                            
                        </View>

                        </View>

                        :
                        null
                        }
                {record.Flag_termine == 0 && editionMode == "update" ?
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
                           
                            await edit(username,password,server,db,layoutTemps,record['record-id'],addAndUpdateQuery(true));
                            navigation.replace('Main');

                        }}
                    >
                        <Text>Supprimer</Text>
                    </Button>
                ) : null}
            </Content>
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
