import React from 'react';
import { reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import submit from '../Submit';
import { withRouter } from 'react-router-dom';
import { getFormMarkup } from '../../utils/formBuilder/universalFormBuilder';
import prepareValues from '../../utils/prepareValues';
import MapsFiles from './MapsFiles';

let formName = 'maps';

class MapsForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleFieldChange = (name, value) => {
    this.props.dispatch(change('maps', name, value));
  };

  componentWillUnmount() {
    const values = this.props.formState.maps.values;
    let flatValues = prepareValues(values);

    this.props.saveFormValues(this.props.formState.maps.values, 'formMapsValues', flatValues);
  }

  render() {
    const { mapsFields, mapsFiles, handleSubmit, formState, handlers, formMapsValues, submitData, loading } = this.props;

    // Construct output of all fields.
    const outputMaps = getFormMarkup(!loading ? false : loading.state, mapsFields, '', formState[formName], [], false, formName);

    return (
      <div className="maps">
        <form onSubmit={handleSubmit} className="maps-form">
          {outputMaps}
          <MapsFiles
            fields={mapsFiles}
            formState={formState}
            formName={formName}
            submitData={submitData}
            formMapsValues={formMapsValues}
            change={this.handleFieldChange}
            handlers={handlers}
            loading={loading}
          />
        </form>
      </div>
    );
  }
}

MapsForm = reduxForm({
  form: formName,
  enableReinitialize: true,
  onSubmit: submit
})(MapsForm);

MapsForm = withRouter(connect(
  state => {
    return {
      initialValues: state.appState.formMapsValues,
      formState: state.form
    }
  }
)(MapsForm));

export default MapsForm;