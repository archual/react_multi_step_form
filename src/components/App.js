import React from 'react';

import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import AppContainer from './AppContainer';

import configureStore from '../store/configureStore';

const store = configureStore();

export class App extends React.Component {
  render() {
    return (<div>
      <Provider store={store}>
        <BrowserRouter>
          <AppContainer/>
        </BrowserRouter>
      </Provider>
    </div>)
  }
}

export default App;
