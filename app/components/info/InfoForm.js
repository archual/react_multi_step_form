import React from 'react';
import { reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import submit from '../Submit';
import { withRouter } from 'react-router-dom';
import { getFormMarkup } from '../../utils/formBuilder/universalFormBuilder';
import PropTypes from 'prop-types';
import deepEqual from 'deep-equal';
import { filterVisibleFields } from '../../utils/formBuilder/prepareFields';

let formName = 'info';

class InfoForm extends React.Component {
  componentWillUnmount() {
    this.props.saveFormValues(this.props.formState.info.values, 'formInfoValues');
  }

  componentWillUpdate(nextProps) {
    if ( nextProps.formState.info && nextProps.formState.info.values) {
      const nextValues = nextProps.formState.info.values;
      const currentValues = this.props.formState.info && this.props.formState.info.values ? this.props.formState.info.values : [];

      let nextPropsType = nextValues['field_adventure_type'];
      let currentPropsType = currentValues['field_adventure_type'];
      if (nextPropsType !== currentPropsType) {
        if (nextPropsType === '298') {
          this.props.dispatch(change(formName, 'field_equipment_recommended-Helmet', true));
        }
        else if (currentPropsType === '298') {
          this.props.dispatch(change(formName, 'field_equipment_recommended-Helmet', false));
        }
      }
      if (nextPropsType !== currentPropsType) {
        if (nextPropsType === '292') {
          this.props.dispatch(change(formName, 'field_site_type-Basic no hookup site', true));
        }
        else if (currentPropsType === '292') {
          this.props.dispatch(change(formName, 'field_site_type-Basic no hookup site', false));
        }
      }

      // Most wanted and On assignment are mutually exclusive.
      const nextMostWanted = nextValues['field_most_wanted_adventure'];
      const currentMostWanted = currentValues['field_most_wanted_adventure'] != null ? currentValues['field_most_wanted_adventure'] : nextMostWanted;
      const nextOnAssignment = nextValues['field_on_assignment'];
      const currentOnAssignment = currentValues['field_on_assignment'] != null ? currentValues['field_on_assignment'] : nextOnAssignment;
      if (nextMostWanted && currentOnAssignment) {
        this.props.dispatch(change(formName, 'field_on_assignment', false));
      }
      else if (nextOnAssignment && currentMostWanted) {
        this.props.dispatch(change(formName, 'field_most_wanted_adventure', false));
      }

      // Clear values for hidden fields (exclude metrics fields).
      const currentFields = this.props.formState && this.props.formState.info ? this.props.formState.info.registeredFields : {};
      const nextFields = nextProps.formState && nextProps.formState.info ? nextProps.formState.info.registeredFields : {};

      for (let field in currentFields) {
        if (!nextFields[field] && field.substr(-9) !== 'target_id') {
          this.props.dispatch(change(formName, field, null));
        }
      }
    }
  }

  // Normalize function (calls in redux-form).
  checkRequired = (fieldName) => (value, previousValue, allValues) => {
    // Save value to store.
    let required = {};
    required[fieldName] = value;

    this.props.saveData(required);
    return value;
  };

  shouldComponentUpdate(nextProps) {
    const currentFields = filterVisibleFields(this.props.infoFields, this.props.formState[formName]);
    const nextFields = filterVisibleFields(nextProps.infoFields, nextProps.formState[formName]);
    const fieldsHaveChanges = !deepEqual(currentFields, nextFields);

    // We have to update in case some values have been changed. See componentWillUpdate()
    const nextValues = nextProps.formState.info && nextProps.formState.info.values ? nextProps.formState.info.values : [];
    const currentValues = this.props.formState.info && this.props.formState.info.values ? this.props.formState.info.values : [];
    const mostWantedHasChanges = nextValues['field_most_wanted_adventure'] !== currentValues['field_most_wanted_adventure'];
    const onAssignmentHasChanges = nextValues['field_on_assignment'] !== currentValues['field_on_assignment'];

    const isLoading = nextProps.loading !== this.props.loading;
    return fieldsHaveChanges || mostWantedHasChanges || onAssignmentHasChanges || isLoading;
  }

  render() {
    const adventureType = this.props.formState.info && this.props.formState.info.values ?
      this.props.formState.info.values['field_adventure_type'] : '';
    const { infoFields, name, handleSubmit, formState, loading } = this.props;

    const callbacks = [
      {
        name: 'title',
        callback: this.checkRequired
      },
      {
        name: 'field_date',
        callback: this.checkRequired
      },
    ];

    const filteredFields = filterVisibleFields(infoFields, formState[formName]);
    const outputInfo = getFormMarkup(!loading ? false : loading.state, filteredFields, name, formState[formName], callbacks);

    return (
      <div className={`main-content adventure-type adventure-type-${adventureType}`}>
        <form onSubmit={handleSubmit}>
          {outputInfo}
        </form>
      </div>
    );
  }
}

InfoForm = reduxForm({
  form: formName,
  enableReinitialize: true,
  onSubmit: submit
})(InfoForm);

InfoForm = withRouter(connect(
  state => {
    return {
      initialValues: state.appState.formInfoValues,
      formState: state.form
    }
  }
)(InfoForm));

InfoForm.propTypes = {
  infoFields: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func,
  formState: PropTypes.object,
  saveData: PropTypes.func.isRequired,
  saveFormValues: PropTypes.func.isRequired,
};

export default InfoForm;