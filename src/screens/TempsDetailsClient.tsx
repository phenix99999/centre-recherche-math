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
import { Alert, StyleSheet, unstable_batchedUpdates, View } from "react-native";
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
let initialJobComplete = -1;

let initialFacturable = -1;

let initialRd = -1;


const TempsDetailsClient = ({ route,navigation, timeStore }: Props) => {
    const editionMode = route.params.editionMode;

    const [record,setRecord] = React.useState<Object>({});

    const [formatedActivities, setFormatedActivities] = React.useState<Object>([]);
    const [formatedClients, setFormatedClients] = React.useState<Object>([]);
    const [formatedProjects, setFormatedProjects] = React.useState<Object>([]);

    const [tache, setTache] = React.useState<String>("");
    const [activityName, setActivityName] = React.useState<String>("");
    const [activity, setActivity] = React.useState<Object>({});
    const [employeList,setEmployeList] = React.useState<Object>([]);
    const [projectName, setProjectName] = React.useState<String>("");
    const [project, setProject] = React.useState<Object>({});

    const [initialeValueFlagComplet, setInitialeValueFlagComplet] = React.useState<String>("");
 
    function getEmployeNameWithPkId(pk_id) {
        for (let i = 0; i < employeList.length; i++) {
            if (employeList[i].pk_ID == pk_id) {
                return employeList[i]._C_nomComplet;
            }
        }
        return "";
    }

    async function getProjects(fk_client){
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
  
        let layoutProjet = "mobile_PROJETS2";

        setFormatedProjects(await get(username, password,   global.fmServer, global.fmDatabase, layoutProjet,"&fk_client=" + fk_client));
    }

    async function getActivities(fk_projet){
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
    
        let db = "vhmsoft";
        let layoutActivite = "mobile_ACTIVITES2";

        setFormatedActivities(await get(username, password,   global.fmServer,  global.fmDatabase, layoutActivite,"&fk_projet=" + fk_projet));
    }


    async function setActivityData(fk_activites){
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
 
        let db = "vhmsoft";
        let layoutActivite = "mobile_ACTIVITES2";
        console.log(fk_activites);
        let activity = await get(username, password,   global.fmServer,  global.fmDatabase, layoutActivite,"&pk_ID=" + fk_activites);
        setActivity(activity[0]);
        setActivityName(activity[0].Nom);
    }


    async function setProjectData(fk_project){
        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
 
        let db = "vhmsoft";
        let layoutActivite = "mobile_PROJETS2";
  
        let project = await get(username, password,   global.fmServer,  global.fmDatabase, layoutActivite,"&pk_ID=" + fk_project);
        setProject(project[0]);
        setProjectName(project[0].Nom);
    }




    React.useEffect(() => {

        let username = SyncStorage.get('username');
        let password = SyncStorage.get('password');
  
        let db = "vhmsoft";

        let layoutClient = "mobile_CLIENTS2";
        let layoutProjet = "mobile_PROJETS2";
        let layoutActivite = "mobile_ACTIVITES2";
        let layoutTemps = "mobile_TEMPS2";
        let pk_ID= route.params.pk_ID;


        let layoutAccount = "mobile_ACCOUNT2";

        const getListEmployes = async() => {
            let employes = (await get(username, password, global.fmServer, global.fmDatabase, layoutAccount));

            setEmployeList(employes);


        }
 
        const setDataToUpdate = async (pk_ID) => {
                let theRecord = (await get(username, password, global.fmServer, global.fmDatabase, layoutTemps,"&pk_ID="+pk_ID));
                setActivityData(theRecord[0].fk_activites);
                console.log(theRecord[0]);
    
                setRecord(theRecord[0]);
             
        };

        const setData = async (username,password,server,db,layoutClient,layoutProjet,layoutActivite) => {
            setFormatedClients(await get(username, password, server, db, layoutClient));
            setFormatedProjects(await get(username, password, server, db, layoutProjet));
            // setFormatedActivities(await get(username, password, server, db, layoutActivite));
        };
    

        setData(username,password,  global.fmServer, global.fmDatabase,layoutClient,layoutProjet,layoutActivite);
        
        setDataToUpdate(pk_ID);
        getListEmployes();

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
     let Minutes  = record.Minutes || "";
     let Minutes_planifie = record.Minutes_planifie || "";
     
     let AM_PM = record.AM_PM || "";
     let fk_activites = record.fk_activites || "";
     let flag_actif = deleteVar == true ? 0 : 1;
     let Description = record.Description || "";
     let Flag_termine = record.Flag_termine || "";
        
     let facturable = record.Flag_facturable || "";
     let rd = record.flag_R_et_D;
     let tache = record.Taches.length;
     let Nom_assignation = record.Nom_assignation || "";
 

     let Minutes_restantes = record.Minutes_restantes || "";
     let Minutes_restantes_tache = record.Minutes_restantes_tache || "";
    
     return "&StartDate=" + StartDate + "&fk_assignation=" + fk_assignation +"&fk_client=" + fk_client +"&fk_projet=" + fk_projet+"&Taches=" + tache +"&Flag_facturable="+facturable+"&flag_R_et_D=" + rd
     + "&Minutes="+Minutes+"&Minutes_planifie="+Minutes_planifie+"&AM_PM="+AM_PM+"&fk_activites="+fk_activites+"&flag_actif="+flag_actif+"&Description="+Description+"&Flag_termine=" + Flag_termine + "&Minutes_restantes=" + Minutes_restantes + "&Minutes_restantes_tache="+Minutes_restantes_tache;

    }

  

    async function create(){
        //  POUR AJOUTER
     

        if(!record.fk_client || !record.fk_projet || !record.fk_activites ){
            alert("Veuillez remplir le client,projet et activites s.v.p");
        }else{
            let username = SyncStorage.get('username');
            let password = SyncStorage.get('password');
            
 
            let db = "vhmsoft";
           
            let layoutTemps = "mobile_TEMPS2";
            console.log(addAndUpdateQuery());
           await add(username,password,global.fmServer,global.fmDatabase,layoutTemps,addAndUpdateQuery());
           navigation.replace('Main');
        } 
    }

    async function update(){

  
         let username = SyncStorage.get('username');
         let password = SyncStorage.get('password');
         
 
                  let db = "vhmsoft";
        
         let layoutTemps = "mobile_TEMPS2";
        if(record.Minutes_restantes_tache.length == 0  && record.Flag_termine == 0){
            alert("Veuillez entrez une description de ce qui reste à accomplir s.v.p.");
        } else {

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

    if(record.Flag_termine == "1"){
        initialJobComplete =0;
    } else if(record.Flag_termine == "0"){
        initialJobComplete = 1;
    }
 
    if(record.Flag_facturable == "1"){
        initialFacturable = 0;
    } else if(record.Flag_facturable == "0"){
        initialFacturable = 1;
    }


    if(record.flag_R_et_D == "1"){
        initialRd = 0;
    } else if(record.flag_R_et_D == "0"){
        initialRd = 1;
    }


    return (
    

        <Container>
            <Header>
                <Left>
                    <Button
                        onPress={() => {
                           
                            navigation.replace(route.params.comeFrom);
                        }}
                        transparent
                    >
                         <Icon name="back" type="AntDesign" style={{ fontSize: 30, marginLeft: 2, color: '#1f4598' }} />
                    </Button>
                    
                </Left>

                <Body>
                    <Text style={{color: '#1f4598',fontWeight:'bold'}}>Détails</Text>
                </Body>
                <Right>
            
                </Right>
            </Header>

            <Content style={{ flex: 1, flexDirection: "column" }}>
                <View style={styles.inputWrapper}>
               
                    <Text>
                Clients  :&nbsp;&nbsp;
               
                {formatedClients.find(client => client.pk_ID == record.fk_client)?.Nom}
            
                            </Text>
                </View>
                <View style={styles.inputWrapper}>
                
               <Text>
               Projets  :&nbsp;&nbsp;
               {formatedProjects.find(project => project.pk_ID == record.fk_projet)?.Nom}

                       </Text>
            
                </View>

                <View style={styles.inputWrapper}>

       
               <Text>
               Activités  :&nbsp;&nbsp;  
   
             {activityName}
                       </Text>
               

                 
                </View>

    
                <View style={styles.inputWrapper}>
                    <Text>
                    Employé  :&nbsp;&nbsp;
                    <Text style={{marginLeft:'auto'}}> 
                        {getEmployeNameWithPkId(record.fk_assignation)}
                        </Text>
                    </Text>
                </View>

                <View style={styles.inputWrapper}>
 
                    
                        <Text>
                            Tâches  :&nbsp;&nbsp;

                        {record.Taches}
                        </Text>
                       

                </View>

              
                <View style={styles.inputWrapper}>
                    <Text>Description:</Text>
                    <Text>
                    {record.Description}
                    </Text>
                    
                </View>
                <View style={styles.inputWrapper}>
                    <Text>Nombre d'heures planifiées:</Text>
                    
                    <Text> {record.Minutes_planifie}</Text>
                   
                
                </View>
                <View style={styles.inputWrapper}>
                    <Text>Nombre d'heures réelles:</Text>
                 
                    <Text> {record.Minutes}</Text>
                   
                </View>


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
                           
                            await edit(username,password,server,  global.fmServer,layoutTemps,record['record-id'],addAndUpdateQuery(true));
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
export default inject("timeStore")(observer(TempsDetailsClient));

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
