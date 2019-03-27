import React from 'react';
import { FormSection, Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import submit from '../Submit';
import { getFormMarkup } from '../../utils/formBuilder/universalFormBuilder';

// An unique name for this form
let formName = 'subphotos';

class SubPhotosForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.saveFormValues(this.props.formState.subphotos.values, 'formSubPhotoValues');
  }

  render() {
    const { fields, sectionName, handleSubmit, formState, loading } = this.props;
    if (!fields.length) return false;

    let output = '';

    if (sectionName === 'field_recommended_campsites_mult') {
      const recommended = fields.length ? fields.filter(e => e.name === 'field_campsite') : [];

      output =  fields ? getFormMarkup(!formState.loading ? false : formState.loading.state, recommended, 'group_additional', {}) : '';
    }
    else {
      const promote = fields.length ? fields.filter(e => e.name === 'promote') : [];
      output =  fields ? getFormMarkup(!loading ? false : loading.state, promote, 'group_additional', {}) : '';
    }

    return (
      <form onSubmit={handleSubmit}>
        {output}
      </form>
    );
  }
}

SubPhotosForm = reduxForm({
  form: formName,
  enableReinitialize: true,
  onSubmit: submit
})(SubPhotosForm);

SubPhotosForm = connect(
  state => {
    return {
      initialValues: state.appState.formSubPhotoValues,
      formState: state.form
    }
  }
)(SubPhotosForm);

export default SubPhotosForm;