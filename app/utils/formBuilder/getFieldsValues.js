// Get values for fields. Recursion by fields, and gets values from values array.

export const  getFieldsValues = (fields, initialValues = {}, values = {}, treeName = '') => {
  let updatedValues = {...{}, ...values};
  fields.forEach((field, index) => {
    let name = treeName ? `${treeName}-${field.name}` : field.name || '';
    let value = '';
    if (initialValues[field.name]) {
      if (field.tree) {
        value = initialValues[field.name] == null ? [] : initialValues[field.name];
      }
      else {
        value = initialValues[field.name].value == null ? '' : initialValues[field.name].value;
      }
    }

    switch (field.type) {
      case 'fieldset':
      case 'wrapper':
        // Call recursion.
        if (field.cardinality === -1 || field.cardinality === 10) {
          value.length ? value.forEach((fields, index) => {
            let newValues = {};
            newValues[`${name}-${index}`] = getFieldsValues(field.base_field.fields, initialValues[name][index], {}, `${name}-${index}`);

            updatedValues = {
              ...updatedValues,
              ...newValues
            }
          }) : '';
        }
        else {
          updatedValues = {
            ...updatedValues,
            ...getFieldsValues(field.fields, field.tree ? initialValues[field.name] : initialValues, updatedValues, field.tree && name)};
        }
        break;
      case 'select':
      case 'textarea':
        if (name && value) {
          updatedValues[name] = value;
        }
        break;
      case 'checkbox':
        if (name && value !== '') {
          updatedValues[name] = !!value;
        }
        break;
      case 'radiobuttons':
      case 'radioswitchers':
        if (name && value !== '') {
          updatedValues[name] = value + '';
        }
        break;
      case 'hierarchical':
        if (name && value !== '') {
          updatedValues[name] = value;
        }
        break;
      case 'checkboxes':
      case 'checkboxes-tree':
        // Get updatedValues from options.
        value.length ? value.forEach((element) => (
          updatedValues[`${name}-${element}`] = true
        )) : '';
        break;
      case 'image':
      case 'file':
        // Get value and than call recursion.
        if (field.cardinality === -1) {
          value.length ? value.forEach((fields, index) => {
            updatedValues[`${name}-${index}`] = getFieldsValues(field.base_field.fields, value[index], {}, `${name}-${index}`);
          }) : '';
        }
        else {
          updatedValues = {...updatedValues, ...getFieldsValues(field.fields, field.tree ? value : initialValues, updatedValues, field.tree && name)};
        }
        break;
      case 'markup':
      case 'markup_link':
        updatedValues[name] = value;
        updatedValues[`${name}_additional`] = initialValues[field.name];
        break;
      case 'hidden':
        updatedValues[name] = value;
        break;
      case 'date':
        updatedValues[name] = value;
        break;
      case 'daterange':
        updatedValues[name] = value;
        break;

      default:
        if (field.cardinality === -1) {
          value.length ? value.map((value, index) => (
            updatedValues[`${name}-${index}`] = value
          )) : '';
        }
        else {
          if (name && value) {
            updatedValues[name] = value;
          }
        }
    }
  });

  return updatedValues;
};


