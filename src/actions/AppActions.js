import React from 'react';
import * as types from '../constants/ActionTypes';
import { getFieldsValues } from '../utils/formBuilder/getFieldsValues';
import { showAlert } from '../utils/alerts';
import history from '../utils/history';
import getObjectValue from '../utils/getObjectValue';
import { message } from 'antd';

// Map/drafts actions.
export function getDrafts() {
  // Get user's drafts.
  return (dispatch, getState) => {
    dispatch(toggleButtons(true));
    const state = getState();
    const loading = message.loading('Loading...', 0);
    dispatch(setThrobber({ state: true }));
    // Ajax request to drafts.
    return fetch(`/api/adventures`, {
      method: 'get',
      credentials: 'same-origin'
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatch(receiveDrafts(responseData));
        // Save initial state.
        dispatch(setInitialState());
        dispatch(toggleButtons(false));

        // Update selected draft, if we have one.
        if (state.appState.map.selectedDraft) {
          const nid = state.appState.map.selectedDraft.nid;

          if (typeof responseData === 'object') {
            for (let status in responseData) {
              if (responseData.hasOwnProperty(status)) {
                if (responseData[status].some(e => e.nid === nid)) {
                  dispatch(changeSelectedDraftStatus(status));
                  break;
                }
              }
            }
          }
        }

        loading(loading);
        dispatch(setThrobber({ state: false }));
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error);
        dispatch(toggleButtons(false));
        loading(loading);
        dispatch(setThrobber({ state: false }));
      });
  };
}

// Save initial state for using in future.
export function setInitialState() {
  return (dispatch, getState) => {
    let state = getState();
    if (state.appState.initialState) {
      dispatch(saveInitialState(state.appState.initialState));
    }
    else {
      dispatch(saveInitialState(state.appState));
    }
  }
}

export function getDraftData(nid) {
  // Get current draft data.
  return (dispatch, getState) => {
    dispatch(resetData());
    dispatch(toggleButtons(true));
    const loading = message.loading('Loading...', 0);
    dispatch(setThrobber({ state: true }));

    return fetch(`/api/adventures/${nid}`, {
      method: 'get',
      credentials: 'same-origin'
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatch(receiveDraftData(responseData));
        dispatch(selectDraft(responseData));
        dispatch(toggleButtons(false));
        dispatch(getDraftFieldsValues(nid));
        loading(loading);
        dispatch(setThrobber({ state: false }));
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error);
        dispatch(toggleButtons(false));
        loading(loading);
        dispatch(setThrobber({ state: false }));
      });
  };
}

export function receiveDrafts(drafts) {
  return {
    type: types.GET_DRAFTS,
    payload: drafts
  }
}

export function receiveDraftData(draft) {
  return {
    type: types.GET_DRAFT_DATA,
    payload: draft
  }
}

// Filters drafts by status.
export function setFilter(filter) {
  return {
    type: types.SET_FILTER,
    payload: filter
  }
}

// Select draft.
export function selectDraft(draft) {
  return (dispatch, getState) => {
    const state = getState();

    dispatch(toggleButtons(true));

    if (draft.nid !== 'new') {
      dispatch(resetData());
      dispatch(getDraftFields());
    }

    // Save values for location form.
    if (!state.appState.submitData['title']) {
      let locationValues = {};
      locationValues['field_geo_location-lat'] = draft.lat;
      locationValues['field_geo_location-lon'] = draft.lng;
      let required = {};
      required['title'] = draft.nid === 'new' ? '' : draft.title;

      const submitValues = {...locationValues, ...required};
      dispatch(saveData(submitValues));
      dispatch(receiveLocationValues(locationValues));
    }

    dispatch(getDraftFields());

    dispatch(setSelectDraftData(draft));
    dispatch(toggleButtons(false));
  };
}


export function setSelectDraftData(draft) {
  return {
    type: types.TOGGLE_DRAFT_SELECT,
    payload: draft
  }
}

// Re-center map.
export function getLocation(center, zoom) {
  return {
    type: types.GET_LOCATION,
    payload: {
      center,
      zoom
    }
  }
}

// Change marker position, when user moves it, and save for location form.
export function newMarkerPosition(position) {
  return (dispatch, getState) => {
    dispatch(setNewMarkerPosition(position));
    // Save values for location form.
    let locationValues = {};
    locationValues['field_geo_location-lat'] = position.lat;
    locationValues['field_geo_location-lon'] = position.lng;
    dispatch(saveData(locationValues));
    dispatch(receiveLocationValues(locationValues));
  };
}

