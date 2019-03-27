import React from 'react';
import { FormSection, Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import submit from '../Submit';
import prepareValues from '../../utils/prepareValues';
import { Popconfirm } from 'antd';
import { getFormMarkup } from '../../utils/formBuilder/universalFormBuilder';

// An unique name for this form
let formName = 'location-files';

class LocationFilesForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    const values = this.props.formState['location-files'].values;
    let flatValues = prepareValues(values);

    this.props.saveFormValues(this.props.formState['location-files'].values, 'formGPSFilesValues', flatValues);
  }

  handleDownloadLink = () => {
    // Save download status for remove checking about leaving page.
    if (window.Drupal.settings.adventure) {
      window.Drupal.settings.adventure.download = true;
    }
  };

  render() {
    const { fields, handleSubmit, handleRemoveFile, formState, loading } = this.props;
    if (!fields.length) return false;

    const visibleFieldIndex = fields.findIndex(e => e.selected);
    const visibleFields = fields.filter(e => e.selected);

    // Construct output of all fields.
    const output = visibleFields.map((field) => (
      <FormSection key={field.name} name={'group_transportation'}>
        <FormSection name="image">
          <div className="file-preview">
            <h4>File name:</h4>
            <p><a href={field.src} onClick={this.handleDownloadLink} target="_blank">{field.fileName}</a></p>
            <span className="download"><a href={field.src} onClick={this.handleDownloadLink} target="_blank">Download</a></span>
            <Popconfirm
              placement="topRight"
              title="Are you sure you want to delete this file?"
              onConfirm={handleRemoveFile.bind(this, visibleFieldIndex)}
              okText="Yes"
              cancelText="No">
              <span className="button btn-remove">Remove</span>
            </Popconfirm>
          </div>
        </FormSection>
        <FormSection name={field.name}>
          {field.fields ? getFormMarkup(!loading ? false : loading.state, field.fields, field.name) : ''}
        </FormSection>
      </FormSection>
    ));

    return (
      <form onSubmit={handleSubmit}>
        {output}
      </form>
    );
  }
}

LocationFilesForm = reduxForm({
  form: formName,
  enableReinitialize : true,
  onSubmit: submit
})(LocationFilesForm);

LocationFilesForm = connect(
  state => {
    return {
      initialValues: state.appState.formGPSFilesValues,
      formState: state.form
    }
  }
)(LocationFilesForm);

export default LocationFilesForm;