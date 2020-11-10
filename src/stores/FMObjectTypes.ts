export interface Record<T> {
    fields: T
    id: number
}


export interface Heure {

    "pk_ID":string,
    "_link":string,
    "_found_Count":string,
    "StartDate":string,
    "Timestamp_creation":string,
    "Minutes":string,
    "Description":string,
    "fk_projet":string,
    "fk_activites":string,
    "Flag_DD":string,
    "flag_actif":string,
    "fk_assignation":string,
    "StartTime":string,
    "Minutes_facturable":string,
    "BGColor":string,
    "ID_Category":string,
    "Nom_projet":string,
    "Nom_activite":string,
    "flag_R_et_D":string,
    "FlagCalendrier":string,
    "EndDate":string,
    "EndTime":string,
    "StartDatePAsBonne":string,
    "calendrier_AllDay":string,
    "calendrier_AllDayTrueFalse":string,
    "Total_Heures":string,
    "fk_client":string,
    "Nom_incertitude":string,
    "Nom_incertitude_contexte":string,
    "AM_PM":string,
    
}

export interface Client {
    pk_ID:string
    Nom:string
}

export interface Account {
    pk_ID:string
    UserAccountName:string
}

export interface Projet {
    pk_ID:string
    fk_client:string
    Nom:string
}

export interface Activite {
    pk_ID:string
    Nom:string
    fk_projet:string
    fk_client:string
    fk_assignation:string
}