export function setNewMarkerPosition(position) {
  return {
    type: types.NEW_MARKER_POSITION,
    payload: position
  }
}

// Add new draft.
export function addDraft(position) {
  return (dispatch, getState) => {
    dispatch(resetData());
    dispatch(getDraftFields());

    dispatch(addNewDraft(position));
    // Save values for location form.
    let locationValues = {};
    locationValues['field_geo_location-lat'] = position.lat;
    locationValues['field_geo_location-lon'] = position.lng;
    dispatch(saveData(locationValues));
    dispatch(receiveLocationValues(locationValues));
  };
}

export function addNewDraft(position) {
  return {
    type: types.ADD_DRAFT,
    payload: position
  }
}

// Remove new draft.
export function removeNewDraft() {
  return {
    type: types.REMOVE_NEW_DRAFT
  }
}

// Change selected draft status.
export function changeSelectedDraftStatus(status) {
  return {
    type: types.CHANGE_SELECTED_DRAFT_STATUS,
    payload: status
  }
}

// Fields actions.
// Get fields.
export function getDraftFields(nid) {
  return (dispatch, getState) => {
    dispatch(toggleButtons(true));
    const state = getState();

    const DrupalSettings = getObjectValue(['Drupal', 'settings', 'adventure'], window);
    const fields = DrupalSettings ? DrupalSettings.fields : false;
    const default_values = DrupalSettings ? DrupalSettings.default_values : false;
    const isAdmin = DrupalSettings ? DrupalSettings.admin : false;

    if (fields) {
      dispatch(receiveFields(fields));

      // Set contributor and other fields values for new adventure.
      if (state.appState.map.newDraft && !state.appState.formInfoValues) {
        // Get default values from Drupal.settings.
        if (default_values) {
          let infoFields = fields.length ? fields.filter(e => e.name === 'group_adventure') : [];
          infoFields = infoFields[0].fields;

          let infoFieldsValues = getFieldsValues(infoFields, defaultValues);
          dispatch(receiveInfoFormValues(infoFieldsValues));
        }
      }

      // Photos fields.s
      if (!state.appState.photos) {
        let photoGroups = fields.filter(e => e.name === 'group_photos');
        dispatch(receivePhotosFields(photoGroups[0].fields));
      }

      // Location files.
      if (!state.appState.GPSFiles) {
        let GPSGroup = fields.filter(e => e.name === 'group_transportation');

        let GPSFilesGroup = GPSGroup[0].fields.filter(e => e.name === 'field_gpx_file_upload');
        GPSFilesGroup = GPSFilesGroup[0];

        dispatch(receiveGPSFields(GPSFilesGroup));
      }

      // Fields for admin user.
      if (isAdmin) {
        // Video fields.
        if (!state.appState.video) {
          let videoGroup = fields.filter(e => e.name === 'group_video');
          dispatch(receiveVideoFields(videoGroup[0].fields));
        }

        // Maps files.
        if (!state.appState.mapsFiles) {
          let mapsGroup = fields.filter(e => e.name === 'group_maps');
          let mapsFilesGroup = mapsGroup[0].fields.filter(e => e.name === 'field_maps');
          dispatch(receiveMapsFields(mapsFilesGroup[0]));
        }
      }
    }

    if (!state.appState.map.selectedDraft) {
      dispatch(saveInitialState(state.appState));
    }

    // Get draft data, if this function called from loader.
    if (nid) {
      dispatch(getDraftData(nid));
    }

    dispatch(toggleButtons(false));
  }
}

