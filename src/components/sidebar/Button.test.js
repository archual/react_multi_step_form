'use strict';
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Button from './Button';

configure({
  adapter: new Adapter()
});

describe('<Button />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Button />);
  });

  it('Should render button', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('Should render button with text "test button"', () => {
    wrapper.setProps({
      title: 'test button'
    });
    expect(wrapper.text()).toEqual('test button');
  });

  it('Should render button with text "test button"', () => {
    let handler = () => {};

    wrapper.setProps({
      title: 'test button',
      handler: handler
    });
    expect(wrapper.contains(<span href="#" onClick={handler}>test button</span>)).toEqual(true);
  });
});