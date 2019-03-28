import React from 'react';
import PartnersForm from './PartnersForm';
import { loadAdventure } from '../../utils/loadAdventure';
import PropTypes from 'prop-types';

class Partners extends React.Component {
  componentWillMount() {
    const nid = this.props.match.params.id;
    const { selectedDraft } = this.props;

    // If page loaded for edit, get initial date for draft.
    if (!selectedDraft) {
      loadAdventure(nid, this.props.handlers, this.props.history, 'partners');
    }
  }

  render() {
    const { saveFormValues } = this.props.handlers;
    const { fields, loading } = this.props;

    let partnersFields = fields.length ? fields.filter(e => e.name === 'group_partners') : [];
    partnersFields = partnersFields[0] ? partnersFields[0].fields : [];

    if (!partnersFields.length) return null;

    return (
      <PartnersForm
        partnersFields={partnersFields}
        saveFormValues={saveFormValues}
        name='group_partners'
        loading={loading}
      />
    );
  }
}

Partners.propTypes = {
  fields: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    saveFormValues: PropTypes.func.isRequired
  })
};

export default Partners;