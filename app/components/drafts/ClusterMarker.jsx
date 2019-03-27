import React from 'react';
import PropTypes from 'prop-types';

class ClusterMarker extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.points.length !== this.props.points.length ||
      nextProps.$hover !== this.props.$hover) return true;
    return false;
  }

  render() {
    const { marker, status, $hover, points, text, onClick } = this.props;
    return (
      <div
        className={`cluster ${status}  ${!marker.editable ? 'view-only' : ''} ${$hover ? 'hovered' : ''}`}
        onClick={() => onClick(marker, 'cluster', points)}
      >
        <span>{text}</span>
      </div>
    )
  }
}

ClusterMarker.propTypes = {
  marker: PropTypes.object.isRequired,
  status: PropTypes.string,
  $hover: PropTypes.bool,
  points: PropTypes.array.isRequired,
  onClick: PropTypes.func
};

ClusterMarker.defaultProps = {
  onClick: () => {}
};

export default ClusterMarker;