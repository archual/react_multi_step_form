import { requiredError } from '../../constants/configuration';
import { showAlert } from '../alerts';

export const validateForm = (appState, submitData, form, handlers, history, pathname) => {
  let submittedData = {}, validationResult = true,
    stepsResults = {
      info: true,
      photos: true,
      description: true,
      location: true
    };
  const { fields } = appState;

  // Prepare submitData (from appState and from current form values).
  submittedData = {...submittedData, ...appState.formInfoValues, ...appState.formPhotoValues, ...appState.formDescriptionValue,
    ...appState.formLocationValues,...submitData};

  for (let formName in form) {
    submittedData = {...submittedData, ...form[formName].values};
  }

  // General info step.
  let infoFields = fields.length ? fields.filter(e => e.name === 'group_adventure') : [];
  infoFields = infoFields[0] ? infoFields[0].fields : [];

  let validationResults = checkAndUpdateField(infoFields, submittedData);

  stepsResults.info = validationResults.result;

  if (!stepsResults.info) {
    validationResult = false;
    handlers.updateFields(validationResults.fields, 'group_adventure');
  }

  // Photos step.
  // Description.
  const DescriptionGroup = fields.filter(e => e.name === 'group_description');
  const body = DescriptionGroup[0].fields.filter(e => e.name === 'body');
  validationResults = checkAndUpdateField(body, submittedData);

  stepsResults.description = validationResults.result;

  if (!stepsResults.description) {
    validationResult = false;
    handlers.updateFields(validationResults.fields, 'group_description');
  }

  // location.
  let locationFields = fields.length ? fields.filter(e => e.name === 'group_transportation') : [];
  locationFields = locationFields[0] ? locationFields[0].fields : [];
  locationFields = locationFields.filter(e => e.name !== 'field_gpx_file_upload');

  validationResults = checkAndUpdateField(locationFields, submittedData);

  stepsResults.location = validationResults.result;

  validationResult = !stepsResults.location ? false : validationResult;
  handlers.updateFields(validationResults.fields, 'group_transportation');

  // Mark steps with missed fields.
  handlers.updateSteps(stepsResults);

  if (!validationResult) {
    showAlert('Required info is missing. Please check highlighted fields.', 'error');
  }

  return validationResult;
};

let fieldsVisibility = {};

// Check visibility of the field.
const isVisible = (field, fieldValue) => {

  let visible = true;

  if (field.states) {
    for (let stateType in field.states) {
      switch (stateType) {
        case 'visible':
          visible = false;

          for (let stateName in field.states[stateType]) {
            let subVis = false;

            if (field.states[stateType][stateName].length && !field.states[stateType][stateName][0].length) {
              if (field.states[stateType][stateName][0].value + '' === fieldValue[stateName] + ''
                && fieldValue[stateName]
                && fieldsVisibility[stateName]) {
                subVis = true;
              }
              else {
                // Try to check if this state is checkboxes multivalue.
                let fieldName = `${stateName}-${field.states[stateType][stateName][0].value}`;
                if (fieldValue[fieldName]) {
                  subVis = true;
                }
              }
            }
            else if (field.states[stateType][stateName][0].length) {
              field.states[stateType][stateName][0].some((condition) => {
                if (condition.value + '' === fieldValue[stateName] + ''
                  && fieldValue[stateName]
                  && fieldsVisibility[stateName]) {
                  subVis = true;
                  return true;
                }
                else {
                  // Try to check if this state is checkboxes multivalue.
                  let fieldName = `${stateName}-${condition.value}`;
                  if (fieldValue[fieldName]) {
                    subVis = true;
                    return true;
                  }
                }
              });
            }

            visible = visible || subVis;
          }
          break;
        case '!visible':
          visible = false;

          for (let stateName in field.states[stateType]) {
            let subVis = true;

            if (field.states[stateType][stateName].length && !field.states[stateType][stateName][0].length) {
              if ((field.states[stateType][stateName][0].value + '' === fieldValue[stateName] + ''
                  || (!fieldValue[stateName] && field.states[stateType][stateName][0].value === '_none'))
                && fieldsVisibility[stateName]) {
                subVis = false;
              }
            }
            else if (field.states[stateType][stateName][0].length) {
              field.states[stateType][stateName].length && field.states[stateType][stateName][0].some((condition) => {
                if ((condition.value + '' === fieldValue[stateName] + ''
                    || (!fieldValue[stateName] && condition.value === '_none'))
                  && fieldsVisibility[stateName]) {
                  subVis = false;
                  return true;
                }
              });
            }

            visible = visible || subVis;
          }
          break;
        default:
          visible = true;
      }
    }
  }

  return visible;
};

// Recursive function for updating fields.
const checkAndUpdateField = (fields, submitData, treeName) => {
  let result = true;
  let sortedFields = fields.sort((a, b) => a.weight - b.weight);

  let checkedFields = sortedFields.map((field, index) => {
    const name = treeName ? `${treeName}-${field.name}` : field.name || '';
    let updatedField = Object.assign({}, field);
    updatedField.error && delete updatedField.error;

    // Check visibility by states.
    if (field.states) {
      if (!isVisible(field, submitData)) {
        fieldsVisibility[field.name] = false;
        return updatedField;
      }
    }

    fieldsVisibility[field.name] = true;

    if (!field.required) return updatedField;

    switch (field.type) {
      case 'fieldset':
      case 'wrapper':
        // Call recursion.
        let validationResults = checkAndUpdateField(field.fields, submitData, field.tree && name);
        result = result && validationResults.result;
        updatedField.fields = validationResults.fields;
        break;
      case 'checkbox':
      case 'radiobuttons':
      case 'radioswitchers':
        if (submitData[name] == null) {
          result = false;
          updatedField.error = requiredError;
        }
        break;
      case 'daterange':
      case 'hierarchical':
        if (!submitData[name]) {
          result = false;
          updatedField.error = requiredError;
        }
        break;
      case 'checkboxes':
      case 'checkboxes-tree':
        let valid = false;
        field.options.some((option, index) => {
          if (submitData[`${name}-${option.key}`] != null) {
            valid = true;
            return true;
          }
        });

        if (!valid) {
          result = false;
          updatedField.error = requiredError;
        }
        break;
      case 'date':
      case 'text':
      case 'number':
      case 'phone':
      case 'select':
      case 'textarea':
        if (submitData[name] == null) {
          result = false;
          updatedField.error = requiredError;
        }
        break;
      case 'image':
        break;
    }

    return updatedField;
  });

  return {
    fields: checkedFields,
    result
  }
};
