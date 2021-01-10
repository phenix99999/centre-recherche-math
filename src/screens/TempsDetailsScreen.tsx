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


import * as React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { CustomPickerRow, DetachedCustomPickerRow } from "../components/CustomPicker";
import { Record, Client, Activite, Projet, Type_de_projet } from "../stores/FMObjectTypes";
import TimeStore from "../stores/TimeStore";
import { MainStackParamList } from "../types";
import CrudResource from "../stores/FMMobxResource";

type Props = {
    timeStore: TimeStore;
} & StackScreenProps<MainStackParamList, "Main">;


var radio_props = [
    { label: 'Oui', value: 1 },
    { label: 'Non', value: 0 },
];
let initialJobComplete = -1;

const TempsDetails = ({ navigation, timeStore }: Props) => {
    const editionMode = timeStore.resources.heure.editionMode;
    const crud = timeStore.resources.heure;
    const record = crud.selectedRecord;
    const [showQuestion, setShowQuestion] = React.useState(0);


    React.useEffect(() => {
        timeStore.loadPickerData();
        timeStore.objTemp = {AM_PM: crud.shownValue("AM_PM"),Description:crud.shownValue("Description")};

        if (editionMode === "update") {
            if (crud.shownValue("Flag_termine").localeCompare("0") == 0) {
                initialJobComplete =0;
                setShowQuestion(1);
            } else if (crud.shownValue("Flag_termine").localeCompare("1") == 0) {
                initialJobComplete =0;
                setShowQuestion(0);
            } else {
                initialJobComplete =-1;
            }
 
        }
    }, []);


 
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
    console.log(crud.shownValue("Flag_termine"));

    return (
        <Container>
            <Header>
                <Left>
                    <Button
                        onPress={() => {
                            crud.clear();
                            navigation.goBack();
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
                        const scriptOptions = {
                            script:'replanification',
                            params:[crud.shownValue("pk_ID")]
                        }
                        crud.updateValue("AM_PM", timeStore.objTemp.AM_PM, true);
                        await crud.save();
                        await timeStore.fetchHeures();


                        crud.updateValue("flag_actif",0);
                        if(crud.shownValue("Flag_termine") === "0"){
                            await timeStore.create(scriptOptions);
                        }
            

                        await timeStore.fetchHeures();
                    
                        navigation.goBack();
                    }}
                >
                    <Text>Modifier</Text>
                </Button>
                : 
                <Button
                transparent
                onPress={() => {
                    timeStore.create();
                    timeStore.fetchHeures();
                    navigation.goBack();
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
                
                        
              {timeStore.resources.client.records.find(record => record.fields.pk_ID == crud.shownValue("fk_client"))?.fields.Nom}
                        </Text>
                       
                     
                    :   
                    
                    <CustomPickerRow<Client>
                    records={timeStore.resources.client.records}
                    valueKey={"pk_ID"}
                    getLabel={(client: Record<Client>) => client.fields.Nom}
                    selectedValue={Number(crud.shownValue("fk_client"))}
                 
                    onChange={(value) => {
                        crud.updateValue("fk_client", value, true);
                        timeStore.loadPickerData();
                        if (editionMode === "update") {
                            timeStore.fetchHeures();
                        }
                    }}
                    placeholder={"Client"}
                /> }
         
                </View>
                <View style={styles.inputWrapper}>
                   
                {editionMode == "update" ? 
               <Text>
               Projets  :&nbsp;&nbsp;&nbsp;&nbsp;
               
                       
             {timeStore.resources.projet.records.find(record => record.fields.pk_ID == crud.shownValue("fk_projet"))?.fields.Nom}
                       </Text>
                : 

                    <CustomPickerRow<Projet>
                        records={timeStore.resources.projet.records}
                        valueKey={"pk_ID"}
                        getLabel={(projet: Record<Projet>) => projet.fields.Nom}
                        selectedValue={Number(crud.shownValue("fk_projet"))} 
                        onChange={(value) => {
                            crud.updateValue("fk_projet", value, true);
                            if (editionMode === "update") {
                                timeStore.fetchHeures();
                            }
                        }}
                        placeholder={"Projets"}
                    />
                 }
                </View>

                <View style={styles.inputWrapper}>

                {editionMode == "update" ? 
               <Text>
               Projets  :&nbsp;&nbsp;&nbsp;&nbsp;
               
                       
             {timeStore.resources.activite.records.find(record => record.fields.pk_ID == crud.shownValue("fk_activites"))?.fields.Nom}
                       </Text>
                : 

                <CustomPickerRow<Activite>
                records={timeStore.resources.activite.records}
                valueKey={"pk_ID"}
                getLabel={(activite: Record<Activite>) => activite.fields.Nom}
                selectedValue={Number(crud.shownValue("fk_activites"))}
                onChange={(value) => {
                    crud.updateValue("fk_activites", value, true);
                    if (editionMode === "update") {
                        timeStore.fetchHeures();
                    }
                }}
                placeholder={"Activités"}
            />
                 }


           
                </View>

                <View style={styles.inputWrapper}>
                    <DetachedCustomPickerRow
                        values={["AM", "PM"]}
                        //label={(activite: Record<Activite>) => activite.fields.Nom}
                        selectedValue={ crud.shownValue("AM_PM")}
                        onChange={(value) => {
                            crud.updateValue("AM_PM",value,true);
                    
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
                        value={crud.shownValue("Description")}
                        onChangeText={(text) => crud.updateValue("Description", text)}
                        onBlur={() => {
                            if (editionMode == "update") {
                                timeStore.objTemp.Description = crud.shownValue("Description");
                            }
                        }}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text>Nombre d'heures planifiées:</Text>
                    {editionMode == "update" ? 
                    <Text> {crud.shownValue("Minutes_planifie")}</Text>
                    : 
                    <Input
                    style={styles.inputBorder}
                    placeholder={"Écrivez ici"}
                    value={crud.shownValue("Minutes_planifie")}
                    onChangeText={(text) => crud.updateValue("Minutes_planifie", text)}
                    keyboardType={"numeric"}
           
                />}
                
                </View>
                <View style={styles.inputWrapper}>
                    <Text>Nombre d'heures réelles:</Text>
                    <Input
                        style={styles.inputBorder}
                        placeholder={"Écrivez ici"}
                        value={crud.shownValue("Minutes")}
                        onChangeText={(text) => crud.updateValue("Minutes", text)}
                        keyboardType={"numeric"}
        
                    />
                </View>


                {/* 
                {isProjectRunningBill(selectedProjet) ? (
                    <View style={styles.inputWrapper}>
                        <Text>Nombre d'heures restantes pour accomplir la tâche:</Text>
                        <Input
                            style={styles.inputBorder}
                            placeholder={"Écrivez ici"}
                            value={crud.shownValue("Minutes_restantes")}
                            onChangeText={(text) => crud.updateValue("Minutes_restantes", text)}
                            keyboardType={"numeric"}
                            onBlur={() => {
                                if (editionMode == "update") {
                                    crud.save();
                                    timeStore.fetchHeures();
                                }
                            }}
                        />
                    </View>
                ) : null} */}
{editionMode == "update" ? 
   <View style={styles.inputWrapper}>
   <Text>Est-ce que ça complète la tâche?(Oui/Non)</Text>
   <View style={{ flexDirection: 'row' }}>
       
     
       
       <RadioForm
       radio_props={radio_props}
       initial={crud.shownValue("Flag_termine") === "0" ? 1: 0 }
       formHorizontal={true}
       labelHorizontal={true}
       style={{ left: 10 }}
       radioStyle={{ paddingRight: 20 }}

       onPress={(value) => {
           if (value == 1) {
               crud.updateValue("Flag_termine", "1");
           } else if (value == 0) {
               crud.updateValue("Flag_termine", "0");
           }
           setShowQuestion(0);
       }
       }
   />
   
       
   </View>

</View>

:
 null
}
             

                {crud.shownValue("Flag_termine") === "0" && editionMode == "update" ?
                    <View>
                        <View style={styles.inputWrapper}>
                            <Text>Combien d'heure de plus ça prendrait pour terminer la tâche? </Text>
                            <Input
                                style={styles.inputBorder}
                                placeholder={"Écrivez ici"}
                                value={crud.shownValue("Minutes_restantes")}
                                onChangeText={(text) => crud.updateValue("Minutes_restantes", text)}
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
                                value={crud.shownValue("Minutes_restantes_tache")}
                                onChangeText={(text) => crud.updateValue("Minutes_restantes_tache", text)}
                               
                            />
                        </View>
                    </View>
                    : null}


                {record !== undefined && editionMode === "update" ? (
                    <Button
                        danger
                        transparent
                        style={{ alignSelf: "center" }}
                        onPress={() => {
                            timeStore.delete(record);
                            navigation.goBack();
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