export function getDraftFieldsValues(nid) {
  return (dispatch, getState) => {
    dispatch(toggleButtons(true));
    const state = getState();
    // Show throbber.
    const loading = message.loading('Loading...', 0);
    dispatch(setThrobber({ state: true }));


    return fetch(`/api/adventures/${nid}/values`, {
      method: 'get',
      credentials: 'same-origin'
    })
      .then((response) => response.json())
      .then((responseData) => {
        const values = responseData;

        // Save values to store, that get access in multivalue fields.
        dispatch(receiveValues(values));


        // Save critical data to submitDate.
        let locationValues = {};
        locationValues['field_geo_location-lat'] = values.field_geo_location ? values.field_geo_location.lat.value : '';
        locationValues['field_geo_location-lon'] = values.field_geo_location ? values.field_geo_location.lon.value : '';

        let required = {};
        required['title'] = values.title ? values.title.value : '';
        required['field_date'] = values.field_date ? values.field_date.value : '';

        const submitValues = {...locationValues, ...required};
        dispatch(saveData(submitValues));

        // Get fields.
        let fields = [];
        if (Drupal.settings.adventure && Drupal.settings.adventure.fields) {
          fields = Drupal.settings.adventure.fields;
        }

        // Info values.
        let infoFields = fields.length ? fields.filter(e => e.name === 'group_adventure') : [];
        infoFields = infoFields[0].fields;

        let infoFieldsValues = getFieldsValues(infoFields, values);
        dispatch(receiveInfoFormValues(infoFieldsValues));

        // Photos.
        let photoGroups = fields.filter(e => e.name === 'group_photos');

        // Get values for photos.
        let photoValues = {};

        photoGroups[0].fields.forEach((group, index) => {
          photoValues[group.name] = getFieldsValues([group], values);
        });
        dispatch(receivePhotoFormValues(photoValues));

        // SubPhoto values.
        let subPhotoFields = fields.length ? fields.filter(e => e.name === 'group_additional') : [];

        let subPhotoFieldsValues = getFieldsValues(subPhotoFields[0].fields, values);
        dispatch(receiveAdditionalFormValues(subPhotoFieldsValues));

        // Description field.
        const descriptionGroup = fields.filter(e => e.name === 'group_description');
        let body = descriptionGroup[0].fields.filter(e => e.name === 'body');
        let descriptionValue = getFieldsValues(body, values);
        dispatch(receiveBodyValues(descriptionValue));

        // Locations fields.
        let locationGroup = fields.filter(e => e.name === 'group_transportation');
        let locationFields = locationGroup[0].fields.filter(e => e.name !== 'field_gpx_file_upload');

        let locationFieldsValues = getFieldsValues(locationFields, values);
        dispatch(receiveLocationValues(locationFieldsValues));

        // GPSFiles.
        let GPSGroup = fields.filter(e => e.name === 'group_transportation');
        let GPSFilesGroup = GPSGroup[0].fields.filter(e => e.name === 'field_gpx_file_upload');

        // Get values for GPSFiles.
        const GPSFilesValues = getFieldsValues(GPSFilesGroup, values);
        dispatch(receiveGPSFilesFormValues(GPSFilesValues));

        // Stop, if user is not admin.
        if (!window.Drupal.settings.adventure.admin) {
          loading(loading);
          dispatch(setThrobber({ state: false }));
          dispatch(toggleButtons(false));
          return;
        }

        // Partners form.
        let partnersFields = fields.length ? fields.filter(e => e.name === 'group_partners') : [];
        let partnersFieldsValues = getFieldsValues(partnersFields[0].fields, values);
        dispatch(receivePartnersFormValues(partnersFieldsValues));

        // Video fields.
        let videoGroup = fields.filter(e => e.name === 'group_video');
        let videoFieldsValues = getFieldsValues(videoGroup[0].fields, values);
        dispatch(receiveVideoFormValues(videoFieldsValues));

        // Get values for maps form.
        const mapsFields = fields.length ? fields.filter(e => e.name === 'group_maps') : [];

        const mapsSimpleFields = mapsFields[0].fields.filter(e => e.name !== 'field_maps');
        const mapsFilesGroup = mapsFields[0].fields.filter(e => e.name === 'field_maps');


        const mapsFieldsValues = getFieldsValues(mapsSimpleFields, values);
        const mapsGroupsValues = getFieldsValues(mapsFilesGroup, values);
        const mapsValues = {...{}, ...mapsFieldsValues, ...mapsGroupsValues};

        dispatch(receiveMapsValues(mapsValues));

        loading(loading);
        dispatch(setThrobber({ state: false }));
        dispatch(toggleButtons(false));
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error);
        loading(loading);
        dispatch(setThrobber({ state: false }));
        dispatch(toggleButtons(false));
      });
  }
}

