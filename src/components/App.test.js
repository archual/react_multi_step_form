'use strict';
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from './App';
import AppContainer from './AppContainer';


configure({
  adapter: new Adapter()
});

describe('<AppContainer />', () => {
  it('Should render main App', () => {
    const app = shallow(<App />);
    expect(app.find(AppContainer)).toHaveLength(1);
  });
});