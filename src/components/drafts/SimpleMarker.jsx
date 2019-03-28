import React from 'react';
import images from '../../constants/images';
import PropTypes from 'prop-types';

class SimpleMarker extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (nextProps.$hover !== this.props.$hover ||
      nextProps.selectedDraft !== this.props.selectedDraft);
  }

  render() {
    const { marker, status, selectedDraft, onClick, $hover } = this.props;
    if (selectedDraft && marker.nid === selectedDraft.nid) return false;

    return (
      <div
        className={`marker ${status} ${!marker.editable ? 'view-only' : ''} ${$hover ? 'hovered' : ''}`}
        onClick={() => onClick(marker, 'simple')}
      >
        <div className="marker-box"></div>
        {status === 'new' && <img src={images['icon' + status.charAt(0).toUpperCase() + status.slice(1)]}/>}
        <img className="marker-type" src={images.mapicons[marker.type]}/>
      </div>
    )
  }
}

SimpleMarker.propTypes = {
  marker: PropTypes.object.isRequired,
  status: PropTypes.string,
  $hover: PropTypes.bool,
  selectedDraft: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  onClick: PropTypes.func
};

SimpleMarker.defaultProps = {
  onClick: () => {}
};

export default SimpleMarker;