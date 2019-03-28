// Store state to Local Store.

let localUserData = null;

export const loadLocalState = () => {
  try {
    const serializedState = localStorage.getItem('formState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.log("Can't load from local storage", err);
  }
};

export const saveLocalState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('formState', serializedState);
  } catch (err) {
    console.log("Can't save to local storage", err);
  }
};

// User data (from backend).
export const loadUserData = () => {
  let serializedState = null;

  try {
    serializedState = sessionStorage.getItem('userData') || localUserData;
  } catch (err) {
    serializedState = getCookie('STYXKEY-userData') || localUserData;
  }

  if (serializedState === null || !serializedState) {
    return undefined;
  }

  return JSON.parse(serializedState);
};

const getCookie = (cname) => {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const saveUserData = (data) => {
  data = data['local'];
  if (!data) return;

  // Get user data if already exist some.
  var userData = loadUserData() || {};

  // Merge saving data with user data.
  for (let key in data) {
    if (!data.hasOwnProperty(key)) continue;

    userData[key] = data[key];
  }

  const serializedState = JSON.stringify(userData);
  
  // Save userData in config, because on iPhone in private mode we can't set cookies/session/localStorage.
  localUserData = serializedState;

  try {
    sessionStorage.setItem('userData', serializedState);
  } catch (err) {
    // Set cookie.
    setCookie('STYXKEY-userData', serializedState);
  }
};

const setCookie = (cName, cValue) => {
  // 1 day cookies (86400000ms).
  var d = new Date();
  d.setTime(d.getTime() + 86400000);
  var expires = "expires="+ d.toUTCString();
  document.cookie = cName + "=" + cValue + ";" + expires + ";path=/";
};