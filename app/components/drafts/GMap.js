import React from 'react';
import GoogleMapReact from 'google-map-react';
import ClusterMarker from './ClusterMarker';
import SimpleMarker from './SimpleMarker';
import MarkerOverlay from './MarkerOverlay';
import superCluster from 'points-cluster';
import canUseDOM from 'can-use-dom';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const geolocation = (
  canUseDOM && navigator.geolocation ?
    navigator.geolocation :
    ({
      getCurrentPosition(success, failure) {
        failure(`Your browser doesn't support geolocation.`);
      }
    })
);

export class GMap extends React.Component {
  constructor() {
    super();

    this.state = {
      zoom: 5,
      mapProps: false,
      center: {},
      markers: [],
      mapDraggable: true,
      newDraftCoords: false
    };
  }

  onChange = (props) => {
    // Calculate clusters.
    const { drafts, filter } = this.props.map;

    let clusters = this._getClusters(drafts, filter, props);

    this.setState({
      markers: clusters,
      mapProps: props
    });
  };

  onBoundsChange = (center, zoom) => {
    this.props.handlers.getLocation(center, zoom);
    this.setState({
      zoom: zoom
    });
  };

  handleInfoClose = (marker) => {
    this.props.handlers.selectDraft(marker);
  };

  // Handle 'Delete' key press.
  handleMarkerKeyPress = (event) => {
    if (event.charCode === 127 && this.props.map.selectedDraft.nid === 'new') {
      this.props.handlers.selectDraft(this.props.map.selectedDraft);
      this.props.handlers.removeNewDraft();
      this.setState({
        newDraftCoords: false
      })
    }
  };

  handleClick = (marker, type, points) => {
    if (type === 'cluster') {
      if (!this.state.mapProps) {
        return;
      }

      let mapProps = {...this.state.mapProps};
      let zoom = this.state.mapProps.zoom ? this.state.mapProps.zoom + 1 : 4;
      for (zoom; zoom < 16; zoom++) {
        mapProps.zoom = zoom;
        let clusters = superCluster(
          points,
          {
            minZoom: 3, // min zoom to generate clusters on
            maxZoom: 8, // max zoom level to cluster the points on
            radius: 100 // cluster radius in pixels
          }
        )(mapProps);

        if (clusters.length > 1) {
          break;
        }
      }
      this.setState({
        zoom: zoom,
        center: {
          lat: marker.lat,
          lng: marker.lng
        }
      });
    }
    else {
      if (marker.nid !== 'new' && !marker.title) {
        this.props.handlers.getDraftData(marker.nid);
      }
      else {
        this.props.handlers.selectDraft(marker);
      }
    }
  };

  handleMouseDown = (key, childProps, newCoords) => {
    // Set map no draggable.
    this.setState({
      mapDraggable: false
    });
  };

  handleMouseEnter = (key, childProps, newCoords) => {
    // Set map no draggable.
    this.setState({
      mapDraggable: false
    });

    if (childProps.status !== 'new' || !newCoords) return;

    this.setState({
      newDraftCoords: {
        lat: newCoords.lat,
        lng: newCoords.lng
      }
    });
  };

  handleMouseUp = (key, childProps, newCoords) => {
    // Set map draggable again.
    this.setState({
      mapDraggable: true
    });

    if (childProps.status !== 'new' || !newCoords) return;

    if (this.state.newDraftCoords) {
      this.props.handlers.newMarkerPosition(this.state.newDraftCoords);
    }
  };

  handleMouseMove = (key, childProps, newCoords) => {
    if (childProps.status !== 'new' || !newCoords) return;

    this.setState({
      mapDraggable: false,
      newDraftCoords: {
        lat: newCoords.lat,
        lng: newCoords.lng
      }
    });
  };

  handleNextClick = (p, e, nid) => {
    // Go to info step.
    p.preventDefault();
    if (nid) {
      const { buttonsDisabled } = this.props;
      const { selectedDraft } = this.props.map;
      // Find selected draft ID.
      if (!selectedDraft || !selectedDraft.editable || buttonsDisabled) return;

      this.props.history.push(`/submityouradventure/edit/${nid}/info`);
    }
    else {
      this.props.history.push(`/submityouradventure/add/info`);
    }
  };

