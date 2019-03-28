import React from 'react';
import InfoForm from './InfoForm';
import { loadAdventure } from '../../utils/loadAdventure';
import PropTypes from 'prop-types';

class Info extends React.Component {
  componentWillMount() {
    const nid = this.props.match.params.id;
    const { map } = this.props;

    // If page loaded for edit, get initial date for draft.
    if (!map.selectedDraft) {
      loadAdventure(nid, this.props.handlers, this.props.history, 'info');
    }
  }

  render() {
    const { saveFormValues, saveData } = this.props.handlers;
    const { fields, loading } = this.props;
    let infoFields = fields.length ? fields.filter(e => e.name === 'group_adventure') : [];
    infoFields = infoFields[0] ? infoFields[0].fields : [];

    if (!infoFields.length) return null;

    return (
      <InfoForm
        infoFields={infoFields}
        saveFormValues={saveFormValues}
        name='group_adventure'
        saveData={saveData}
        loading={loading}
      />
    );
  }
}

Info.propTypes = {
  map: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    saveFormValues: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    setInitialState: PropTypes.func.isRequired,
    getDraftData: PropTypes.func.isRequired
  }),
  buttonsDisabled: PropTypes.bool.isRequired
};

Info.defaultProps = {
  map: {
    selectedDraft: false
  },
  buttonsDisabled: false
};

export default Info;