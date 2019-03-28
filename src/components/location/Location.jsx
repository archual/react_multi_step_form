import React from 'react';
import LocationFiles from './LocationFiles';
import LocationForm from './LocationForm';
import { loadAdventure } from '../../utils/loadAdventure';
import PropTypes from 'prop-types';

class Location extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const nid = this.props.match.params.id;
    const { selectedDraft } = this.props;

    // If page loaded for edit, get initial data for draft.
    if (!selectedDraft) {
      loadAdventure(nid, this.props.handlers, this.props.history, 'location');
    }
  }

  render() {
    const { handlers, submitData, loading } = this.props;
    const { saveFormValues } = this.props.handlers;
    const { fields, GPSFiles, formGPSFilesValues } = this.props;

    if (!GPSFiles) return null;

    let locationFields = fields.length ? fields.filter(e => e.name === 'group_transportation') : [];
    locationFields = locationFields[0] ? locationFields[0].fields : [];
    locationFields = locationFields.filter(e => e.name !== 'field_gpx_file_upload');

    const coordsForDirections = `${submitData['field_geo_location-lat']},${submitData['field_geo_location-lon']}`;

    return (
      <div className="locations main-content">
        <LocationForm
          locationFields={locationFields}
          saveFormValues={saveFormValues}
          name='group_transportation'
          loading={loading}
        />
        <p><a href={`https://www.google.com/maps/dir/?daddr=${coordsForDirections}`} target="_blank">Preview driving directions</a></p>
        <p>Your GPS tracks and/or maps you referenced</p>
        <LocationFiles
          fields={GPSFiles || []}
          formGPSFilesValues={formGPSFilesValues}
          handlers={handlers}
          submitData={submitData}
          loading={loading}
        />
      </div>
    );
  }
}

Location.propTypes = {
  fields: PropTypes.array.isRequired,
  GPSFiles: PropTypes.object,
  formGPSFilesValues: PropTypes.object,
  handlers: PropTypes.shape({
    saveFormValues: PropTypes.func.isRequired,
    updateGPSFiles: PropTypes.func.isRequired
  })
};

export default Location;