export function setDraftData() {
  return (dispatch, getState) => {
    dispatch(toggleButtons(true));
    // Show throbber.
    const loading = message.loading('Saving...', 0);
    dispatch(setThrobber({ state: true }));

    const state = getState();
    // Post data from store to back-end.
    let submitData = state.appState.submitData;
    submitData = {...submitData, ...{status: state.appState.status}};
    const nid = state.appState.map.selectedDraft.nid === 'new' ? '' : `/${state.appState.map.selectedDraft.nid}`;

    return fetch(`/api/adventures${nid}`, {
      method: nid ? 'put' : 'post',
      credentials: 'same-origin',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(submitData)
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.nid) {
          if (nid === '') {
            dispatch(getDraftData(responseData.nid));
            dispatch(removeNewDraft());
            // Change URL to new one with nid.
            const { pathname } = history.location;
            const currentStep = pathname.split('/').pop();
            history.push(`/submityouradventure/edit/${responseData.nid}/${currentStep}`);
          }
          else {
            dispatch(getDraftFieldsValues(responseData.nid));
          }
        }
        loading(loading);
        dispatch(setThrobber({ state: false }));

        // Check status and show message or redirect to new draft.
        switch (state.appState.status) {
          case 'save_create':
            dispatch(resetDrafts());
            // Show message.
            showAlert(`Draft saved. You can create new one!`);
            // Save submit status for remove checking about leaving page.
            if (window.Drupal.settings.adventure) {
              window.Drupal.settings.adventure.submit = true;
            }
            window.location = '/submityouradventure';
            break;
          case 'stub_create':
            dispatch(resetDrafts());
            // Show message.
            showAlert(`Stub saved. You can create new one!`);
            // Save submit status for remove checking about leaving page.
            if (window.Drupal.settings.adventure) {
              window.Drupal.settings.adventure.submit = true;
            }
            window.location = '/submityouradventure';
            break;
          case 'save':
            showAlert(`Draft saved.`);
            dispatch(toggleButtons(false));
            break;
          case 'needs_review':
            showAlert(`Saved as Unedited.`);
            dispatch(toggleButtons(false));
            break;
          case 'edited_once':
            showAlert(`Saved as Edited Once.`);
            dispatch(toggleButtons(false));
            break;
          case 'submit':
          case 'published':
            if (responseData.nid) {
              // Save submit status for remove checking about leaving page.
              if (window.Drupal.settings.adventure) {
                window.Drupal.settings.adventure.submit = true;
              }

              window.location = `/node/${responseData.nid}`;
            }
            else {
              showAlert(`Draft saving error.`, `error`);
            }
            dispatch(toggleButtons(false));
            break;
          case 'back':
            if (responseData.nid) {
              // Save submit status for remove checking about leaving page.
              if (window.Drupal.settings.adventure) {
                window.Drupal.settings.adventure.submit = true;
              }

              window.location = `/admin/workbench`;
            }
            break;
          case 'preview':
            if (responseData.nid) {
              showAlert(`Draft saved.`);
              window.reactPreviewPopup.location = `/node/${responseData.nid}`;
            }
            else {
              showAlert(`Draft saving error.`, `error`);
            }
            dispatch(toggleButtons(false));
            break;
          default:
            showAlert(`Draft saved.`);
            dispatch(toggleButtons(false));
        }
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error);
        loading(loading);
        dispatch(setThrobber({ state: false }));
        dispatch(toggleButtons(false));
        showAlert(`Draft saving error.`, 'error');
      });
  };
}

export function receiveFields(fields) {
  return {
    type: types.GET_FIELDS,
    payload: fields
  }
}

export function receiveValues(values) {
  return {
    type: types.GET_VALUES,
    payload: values
  }
}

export function receivePhotosFields(fields) {
  return {
    type: types.GET_PHOTO_FIELDS,
    payload: fields
  }
}

export function receiveGPSFields(fields) {
  return {
    type: types.GET_GPS_FIELDS,
    payload: fields
  }
}

export function receiveVideoFields(fields) {
  return {
    type: types.GET_VIDEO_FIELDS,
    payload: fields
  }
}

export function receiveMapsFields(fields) {
  return {
    type: types.GET_MAPS_FIELDS,
    payload: fields
  }
}

// Form values.
export function receiveInfoFormValues(values) {
  return {
    type: types.GET_INFO_VALUES,
    payload: values
  }
}

export function receivePhotoFormValues(values) {
  return {
    type: types.GET_PHOTO_VALUES,
    payload: values
  }
}

export function receiveAdditionalFormValues(values) {
  return {
    type: types.GET_SUB_PHOTO_VALUES,
    payload: values
  }
}

export function receiveBodyValues(values) {
  return {
    type: types.GET_BODY_VALUES,
    payload: values
  }
}

export function receiveLocationFields(fields) {
  return {
    type: types.GET_LOCATION_FIELDS,
    payload: fields
  }
}

