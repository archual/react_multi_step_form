import React from 'react';
import PropTypes from 'prop-types';

class MarkerOverlay extends React.Component {
  _onMouseEnterContent = () => {
    this.props.$onMouseAllow(false);
  };

  _onMouseLeaveContent = () => {
    this.props.$onMouseAllow(true);
  };

  handleMarkerClosed = (marker, e) => {
    this.props.$onMouseAllow(true);
    this.props.onMarkerClose(marker, e);
  };

  render() {
    const { marker, filter, onMarkerNextClick, buttonsDisabled } = this.props;
    if (filter && marker.status !== filter) return false;

    return <div
      className={`draft-info ${marker.nid}  ${marker.status}`}
      onMouseEnter={this._onMouseEnterContent}
      onMouseLeave={this._onMouseLeaveContent}>
      <div className="photo">
        {marker.image ? <img src={marker.image} /> : ''}
      </div>
      <div className="wrapper">
        <div className="title">
          {marker.status === 'new' || buttonsDisabled || !marker.editable ? marker.title :
            <a className="next" onClick={(p, e) => onMarkerNextClick(p, e, marker.nid)}>{marker.title}</a>}
          {marker.status === 'new' ? <a className="next" onClick={onMarkerNextClick}>Next</a> : ''}
        </div>
        <div className="adventure-icons">
          <div className="adventure-type">
              <span className={`typeicon odp-adventures-circle-white-icons-${marker.typeIcon} img-circle`}
                    title={marker.typeName} />
          </div>
          <div className="adventure-subtypes">
            {marker.categories ? <span className="subplus">+</span> : ''}
                <span className="subicons">
                  {marker.categories ? marker.categories.map((category, index) => (
                    <span key={`${category.title}-${marker.nid}`}
                          title={category.title}
                          className={`subicon odp-adventures-circle-white-icons-${category.icon} img-circle`}/>
                  )) : ''}
                </span>
          </div>
        </div>
        {marker.status !== 'new' ? <div className="last-changed">
          Updated: {marker.date}
        </div> : ''}
      </div>
      <span className="close-button" onClick={(e) => this.handleMarkerClosed(marker, e)}>Close</span>
    </div>
  }
}


MarkerOverlay.propTypes = {
  marker: PropTypes.object.isRequired,
  filter: PropTypes.string,
  buttonsDisabled: PropTypes.bool,
  onMarkerNextClick: PropTypes.func
};

MarkerOverlay.defaultProps = {
  onMarkerNextClick: () => {}
};

export default MarkerOverlay;