  componentDidMount() {
    // Get user location.
    if (!this.props.map.selectedDraft) {
      geolocation.getCurrentPosition((position) => {
        // Change center.
        let center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.props.handlers.getLocation(center);

        this.setState({
          center: this.props.map.center
        });
      }, (reason) => {
        console.log(`Error: The Geolocation service failed (${reason}).`);
      });
    }

    // Get drafts.
    this.props.handlers.getDrafts();
    this.props.handlers.getDraftFields();

    if (!this.state.center.lat) {
      this.setState({
        center: this.props.map.center,
      });
    }
    if (this.props.map.zoom) {
      this.setState({
        zoom: this.props.map.zoom
      });
    }
  }

  _getDraftStatuses = () => {
    return [
      'claimed',
      'published',
      'priority',
      'unclaimed',
      'my_draft',
      'my_pending',
    ];
  };

  _doDraftsHaveTheSameLength = (first, second) => {
    return this._getDraftStatuses()
      .every((status) => {
        if (first[status] === second[status]) {
          return true;
        }

        if (!first[status] || !second[status]) {
          return false;
        }

        return first[status].length === second[status].length;
      });
  };

  _doFiltersAreEqual = (first, second) => {
    if (first === second) {
      return true;
    }

    if (!first.length || !second.length) {
      return false;
    }

    if (first.length !== second.length) {
      return false;
    }

    return first.every(e => second.includes(e));
  };

  componentWillReceiveProps(nextProps) {
    const { drafts, filter } = this.props.map;

    if (!this._doFiltersAreEqual(filter, nextProps.map.filter) || !this._doDraftsHaveTheSameLength(drafts, nextProps.map.drafts)) {
      // Calculate clusters.
      const { drafts, filter } = nextProps.map;

      let clusters = this._getClusters(drafts, filter, this.state.mapProps);

      this.setState({
        markers: clusters
      })
    }

    // Set new coordinates for dragged draft.
    if (nextProps.map.drafts.new.length &&
      (this.state.newDraftCoords.lat !== nextProps.map.drafts.new[0].lat ||
        this.state.newDraftCoords.lng !== nextProps.map.drafts.new[0].lng)) {
      this.setState({
        newDraftCoords: {
          lat: nextProps.map.drafts.new[0].lat,
          lng: nextProps.map.drafts.new[0].lng
        }
      });
    }
    else {
      if (this.state.newDraftCoords !== false && !nextProps.map.drafts.new.length) {
        this.setState({
          newDraftCoords: false
        });
      }
    }
  }

  _getClusters(drafts, filter, mapProps) {
    let clusters = [];
    for (let status in drafts) {
      if ((!filter.length || filter.indexOf(status) !== -1) && status !== 'new') {
        let currentDrafts = [];
        currentDrafts.push(drafts[status].length ? drafts[status].filter(e => e.editable) : []);
        currentDrafts.push(drafts[status].length ? drafts[status].filter(e => !e.editable) : []);

        let clustersArray = currentDrafts.map((drafts, index) => (
          mapProps.bounds ? superCluster(
            drafts,
            {
              minZoom: 3, // min zoom to generate clusters on
              maxZoom: 8, // max zoom level to cluster the points on
              radius: 100 // cluster radius in pixels
            }
          )(mapProps)
            .map(({ wx, wy, numPoints, points, zoom }) => ({
              lat: wy,
              lng: wx,
              text: numPoints,
              numPoints,
              points,
              status: status,
              id: `${index}_${numPoints}_${points[0].nid}`,
              marker: points[0],
            })) : []
        ));

        clusters = clusters.concat(clustersArray[0], clustersArray[1]);
      }
    }

    return clusters;
  }