export function receiveLocationValues(values) {
  return {
    type: types.GET_LOCATION_VALUES,
    payload: values
  }
}

export function receiveGPSFilesFormValues(values) {
  return {
    type: types.GET_GPSFILES_VALUES,
    payload: values
  }
}

export function receivePartnersFormValues(values) {
  return {
    type: types.GET_PARTNERS_VALUES,
    payload: values
  }
}

export function receiveVideoFormValues(values) {
  return {
    type: types.GET_VIDEO_VALUES,
    payload: values
  }
}

export function receiveMapsValues(values) {
  return {
    type: types.GET_MAPS_VALUES,
    payload: values
  }
}

// Actions for photos section.
export function updatePhotos(photos, sectionName) {
  return (dispatch, getState) => {
    const state = getState();

    // Update photoValues store.
    const photoValues = state.appState.formPhotoValues || {};
    const formValues = state.form.photos.values || {};
    let updatedPhotoValues = JSON.parse(JSON.stringify(photoValues));
    updatedPhotoValues[sectionName] = {};

    photos.forEach((photo) => {
      const photoValue = photoValues[sectionName] ? (photoValues[sectionName][photo.name] || {}) : {};
      updatedPhotoValues[sectionName][photo.name] = JSON.parse(JSON.stringify(photoValue));

      photo.fields.forEach((field, index) => {
        const formFieldValue = getObjectValue([sectionName, photo.name, `${photo.name}-${field.name}`], formValues);

        updatedPhotoValues[sectionName][photo.name][`${photo.name}-${field.name}`] =
          field.value != null ? field.value : formFieldValue;

        if (field.name === 'link' && field.value != null) {
          const additional = {
            fileName: field.fileName,
            thumbnail: field.thumbnail,
            preview: field.preview
          };
          updatedPhotoValues[sectionName][photo.name][`${photo.name}-link_additional`] = additional;
        }
      });
    });

    dispatch(receivePhotoFormValues(updatedPhotoValues));
  }
}

// Files actions for location GPS files.
export function updateGPSFiles(files) {
  return (dispatch, getState) => {
    const state = getState();

    // Update GPSFiles store.
    const { formGPSFilesValues } = state.appState;

    let updatedGPSValues = {};

    files.forEach((file) => {
      updatedGPSValues[file.name] = formGPSFilesValues ? (formGPSFilesValues[file.name] || {}) : {};

      file.fields.forEach((field, index) => {
        if (field.value != null) {
          updatedGPSValues[file.name][`${file.name}-${field.name}`] = field.value;
          if (field.name === 'link') {
            const additional = {
              fileName: field.fileName
            };
            updatedGPSValues[file.name][`${file.name}-${field.name}_additional`] = additional;
          }
        }
      });
    });

    dispatch(receiveGPSFilesFormValues(updatedGPSValues));
  }
}

// Get fields values (recursion function).
function getMutivalueFieldsValues(field, initialValues = {}, treeName, updatedFieldName) {
  let updatedValues = {};

  field.fields.forEach((subField) => {
    const fieldName = treeName ? `${treeName}-${subField.name}` : `${field.name}-${subField.name}`;

    if (subField.tree) {
      updatedValues = {
        ...updatedValues,
        ...getMutivalueFieldsValues(subField, initialValues, fieldName, `${updatedFieldName}-${subField.name}`)
      };
    }
    else {
      if (initialValues[fieldName]) {
        updatedValues[`${updatedFieldName}-${subField.name}`] = initialValues[fieldName];
      }
      if (subField.name === 'delta') {
        updatedValues[`${updatedFieldName}-${subField.name}`] = subField.value != null  ? subField.value : initialValues[fieldName];
      }
    }
  });
  return updatedValues;
}

// Multivalue actions.
export function updateMultiValues(baseField, fields, formName) {
  return (dispatch, getState) => {
    const state = getState();

    const { form } = state;
    const values = form[formName].values;

    let updatedValues = {};

    for (let field in values) {
      if (field.indexOf(baseField.name) !== 0) {
        updatedValues[field] = values[field];
      }
    }

    fields.forEach((field, index) => {
      updatedValues[`${baseField.name}-${index}`] = getMutivalueFieldsValues(field, values[field.name], false, `${baseField.name}-${index}`);
    });


    switch (formName) {
      case 'info':
        dispatch(receiveInfoFormValues(infoFieldsValues));
        break;
      case 'photos':
        dispatch(receivePhotoFormValues(photoValues));
        break;
      case 'subphotos':
        dispatch(receiveAdditionalFormValues(subPhotoFieldsValues));
        break;
      case 'description':
        dispatch(receiveBodyValues(descriptionValue));
        break;
      case 'location':
        dispatch(receiveLocationValues(locationFieldsValues));
        break;
      case 'location-files':
        dispatch(receiveGPSFilesFormValues(GPSFilesValues));
        break;
      case 'partners':
        dispatch(receivePartnersFormValues(partnersFieldsValues));
        break;
      case 'video':
        dispatch(receiveVideoFormValues(updatedValues));
        break;
      case 'maps':
        break;
    }
  }
}

