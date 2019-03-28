// Visibility index.
let fieldsVisibility = {};

// Currying.
const getFieldValue = (form = {}) => {
  return (name) => {
    return form.values ? form.values[name] : false;
  };
};

// Check visibility of the field.
const isVisible = (field, form) => {
  const fieldValue = getFieldValue(form);

  let visible = true;

  if (field.states) {
    for (let stateType in field.states) {
      switch (stateType) {
        case 'visible':
          visible = false;

          for (let stateName in field.states[stateType]) {
            let subVis = false;

            if (field.states[stateType][stateName].length && !field.states[stateType][stateName][0].length) {
              if (field.states[stateType][stateName][0].value + '' === fieldValue(stateName) + ''
                && fieldValue(stateName)
                && fieldsVisibility[stateName]) {
                subVis = true;
              }
              else {
                // Try to check if this state is checkboxes multivalue.
                let fieldName = `${stateName}-${field.states[stateType][stateName][0].value}`;
                if (fieldValue(fieldName)
                  && fieldsVisibility[stateName]) {
                  subVis = true;
                }
              }
            }
            else if (field.states[stateType][stateName][0].length) {
              field.states[stateType][stateName][0].some((condition) => {
                if (condition.value + '' === fieldValue(stateName) + ''
                  && fieldValue(stateName)
                  && fieldsVisibility[stateName]) {
                  subVis = true;
                  return true;
                }
                else {
                  // Try to check if this state is checkboxes multivalue.
                  let fieldName = `${stateName}-${condition.value}`;
                  if (fieldValue(fieldName)) {
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
              if ((field.states[stateType][stateName][0].value + '' === fieldValue(stateName) + ''
                  || (!fieldValue(stateName) && field.states[stateType][stateName][0].value === '_none'))
                && fieldsVisibility[stateName]) {
                subVis = false;
              }
            }
            else if (field.states[stateType][stateName][0].length) {
              field.states[stateType][stateName].length && field.states[stateType][stateName][0].some((condition) => {
                if ((condition.value + '' === fieldValue(stateName) + ''
                    || (!fieldValue(stateName) && condition.value === '_none'))
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

// Recursive function for filter fields by visibility.
const getVisibleFields = (fields = [], form = {}, treeName = '') => {
  let filteredFields = [];

  let sortedFields = fields.sort((a, b) => a.weight - b.weight);
  sortedFields.forEach(field => {
    const updatedField = {...field};
    const fieldName = treeName ? `${treeName}-${updatedField.name}` : updatedField.name || '';

    if (updatedField.states) {
      if (!isVisible(updatedField, form)) {
        fieldsVisibility[fieldName] = false;
        return;
      }
    }

    fieldsVisibility[fieldName] = true;

    switch (updatedField.type) {
      case 'image':
      case 'file':
      case 'wrapper':
        if (updatedField.fields.length === 0) {
          fieldsVisibility[fieldName] = false;
          return;
        }
        const updatedFields = [...updatedField.fields];
        updatedField.fields = getVisibleFields(updatedFields, form, field.tree && fieldName);
        if (updatedField.fields.length === 0) {
          fieldsVisibility[fieldName] = false;
          return;
        }
        break;
      default:
    }
    filteredFields.push(updatedField);
  });

  return filteredFields;
};

export const filterVisibleFields = (fields, form) => {
  fieldsVisibility = [];
  return getVisibleFields(fields, form);
};

// Filter options by visibility.
export const filterVisibleOptions = (options, form) => {
  let filteredOptions = [];
  options.forEach((option, index) => {
    // Check visibility by states.
    if (option.states) {
      if (!isVisible(option, form)) return;
    }
    filteredOptions.push(option);
  });
  return filteredOptions;
};

// Check required option.
export const checkRequired = (field, form) => {
  const fieldValue = getFieldValue(form);

  let required = false;

  // Check state.
  if (field.states) {
    for (let stateType in field.states) {
      switch (stateType) {
        case 'required':
          required = false;

          for (let stateName in field.states[stateType]) {
            let subReq = false;

            if (field.states[stateType][stateName].length && !field.states[stateType][stateName][0].length) {
              if (field.states[stateType][stateName][0].value + '' === fieldValue(stateName) + ''
                && fieldValue(stateName)
                && fieldsVisibility[stateName]) {
                subReq = true;
              }
            }
            else if (field.states[stateType][stateName][0].length) {
              field.states[stateType][stateName][0].some((condition) => {
                if (condition.value + '' === fieldValue(stateName) + ''
                  && fieldValue(stateName)
                  && fieldsVisibility[stateName]) {
                  subReq = true;
                  return true;
                }
              });
            }

            required = required || subReq;
          }
          break;
        default:
          required = !!field.required;
      }
    }
  }
  else {
    required = !!field.required;
  }

  return required;
};