'use strict';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from './Layout';
import { App as RootApp } from './App';
import { initialState } from '../constants/configuration';
import { Layout } from 'antd';
import Menu from '../components/sidebar/Menu';
import Buttons from '../components/sidebar/Buttons';
import GMap from '../components/drafts/GMap';
import Info from '../components/info/Info';
import Photos from '../components/photos/Photos';
import Description from '../components/description/Description';
import Location from '../components/location/Location';
import Partners from '../components/partners/Partners';
import Video from '../components/video/Video';
import Maps from '../components/maps/Maps';


const rrd = require('react-router-dom');
rrd.BrowserRouter = ({children}) => <div>{children}</div>;

const { Sider, Content, Footer } = Layout;

configure({
  adapter: new Adapter()
});

describe('<Layout />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<App
      formState={initialState}
      history={
        {
          location: {
            pathname: 'test'
          }
        }
      }
      handlers={{}}
    />);
  });

  it('Should render main Layout', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('Layout should render sidebar (with Meu and Buttons)', () => {
    expect(wrapper.find(Sider)).toHaveLength(1);
    expect(wrapper.find(Sider).find('h2')).toHaveLength(1);
    expect(wrapper.find(Sider).find(Menu)).toHaveLength(1);
    expect(wrapper.find(Sider).find(Buttons)).toHaveLength(1);
  });

  it('should change state, when sidebar collapses', () => {
    wrapper.instance().onCollapse(true);
    expect(wrapper.state('collapsed')).toEqual(true);
  });

  it('Layout should render Content section', () => {
    expect(wrapper.find(Content)).toHaveLength(1);
  });

  it('Layout should render Throbber inside Content section when loading.state', () => {
    wrapper.setProps({
      formState: {
        loading: {
          state: true
        }
      }
    });

    expect(wrapper.find(Content).find('div.throbber')).toHaveLength(1);
  });


  it('should add class "map-step" for "submityouradventure" path', () => {
    wrapper.setProps({
      history: {
        location: {
          pathname: 'submityouradventure',
        }
      }
    });
    expect(wrapper.find('.content').hasClass('map-step')).toEqual(true);
  });

  it('should render routes / as gmap', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={['/submityouradventure']}
      >
        <RootApp />
      </MemoryRouter>
    );
    expect(wrapper.find(GMap)).toHaveLength(1);
  });

  it('should render routes Info for nid', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={['/submityouradventure/edit/6073/info']}
      >
        <RootApp />
      </MemoryRouter>
    );
    expect(wrapper.find(Info)).toHaveLength(1);
  });

  it('should render routes Photos for nid', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={['/submityouradventure/edit/6073/photos']}
      >
        <RootApp />
      </MemoryRouter>
    );
    expect(wrapper.find(Photos)).toHaveLength(1);
  });

  it('should render routes Description for nid', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={['/submityouradventure/edit/6073/description']}
      >
        <RootApp />
      </MemoryRouter>
    );
    expect(wrapper.find(Description)).toHaveLength(1);
  });

  it('should render routes Location for nid', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={['/submityouradventure/edit/6073/location']}
      >
        <RootApp />
      </MemoryRouter>
    );
    expect(wrapper.find(Location)).toHaveLength(1);
  });

  it('shouldn\'t  render routes Partners for nid, if anonym', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={['/submityouradventure/edit/6073/partners']}
      >
        <RootApp />
      </MemoryRouter>
    );
    expect(wrapper.find(Partners)).toHaveLength(1);
  });

  it('should render routes Video', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={['/submityouradventure/edit/6073/video']}
      >
        <RootApp />
      </MemoryRouter>
    );
    expect(wrapper.find(Video)).toHaveLength(1);
  });

  it('should render routes Maps', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={['/submityouradventure/edit/6073/maps']}
      >
        <RootApp />
      </MemoryRouter>
    );
    expect(wrapper.find(Maps)).toHaveLength(1);
  });
  // console.log(wrapper.debug());
  // it('should render routes Partners for nid for admin', () => {
  //
  //   // console.log(window.Drupal);
  //   const wrapper = mount(
  //     <MemoryRouter
  //       initialEntries={['/submityouradventure/edit/6073/partners']}
  //     >
  //       <RootApp />
  //     </MemoryRouter>
  //   );
  //   // window.Drupal = {
  //   //   settings: {
  //   //     adventure: {
  //   //       admin: true
  //   //     }
  //   //   }
  //   // };
  //   expect(wrapper.find(Partners)).toHaveLength(1);
  // });

});