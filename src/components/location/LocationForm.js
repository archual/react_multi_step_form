import React from 'react';
import { FormSection, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import submit from '../Submit';
import { withRouter } from 'react-router-dom';
import { getFormMarkup } from '../../utils/formBuilder/universalFormBuilder';
import { filterVisibleFields } from '../../utils/formBuilder/prepareFields';

// a unique name for this form
let formName = 'location';

class LocationForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.saveFormValues(this.props.formState.location.values, 'formLocationValues');
  }

  render() {
    const { locationFields, name, handleSubmit, formState, loading } = this.props;

    // Construct output of all fields.
    const filteredFields = filterVisibleFields(locationFields, formState[formName]);
    const outputLocation = getFormMarkup(!loading ? false : loading.state, filteredFields, name, formState[formName]);

    return (
      <div>
        <form onSubmit={handleSubmit}>
          {outputLocation}
        </form>
      </div>
    );
  }
}

LocationForm = reduxForm({
  form: formName,
  onSubmit: submit,
  enableReinitialize: true
})(LocationForm);

LocationForm = withRouter(connect(
  state => {
    return {
      initialValues: state.appState.formLocationValues,
      formState: state.form
    }
  }
)(LocationForm));

export default LocationForm;