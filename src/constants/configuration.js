// Configurations constants.
import getObjectValue from '../utils/getObjectValue';

const DrupalSettings = getObjectValue(['Drupal', 'settings', 'adventure'], window);

const configuration = {
  appVer: "1.2.0", // Application version.
  userName: DrupalSettings ? DrupalSettings.user : '',
  maxFileSize: 10485760, // 10MB.
};

export const nextStep = {
  'submityouradventure': 'info',
  'info': 'photos',
  'photos': 'description',
  'description': 'location',
  'location': 'partners',
  'partners': 'videos',
  'videos': 'maps'
};

export const appVer = configuration.appVer;
export const userName = configuration.userName;
export const maxFileSize = configuration.maxFileSize;

export const requiredError = 'Required for submit';

export const initialState = {
  map: {
    selectedDraft: false,
    newDraft: false,
    filter: false,
    drafts: {
      published: [],
      claimed: [],
      unclaimed: [],
      my_draft: [],
      my_pending: [],
      priority: [],
      stub: [],
      new: []
    },
    center: {
      lat: 34.052235,
      lng: -118.243683
    }
  },
  fields: [],
  values: [],
  submitData: {},
  status: '',
  submitButton: false,
  validSteps: {
    info: true,
    photos: true,
    description: true,
    location: true
  },
  appVer: configuration.appVer,
  buttonsDisabled: false,
  buttonsBusy: 0,
  loading: false
};