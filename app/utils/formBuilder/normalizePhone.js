export const normalizePhone = (value) => {
  if (!value) {
    return value;
  }

  let clearedValue = value.replace(/[^\d]/g, '');
  clearedValue = clearedValue.slice(0, 15);

  clearedValue = value.slice(0, 1) === '+' ? `+${clearedValue}` : clearedValue;

  const parts = clearedValue.split(/([+]?[\d]{0,4})(\d{3})(\d{3})(\d{4})$/);
  let newValue = '';

  newValue = parts[0] ? newValue + parts[0] : newValue;
  newValue = parts[1] ? newValue + `${parts[1]} ` : newValue;
  newValue = parts[2] ? newValue + `(${parts[2]}) ` : newValue;
  newValue = parts[3] ? newValue + `${parts[3]}` : newValue;
  newValue = parts[4] ? newValue + `-${parts[4]}` : newValue;
  return newValue;
};