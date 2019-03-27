function prepareValues(values) {
  let flatValues = {};
  for (let field in values) {
    if (typeof values[field] === 'object') {
      flatValues = {...flatValues, ...values[field]};
    }
    else {
      flatValues[field] = values[field];
    }
  }
  return flatValues;
}

export default prepareValues;