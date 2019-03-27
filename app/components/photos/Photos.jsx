import React from 'react';
import PhotoSection from './PhotoSection';
import { loadAdventure } from '../../utils/loadAdventure';
import PropTypes from 'prop-types';

class Photos extends React.Component {
  componentWillMount() {
    const nid = this.props.match.params.id;
    const { selectedDraft } = this.props;

    // If page loaded for edit, get initial date for draft.
    if (!selectedDraft) {
      loadAdventure(nid, this.props.handlers, this.props.history, 'photos');
    }
  }

  render() {
    const { photos, submitData, formInfoValues, formPhotoValues, fields, loading } = this.props;

    let groups = photos ? photos : [];
    const { handlers } = this.props;

    // Remove campsites photos, if content type not campgrounds.
    let sections = [];

    groups.forEach((section, index) => {
      let statesValue = section.states ? section.states: false;
      statesValue = statesValue ? statesValue.visible : false;
      statesValue = statesValue ? statesValue['field_adventure_type']: false;
      statesValue = statesValue ? statesValue[0].value : false;

      if (!statesValue ||
        (formInfoValues && statesValue + '' === formInfoValues['field_adventure_type'] + '')) {
        sections.push(<PhotoSection
          key={section.name}
          index={index}
          sectionName={section.name}
          placeholder={section.placeholder}
          photos={section}
          fields={fields}
          handlers={handlers}
          submitData={submitData}
          formInfoValues={formInfoValues}
          formPhotoValues={formPhotoValues}
          loading={loading}
        />);
      }
    });

    return (
      <div className="main-content">
        {sections}
      </div>
    )
  }
}

Photos.propTypes = {
  photos: PropTypes.array,
  selectedDraft: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  submitData: PropTypes.object.isRequired,
  formInfoValues: PropTypes.object,
  fields: PropTypes.array.isRequired,
  handlers: PropTypes.object,
};

export default Photos;