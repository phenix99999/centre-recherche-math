import { action, computed, observable, toJS } from 'mobx';
import FMResource from './FMMobxResource';
import { Heure, Record, Client, Account, Projet, Activite } from './FMObjectTypes';
import { RootStore } from './index';
import { areSameDates, dateToFMDate } from "../utils/date";


interface Resources {
    heure: FMResource<Heure>
    client: FMResource<Client>
    projet: FMResource<Projet>
    activite: FMResource<Activite>
    account: FMResource<Account>
    replanification: FMResource<any>
}

export default class TransportStore {

    root: RootStore;
    @observable resources: Resources;
    @observable activeMonth: number;
    @observable activeYear: number;
    @observable selectedDate: Date;

    @observable selectedTimeId?: number;

    constructor(rootStore: RootStore) {
        this.root = rootStore;
        this.resources = {
            replanification: new FMResource<Heure>('mobile_TEMPS', rootStore.api, this.handleError),
            heure: new FMResource<Heure>('mobile_TEMPS', rootStore.api, this.handleError),
            client: new FMResource<Client>('mobile_CLIENTS', rootStore.api, this.handleError),
            projet: new FMResource<Projet>('mobile_PROJETS', rootStore.api, this.handleError),
            account: new FMResource<Account>('mobile_ACCOUNT', rootStore.api, this.handleError),
            activite: new FMResource<Activite>('mobile_ACTIVITES', rootStore.api, this.handleError),
        }
        const today = new Date()
        this.activeMonth = today.getMonth()
        this.activeYear = today.getFullYear()
        this.selectedDate = today
    }

    @action
    create(script) {
        this.resources.heure.create({
            fk_assignation: this.currentAccountKey(),
            StartDate: dateToFMDate(this.selectedDate),
            flag_actif: '1'
        },script).then(res => {
            console.log(res)
        })

    }

    @action
    async fetchHeures() {
        const assignation = this.currentAccountKey()
        const _this = this;

        if (!assignation) return
        await this.resources.heure.list({
            fk_assignation: [assignation],
            StartDate: [(this.activeMonth + 1) + '/' + this.activeYear],
            flag_actif: [1],
        })
            .then(() => {
                _this.notEmptyDates

            })
    }

    @action
    async delete(record: Record<Heure>) {
        const assignation = this.currentAccountKey()
        if (!assignation) return
        const fields: Partial<Heure> = {
            flag_actif: "0"
        }
        await this.resources.heure.save(record.id, fields)
        this.fetchHeures()
    }

    @action
    handleError(err: any) {
    }

    @action
    setYear(year: number) {
        this.activeYear = year
    }
    @action
    setMonth(month: number) {
        this.activeMonth = month
    }

    @action
    selectHeure(record: Record<Heure>) {
        this.selectedTimeId = record.id
        this.loadPickerData()
    }


    @computed
    get selectedHeure() {
        return this.resources.heure.records.find(record => record.id === this.selectedTimeId)
    }



    @action
    selectDate(date: Date) {
        this.selectedDate = date
    }

    stringifiedDate(date: Date) {
    }

    @computed
    get selectedHeures() {
        const records = this.resources.heure.records
            .filter(record => areSameDates(new Date(Date.parse(record.fields.StartDate)), this.selectedDate))
        return records
    }


    get getSelectedMonth() {
        const records = this.resources.heure.records
            .filter(record => areSameDates(new Date(Date.parse(record.fields.StartDate)), this.selectedDate))
        return records
    }

    @computed
    get notEmptyDates(): Date[] {
        const obj = this.resources.heure.groupByKey('StartDate')
        let stringDates: string[] = []
        for (let stringDate in obj) {
            stringDates.push(stringDate)
        }
        const dates = stringDates.map(stringDate => new Date(stringDate))
        return dates
    }

    @computed
    get heures() {
        const records = this.resources.heure.records
            .filter(record => areSameDates(new Date(Date.parse(record.fields.StartDate)), this.selectedDate))
        /*
        if (records.length > 0){
            debugger
        }
        */
        return records
    }

    @action
    async loadPickerData() {
        this.resources.projet.clear()
        this.resources.activite.clear()
        const fk_client = this.resources.heure.shownValue('fk_client')

        if (!fk_client) return
        await this.resources.projet.list({ fk_client: [fk_client] })

        const fk_projet = this.resources.heure.shownValue('fk_projet')
        if (!fk_projet) return
        await this.resources.activite.list({
            fk_client: [fk_client],
            fk_projet: [fk_projet]
        })
    }

    @action
    async loadConfigData() {
        await this.resources.client.list()
        await this.resources.account.list()
    }

    @computed
    get isConfigLoading() {
        return this.resources.client.isLoading
            || this.resources.projet.isLoading
            || this.resources.account.isLoading
    }

    currentAccountKey() {
        const username = this.root.authStore.extractToken()
        const name = username.split(':')[0]
        const user = this.resources.account.records.find(a => a.fields.UserAccountName === name)

        return user?.fields.pk_ID
    }

}