  _distanceToMouse = (markerPos, mousePos, markerProps) => {
    const MARKER_WIDTH = 34 + (((markerProps.text + '').length > 2 && markerProps.status !== 'new') ?
      ((markerProps.text + '').length - 2) * 11 : 0);
    const MARKER_HEIGHT = 34;
    const POINTER_HEIGHT = markerProps.status === 'new' ? 15 : 0;

    const x = markerPos.x + MARKER_WIDTH / 2;
    const y = markerPos.y - MARKER_HEIGHT / 2 - POINTER_HEIGHT;
    return Math.sqrt((x - mousePos.x) * (x - mousePos.x) + (y - mousePos.y) * (y - mousePos.y));
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.map.drafts.claimed.length !== this.props.map.drafts.claimed.length ||
      nextProps.map.drafts.new.length !== this.props.map.drafts.new.length ||
      (this.props.map.drafts.new.length &&
        (nextProps.map.drafts.new[0].lat !== this.props.map.drafts.new[0].lat ||
          nextProps.map.drafts.new[0].lng !== this.props.map.drafts.new[0].lng)) ||
      nextProps.map.selectedDraft !== this.props.map.selectedDraft ||
      !this._doFiltersAreEqual(nextProps.map.filter, this.props.map.filter) ||
      nextState.markers.length !== this.state.markers.length ||
      nextState.zoom !== this.state.zoom ||
      nextState.mapDraggable !== this.state.mapDraggable ||
      nextState.newDraftCoords.lat !== this.state.newDraftCoords.lat ||
      nextState.newDraftCoords.lng !== this.state.newDraftCoords.lng ||
      (this.state.mapProps &&
        (nextState.mapProps.center.lat !== this.state.mapProps.center.lat ||
          nextState.mapProps.center.lng !== this.state.mapProps.center.lng))
    )
  }

  render() {
    const { selectedDraft } = this.props.map;
    const { buttonsDisabled } = this.props;
    const clusters = this.state.markers ? [...this.state.markers] : [];

    return (
      <div
        onKeyPress={this.handleMarkerKeyPress}
      >
        <GoogleMapReact
          style={{
            position: 'relative',
            margin: 0,
            padding: 0,
            height: 'calc(100vh - 95px)',
            flex: 1
          }}
          options={{
            panControl: true,
            gestureHandling: 'greedy',
            mapTypeControl: true,
            minZoomOverride: true,
            minZoom: 3,
            maxZoom: 18
          }}
          hoverDistance = {22}
          distanceToMouse={this._distanceToMouse}
          // markerHoverDistance = {30}
          draggable = {this.state.mapDraggable}
          center={this.state.center}
          zoom={this.state.zoom}
          resetBoundsOnResize={true}
          onChange={this.onChange}
          onBoundsChange={this.onBoundsChange}
          onChildMouseMove={this.handleMouseMove}
          onChildMouseDown={this.handleMouseDown}
          onChildMouseEnter={this.handleMouseEnter}
          onChildMouseLeave={this.handleMouseUp}
          onChildMouseUp={this.handleMouseUp}
        >
        {
          clusters
            .map(({ ...markerProps, id, numPoints, points }) => (
              numPoints === 1
                ? <SimpleMarker
                    key={id}
                    {...markerProps}
                    selectedDraft={selectedDraft}
                    onClick={this.handleClick}
                  />
                : <ClusterMarker
                    key={id}
                    {...markerProps}
                    points={points}
                    onClick={this.handleClick}
              />
            ))
        }
        {this.state.newDraftCoords &&
          <SimpleMarker
            key={'new'}
            {...this.props.map.drafts.new[0]}
            marker={this.props.map.drafts.new[0]}
            lat={this.state.newDraftCoords.lat}
            lng={this.state.newDraftCoords.lng}
            selectedDraft={selectedDraft}
            onClick={this.handleClick}
          />}
        {selectedDraft &&
         <MarkerOverlay
           marker={selectedDraft}
           buttonsDisabled={buttonsDisabled}
           {...selectedDraft}
           onMarkerClose={this.handleInfoClose}
           onMarkerNextClick={this.handleNextClick}
         />
        }
      </GoogleMapReact>
    </div>
    );
  }
}

GMap.propTypes = {
  map: PropTypes.object.isRequired,
  buttonsDisabled: PropTypes.bool,
  selectedDraft: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  handlers: PropTypes.object
};

export default withRouter(GMap);