// Files actions for Maps files.
export function updateMaps(field, sectionName, remove) {
  return (dispatch, getState) => {
    const state = getState();

    const { values } = state.form.maps;

    let updatedMapsValues = Object.assign({}, values);

    if (!field) {
      delete updatedMapsValues[sectionName];
    }
    else if (field.name === sectionName) {
      updatedMapsValues[sectionName] = values ? (values[sectionName] || {}) : {};

      field.fields.forEach((subField) => {
        if (subField.value != null) {
          updatedMapsValues[sectionName][`${sectionName}-${subField.name}`] = subField.value;
        }
      });
    }
    else {
      updatedMapsValues[sectionName] = values ? (values[sectionName] || {}) : {};

      field.fields.forEach((subField) => {
        if (remove) {
          updatedMapsValues[sectionName][`${sectionName}-${field.name}-${subField.name}`] = null;

          if (subField.name === 'link') {
            delete updatedMapsValues[sectionName][`${sectionName}-${field.name}-${subField.name}_additional`];
          }
        }
        else if (subField.value != null) {
          updatedMapsValues[sectionName][`${sectionName}-${field.name}-${subField.name}`] = subField.value;

          if (subField.name === 'link') {
            updatedMapsValues[sectionName][`${sectionName}-${field.name}-${subField.name}_additional`] = {
              fileName: field.fileName
            };
          }
        }
      });
    }

    dispatch(receiveMapsValues(updatedMapsValues));
  }
}

// Save step values initialValues, when step changes without submit.
export function saveFormValues(values = {}, formName, flatValues = false) {
  return (dispatch, getState) => {
    dispatch(saveValues(values, formName));

    dispatch(saveData(flatValues ? flatValues : values));
  }
}

// Save step values to initialValues.
export function saveValues(values, formName) {
  return {
    type: types.SAVE_FORM_VALUES,
    payload: {
      values,
      formName
    }
  }
}

// Validation actions.
// Update fields after validation.
export function updateFields(fields, groupName) {
  return {
    type: types.UPDATE_FIELDS,
    payload: {
      fields,
      groupName
    }
  }
}

// Set steps validation results.
export function updateSteps(steps) {
  return {
    type: types.SET_MISSED_STEPS,
    payload: steps
  }
}

// Set save type from admin button.
export function setStatus(type) {
  return {
    type: types.SET_SAVE_TYPE,
    payload: type
  }
}

// Save step data to submitData.
export function saveData(data) {
  return {
    type: types.SAVE_DATA,
    payload: data
  }
}

// Save step data to submitData.
export function updateData(data) {
  return {
    type: types.UPDATE_DATA,
    payload: data
  }
}

// Save initial state.
export function saveInitialState(state) {
  return {
    type: types.SAVE_INITIAL_STATE,
    payload: state
  }
}

// Reset data (when change draft).
export function resetData() {
  return {
    type: types.RESET_DATA,
  }
}

// Reset drafts (when submit or submit and create another button clicked).
export function resetDrafts() {
  return {
    type: types.RESET_DRAFTS,
  }
}

// Toggle buttons, while XHR working.
export function toggleButtons(status) {
  return (dispatch, getState) => {
    const state = getState();
    let busy = state.appState.buttonsBusy;
    if (status) {
      busy++;

      dispatch({
        type: types.TOGGLE_BUTTONS,
        payload: status
      });
    }
    else {
      busy--;
      if (busy < 1) {
        dispatch({
          type: types.TOGGLE_BUTTONS,
          payload: status
        });
      }
    }

    dispatch({
      type: types.SET_BUTTONS_BUSY,
      payload: busy
    });
  }
}

// Set throbber.
export function setThrobber(state) {
  return {
    type: types.SET_THROBBER,
    payload: state
  }
}