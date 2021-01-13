import AuthStore from './AuthStore';

import TimeStore from './TimeStore'
import { create } from 'mobx-persist'
import { AsyncStorage } from 'react-native';
//import FMClient from '../services/FMClient/Client';
import FilemakerClient from 'filemaker-api';

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true
})

export class RootStore {

  timeStore: TimeStore;
  authStore: AuthStore;
  api: FilemakerClient;

  constructor() {
    this.authStore = new AuthStore(this);
    this.api = new FilemakerClient('vhmsoft.com', 'vhmsoft_Lyes', this.authStore.getAuthHeader.bind(this.authStore))
    this.timeStore = new TimeStore(this);
    hydrate('auth', this.authStore)
  }
}

export const rootStore = new RootStore();

const stores = {
  rootStore,
  authStore: rootStore.authStore,
  timeStore: rootStore.timeStore,
}

export default stores;

