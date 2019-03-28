import React from 'react';
import MapsForm from './MapsForm';
import { loadAdventure } from '../../utils/loadAdventure';

class Maps extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const nid = this.props.match.params.id;
    const { selectedDraft } = this.props;

    // If page loaded for edit, get initial date for draft.
    if (!selectedDraft) {
      loadAdventure(nid, this.props.handlers, this.props.history, 'maps');
    }
  }

  render() {
    const { handlers, fields, mapsFiles, formMapsValues, submitData, loading } = this.props;
    const { saveFormValues } = this.props.handlers;
    if (!mapsFiles) return null;

    let mapsFields = fields.length ? fields.filter(e => e.name === 'group_maps') : [];
    mapsFields = mapsFields[0] ? mapsFields[0].fields : [];
    mapsFields = mapsFields.filter(e => e.name === 'field_mapmaker');

    return (
      <div className="maps main-content">
        <MapsForm
          mapsFields={mapsFields}
          mapsFiles={mapsFiles}
          submitData={submitData}
          saveFormValues={saveFormValues}
          formMapsValues={formMapsValues}
          handlers={handlers}
          loading={loading}
        />
      </div>
    );
  }
}

export default Maps;