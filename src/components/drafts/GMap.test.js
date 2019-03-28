'use strict';
import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {initialState} from '../../constants/configuration';
import {GMap} from './GMap';
import GoogleMapReact from 'google-map-react';
import superCluster from 'points-cluster';

jest.mock('points-cluster');

configure({
  adapter: new Adapter()
});

describe('<GMap />', () => {
  let wrapper;
  let {map} = initialState;

  const handlers = {
    getDrafts: jest.fn(() => {
    }),
    getDraftFields: jest.fn(() => {
    }),
    getLocation: jest.fn(() => {
    }),
    selectDraft: jest.fn(() => {
    }),
    removeNewDraft: jest.fn(() => {
    }),
    getDraftData: jest.fn(() => {
    }),
    newMarkerPosition: jest.fn(() => {
    }),
  };

  superCluster.mockImplementation(() => {
    return jest.fn().mockImplementation(() => {
      const cluster = [1, 2];
      return cluster;
    })
  });

  const center = {
    lat: 34.052235,
    lng: -118.243683
  };

  const mapProps = {
    zoom: 4
  };

  beforeAll(() => {
    wrapper = shallow(<GMap
      map={map}
      handlers={handlers}
    />);
    wrapper.instance()._getClusters = jest.fn(() => {
    });
    wrapper.instance()._getClusters.mockReturnValueOnce([]);
  });

  it('Should render Google Map react component', () => {
    expect(wrapper.find(GoogleMapReact)).toHaveLength(1);
  });

  it('Should run ComponentDidMount code and prepare component', () => {
    wrapper.instance().componentDidMount = jest.fn();
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount.mock.calls.length).toBe(1);

    expect(wrapper.instance().props.handlers.getDrafts.mock.calls.length).toBe(1);
    expect(wrapper.instance().props.handlers.getDraftFields.mock.calls.length).toBe(1);

    expect(wrapper.state('center')).toEqual({
      lat: 34.052235,
      lng: -118.243683
    });

    expect(wrapper.state('zoom')).toEqual(5);
  });

  it('Should execute method onChange, calculate new cluster and update "markers" and "zoom" state.', () => {
    wrapper.find(GoogleMapReact).simulate('change', mapProps);

    expect(wrapper.instance()._getClusters.mock.calls.length).toBe(1);
    expect(wrapper.state('markers')).toEqual([]);
    expect(wrapper.state('mapProps')).toEqual(mapProps);
  });

  it('Should execute method onBoundsChange, call handler "getLocation" and update "zoom" state.', () => {
    wrapper.find(GoogleMapReact).simulate('boundsChange', center, 7);

    expect(wrapper.instance().props.handlers.getLocation.mock.calls.length).toBe(1);
    expect(wrapper.state('zoom')).toEqual(7);
  });

  it('Should execute "handleInfoClose", call "selectDraft" handler and check argument', () => {
    wrapper.instance().handleInfoClose('test_marker');

    expect(wrapper.instance().props.handlers.selectDraft.mock.calls.length).toBe(1);
    expect(wrapper.instance().props.handlers.selectDraft.mock.calls[0][0]).toBe('test_marker');
  });

  it('Should remove new draft when user hit "delete" key and we have new draft (handleMarkerKeyPress)', () => {
    handlers.selectDraft.mockClear();
    const newDraftCoords = {
      lat: 1,
      lon: 1
    };

    map.selectedDraft = {};

    wrapper = shallow(<GMap
      map={map}
      handlers={handlers}
    />);

    wrapper.setState({
      newDraftCoords
    });

    wrapper.instance().handleMarkerKeyPress({charCode: 100});
    expect(wrapper.instance().props.handlers.selectDraft.mock.calls.length).toBe(0);
    expect(wrapper.instance().props.handlers.removeNewDraft.mock.calls.length).toBe(0);
    expect(wrapper.state('newDraftCoords')).toEqual(newDraftCoords);

    wrapper.instance().handleMarkerKeyPress({charCode: 127});
    expect(wrapper.instance().props.handlers.selectDraft.mock.calls.length).toBe(0);
    expect(wrapper.instance().props.handlers.removeNewDraft.mock.calls.length).toBe(0);
    expect(wrapper.state('newDraftCoords')).toEqual(newDraftCoords);

    map.selectedDraft = {
      nid: 'new'
    };

    wrapper = shallow(<GMap
      map={map}
      handlers={handlers}
    />);

    wrapper.setState({
      newDraftCoords
    });

    wrapper.instance().handleMarkerKeyPress({charCode: 100});
    expect(wrapper.instance().props.handlers.selectDraft.mock.calls.length).toBe(0);
    expect(wrapper.instance().props.handlers.removeNewDraft.mock.calls.length).toBe(0);
    expect(wrapper.state('newDraftCoords')).toEqual(newDraftCoords);

    wrapper.instance().handleMarkerKeyPress({charCode: 127});
    expect(wrapper.instance().props.handlers.selectDraft.mock.calls.length).toBe(1);
    expect(wrapper.instance().props.handlers.removeNewDraft.mock.calls.length).toBe(1);
    expect(wrapper.state('newDraftCoords')).toEqual(false);
  });

  it('Should execute click handler for cluster marker, without changing state', () => {
    const type = 'cluster',
      points = [],
      marker = {
        lat: 1,
        lng: 1,
        nid: 'new',
        title: ''
      };

    wrapper.setState({
      zoom: 9
    });

    wrapper.instance().handleClick(marker, type, points);
    expect(wrapper.state('zoom')).toEqual(9);
  });

  it('Should execute click handler for cluster marker, set new zoom and center to state', () => {
    const type = 'cluster',
      points = [],
      marker = {
        lat: 1,
        lng: 1,
        nid: 'new',
        title: ''
      };

    wrapper = shallow(<GMap
      map={map}
      handlers={handlers}
    />);

    wrapper.setState({
      mapProps: {
        zoom: 9,
      }
    });

    wrapper.instance().handleClick(marker, type, points);
    expect(wrapper.state('zoom')).toEqual(10);
    expect(wrapper.state('center')).toEqual({
      lat: 1,
      lng: 1,
    });
  });

  it('Should execute click handler for single marker and select draft (new)', () => {
    handlers.selectDraft.mockClear();
    const type = 'single',
      points = [],
      marker = {
        lat: 1,
        lng: 1,
        nid: 'new'
      };

    wrapper.instance().handleClick(marker, type, points);
    expect(wrapper.instance().props.handlers.selectDraft.mock.calls.length).toBe(1);
    expect(wrapper.instance().props.handlers.selectDraft.mock.calls[0][0]).toBe(marker);
  });

  it('Should execute click handler for single marker and select draft (with title)', () => {
    handlers.selectDraft.mockClear();
    const type = 'single',
      points = [],
      marker = {
        lat: 1,
        lng: 1,
        nid: 1222,
        title: 'test_title'
      };

    wrapper.instance().handleClick(marker, type, points);
    expect(wrapper.instance().props.handlers.selectDraft.mock.calls.length).toBe(1);
    expect(wrapper.instance().props.handlers.selectDraft.mock.calls[0][0]).toBe(marker);
  });

  it('Should execute click handler for single marker and get draft data from API', () => {
    handlers.selectDraft.mockClear();
    const type = 'single',
      points = [],
      marker = {
        lat: 1,
        lng: 1,
        nid: 1222,
      };

    wrapper.instance().handleClick(marker, type, points);
    expect(wrapper.instance().props.handlers.getDraftData.mock.calls.length).toBe(1);
    expect(wrapper.instance().props.handlers.getDraftData.mock.calls[0][0]).toBe(marker.nid);
  });

  it('Should set map to undraggable state when mouse down', () => {
    wrapper.find(GoogleMapReact).simulate('childMouseDown');
    expect(wrapper.find(GoogleMapReact).props().draggable).toBe(false);
  });

  it('Should set map to undraggable state when mouse enter (status = "draft"), "newDraftCoords" = false', () => {
    const key = undefined,
      childProps = {
        status: 'draft'
      },
      newCoords = {
        lat: 1,
        lng: 1
      };

    wrapper = shallow(<GMap
      map={map}
      handlers={handlers}
    />);

    wrapper.find(GoogleMapReact).simulate('childMouseEnter', key, childProps, newCoords);
    expect(wrapper.find(GoogleMapReact).props().draggable).toBe(false);
    expect(wrapper.state('newDraftCoords')).toEqual(false);
  });

  it('Should set map to undraggable state when mouse enter (newCorrds is false), "newDraftCoords" = false', () => {
    const key = undefined,
      childProps = {
        status: 'new'
      },
      newCoords = false

    wrapper = shallow(<GMap
      map={map}
      handlers={handlers}
    />);

    wrapper.find(GoogleMapReact).simulate('childMouseEnter', key, childProps, newCoords);
    expect(wrapper.find(GoogleMapReact).props().draggable).toBe(false);
    expect(wrapper.state('newDraftCoords')).toEqual(false);
  });

  it('Should set map to undraggable state when mouse enter and set "newDraftCoords"', () => {
    const key = undefined,
      childProps = {
        status: 'new'
      },
      newCoords = {
        lat: 1,
        lng: 1
      };

    wrapper = shallow(<GMap
      map={map}
      handlers={handlers}
    />);

    wrapper.find(GoogleMapReact).simulate('childMouseEnter', key, childProps, newCoords);
    expect(wrapper.find(GoogleMapReact).props().draggable).toBe(false);
    expect(wrapper.state('newDraftCoords')).toEqual(newCoords);
  });

  it('Should set map to draggable state when mouse up (status = "draft")', () => {
    const key = undefined,
      childProps = {
        status: 'draft'
      },
      newCoords = {
        lat: 1,
        lng: 1
      };

    wrapper.find(GoogleMapReact).simulate('childMouseUp', key, childProps, newCoords);
    expect(wrapper.find(GoogleMapReact).props().draggable).toBe(true);
  });

  it('Should set map to draggable state when mouse up (newCoords = false)', () => {
    const key = undefined,
      childProps = {
        status: 'new'
      },
      newCoords = false;

    wrapper.find(GoogleMapReact).simulate('childMouseUp', key, childProps, newCoords);
    expect(wrapper.find(GoogleMapReact).props().draggable).toBe(true);
    expect(wrapper.instance().props.handlers.newMarkerPosition.mock.calls.length).toBe(0);
  });

  it('Should set map to draggable state when mouse up and set newMarkerPosition', () => {
    handlers.newMarkerPosition.mockClear();

    const key = undefined,
      childProps = {
        status: 'new'
      },
      newCoords = {
        lat: 1,
        lng: 1
      },
      newDraftCoords = {
        lat: 1,
        lng: 1
      };

    wrapper = shallow(<GMap
      map={map}
      handlers={handlers}
    />);

    wrapper.setState({
      newDraftCoords
    });

    wrapper.find(GoogleMapReact).simulate('childMouseUp', key, childProps, newCoords);
    expect(wrapper.find(GoogleMapReact).props().draggable).toBe(true);
    expect(wrapper.instance().props.handlers.newMarkerPosition.mock.calls.length).toBe(1);
    expect(wrapper.instance().props.handlers.newMarkerPosition.mock.calls[0][0]).toBe(newDraftCoords);
  });

  it('Should change route, when click next for new draft (nid = undefined)', () => {
    const p = {
        preventDefault: jest.fn()
      },
      e = undefined,
      nid = undefined;

    wrapper.setProps({
      history: {
        push: jest.fn()
      }
    });

    wrapper.instance().handleNextClick(p, e, nid);
    expect(p.preventDefault.mock.calls.length).toBe(1);
    expect(wrapper.instance().props.history.push.mock.calls.length).toBe(1);
    expect(wrapper.instance().props.history.push.mock.calls[0][0]).toBe(`/submityouradventure/add/info`);
  });

  it('Shouldn\'t change route, when click next for non editable draft (nid = 123)', () => {
    handlers.newMarkerPosition.mockClear();

    const p = {
        preventDefault: jest.fn()
      },
      e = undefined,
      nid = 123,
      history = {
        push: jest.fn()
      };

    map['selectedDraft'] = {
      editable: false
    };

    wrapper = shallow(<GMap
      map={map}
      handlers={handlers}
      history={history}
    />);

    wrapper.instance().handleNextClick(p, e, nid);
    expect(p.preventDefault.mock.calls.length).toBe(1);
    expect(wrapper.instance().props.history.push.mock.calls.length).toBe(0);
  });

  it('Shouldn\'t change route, when click next and button disabled (nid = 123)', () => {
    handlers.newMarkerPosition.mockClear();

    const p = {
        preventDefault: jest.fn()
      },
      e = undefined,
      nid = 123,
      history = {
        push: jest.fn()
      };

    map['selectedDraft'] = {
      editable: true
    };

    wrapper = shallow(<GMap
      map={map}
      handlers={handlers}
      history={history}
      buttonsDisabled={true}
    />);

    wrapper.instance().handleNextClick(p, e, nid);
    expect(p.preventDefault.mock.calls.length).toBe(1);
    expect(wrapper.instance().props.history.push.mock.calls.length).toBe(0);
  });

  it('Shouldn\'t change route, when click next (nid = 123)', () => {
    handlers.newMarkerPosition.mockClear();

    const p = {
        preventDefault: jest.fn()
      },
      e = undefined,
      nid = 123,
      history = {
        push: jest.fn()
      };

    map['selectedDraft'] = {
      editable: true
    };

    wrapper = shallow(<GMap
      map={map}
      handlers={handlers}
      history={history}
    />);

    wrapper.instance().handleNextClick(p, e, nid);
    expect(p.preventDefault.mock.calls.length).toBe(1);
    expect(wrapper.instance().props.history.push.mock.calls.length).toBe(1);
    expect(wrapper.instance().props.history.push.mock.calls[0][0]).toBe(`/submityouradventure/edit/${nid}/info`);

  });
});