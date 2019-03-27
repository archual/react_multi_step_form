import * as types from '../constants/ActionTypes';
import { initialState } from '../constants/configuration';

import update from 'react-addons-update';

export default function appState(state = initialState, action) {
  switch (action.type) {
    // Map reducers.
    case types.GET_DRAFTS:
      return update(state, {
        map: {
          drafts: {
            $merge: action.payload
          }
        }
      });
    case types.TOGGLE_DRAFT_SELECT:
      return update(state, {
        map: {
          selectedDraft: {
            $set: state.map.selectedDraft.nid === action.payload.nid ? false : action.payload
          }
        }
      });
    case types.SET_FILTER:
      return update(state, {
        map: {
          filter: {
            $set: action.payload
          }
        }
      });
    case types.GET_LOCATION:
      return update(state, {
        map: {
          center: {
            $set: action.payload.center
          },
          zoom: {
            $set: action.payload.zoom
          }
        }
      });
    case types.NEW_MARKER_POSITION:
      return update(state, {
        map: {
          drafts: {
            new: {
              [0]: {
                lat: {
                  $set: action.payload.lat
                },
                lng: {
                  $set: action.payload.lng
                }
              }
            }
          }
        }
      });
    case types.GET_DRAFT_DATA:
      return update(state, {
        map: {
          drafts: {
            [action.payload.status]: {
              $apply: drafts => {
                return drafts.map((draft) => {
                  return (draft.nid == action.payload.nid) ? { ...draft, ...action.payload } : draft;
                });
              }
            }
          }
        }
      });
    case types.ADD_DRAFT:
      return update(state, {
        map: {
          newDraft: {$set: true },
          drafts: {
            new: {
              $push: [{
                nid: 'new',
                title: 'You\'ve set the location for a new adventure. Click NEXT to begin the draft or close this dialog to adjust your selection.',
                draggable: true,
                lat: action.payload.lat,
                lng: action.payload.lng,
                status: 'new',
                editable: true
              }]
            }
          }
        }
      });
    case types.REMOVE_NEW_DRAFT:
      return update(state, {
        map: {
          newDraft: {$set: false},
          drafts: {
            new: {
              $set: []
            }
          },
          selectedDraft: {$set: false}
        }
      });
    case types.CHANGE_SELECTED_DRAFT_STATUS:
      return update(state, {
        map: {
          selectedDraft: {
            status: {
              $set: action.payload
            }
          }
        }
      });
    case types.GET_INFO_VALUES:
      return update(state, {
        formInfoValues: {
          $set: action.payload
        }
      });
    case types.GET_PHOTO_VALUES:
      return update(state, {
        formPhotoValues: {
          $set: action.payload
        }
      });
    case types.GET_SUB_PHOTO_VALUES:
      return update(state, {
        formSubPhotoValues: {
          $set: action.payload
        }
      });
    case types.GET_BODY_VALUES:
      return update(state, {
        formDescriptionValue: {
          $set: action.payload
        }
      });
    case types.GET_LOCATION_VALUES:
      return update(state, {
        formLocationValues: {
          $set: action.payload
        }
      });
    case types.GET_GPSFILES_VALUES:
      return update(state, {
        formGPSFilesValues: {
          $set: action.payload
        }
      });
    case types.GET_PARTNERS_VALUES:
      return update(state, {
        formPartnersValues: {
          $set: action.payload
        }
      });
    case types.GET_VIDEO_VALUES:
      return update(state, {
        formVideoValues: {
          $set: action.payload
        }
      });
    case types.GET_MAPS_VALUES:
      return update(state, {
        formMapsValues: {
          $set: action.payload
        }
      });
    // General info, content types, photo fields reducers.
    case types.GET_FIELDS:
      return update(state, {
        fields: {
          $set: action.payload
        }
      });
    case types.GET_VALUES:
      return update(state, {
        values: {
          $set: action.payload
        }
      });
    case types.GET_PHOTO_FIELDS:
      return update(state, {
        photos: {
          $set: action.payload
        }
      });
    case types.GET_LOCATION_FIELDS:
      return update(state, {
        fields: {
          $apply: fields => {
            return fields.map((field) => {
              let updatedField = field;
              if (field.name == 'group_transportation') {
                updatedField.fields = action.payload;
              }
              return updatedField;
            });
          }
        }
      });
      break;
    case types.GET_GPS_FIELDS:
      return update(state, {
        GPSFiles: {
          $set: action.payload
        }
      });
    case types.GET_VIDEO_FIELDS:
      return update(state, {
        video: {
          $set: action.payload
        }
      });
    case types.GET_MAPS_FIELDS:
      return update(state, {
        mapsFiles: {
          $set: action.payload
        }
      });
    // Update fields after validation.
    case types.UPDATE_FIELDS:
      return update(state, {
        fields: {
          $apply: fields => {
            return fields.map((field) => {
              let updatedField = field;
              if (field.name == action.payload.groupName) {
                updatedField.fields = action.payload.fields;
              }
              return updatedField;
            });
          }
        }
      });
    case types.UPDATE_LOCATION_FIELDS:
      return update(state, {
        formLocationValues: {
          $set: action.payload
        }
      });
    case types.UPDATE_GPS_FIELDS:
      return update(state, {
        formGPSFilesValues: {
          $set: action.payload
        }
      });

    case types.SET_MISSED_STEPS:
      return update(state, {
        validSteps: {
          $set: action.payload
        }
      });

    // Set status.
    case types.SET_SAVE_TYPE:
      return update(state, {
        status: {
          $set: action.payload
        }
      });

    // Set submit button flag.
    case types.SET_SUBMIT_BUTTON:
      return update(state, {
        submitButton: {
          $set: action.payload
        }
      });

    // Save data.
    case types.SAVE_DATA:
      return update(state, {
        submitData: {
          $merge: action.payload
        }
      });
    case types.UPDATE_DATA:
      return update(state, {
        submitData: {
          $set: action.payload
        }
      });
    case types.SAVE_FORM_VALUES:
      return update(state, {
        [action.payload.formName]: {
          $set: action.payload.values
        }
      });

    // Save initialState.
    case types.SAVE_INITIAL_STATE:
      return update(state, {
        initialState: {
          $set: action.payload
        }
      });

    // Reset Data.
    case types.RESET_DATA:
      return update(state, {
        photos: {
          $set: state.initialState.photos
        },
        GPSFiles: {
          $set: state.initialState.GPSFiles
        },
        video: {
          $set: state.initialState.video
        },
        mapsFiles: {
          $set: state.initialState.mapsFiles
        },
        formInfoValues: {
          $set: state.initialState.formInfoValues
        },
        formPhotoValues: {
          $set: {}
        },
        formDescriptionValue: {
          $set: {}
        },
        formLocationValues: {
          $set: {}
        },
        formGPSFilesValues: {
          $set: {}
        },
        formPartnersValues: {
          $set: {}
        },
        formVideoValues: {
          $set: {}
        },
        formMapsValues: {
          $set: {}
        },
        submitData: {
          $set: {}
        },
        status: {
          $set: ''
        },
        submitButton: {
          $set: false
        },
        buttonDisabled: {
          $set: false
        },
        buttonsBusy: {
          $set: 0
        }
      });

    // Reset drafts.
    case types.RESET_DRAFTS:
      return update(state, {
        $set: initialState
      });

    case types.TOGGLE_BUTTONS:
      return update(state, {
        buttonsDisabled: {
          $set: action.payload
        }
      });

    case types.SET_BUTTONS_BUSY:
      return update(state, {
        buttonsBusy: {
          $set: action.payload
        }
      });

    // Set trobber when saving.
    case types.SET_THROBBER:
      return update(state, {
        loading: {
          $set: action.payload
        }
      });

    default:
      return state;
  }
}