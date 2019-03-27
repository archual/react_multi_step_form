import React from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import submit from '../Submit';
import { withRouter } from 'react-router-dom';
import { getFormMarkup } from '../../utils/formBuilder/universalFormBuilder';
import PropTypes from 'prop-types';

let formName = 'partners';

class PartnersForm extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentWillUnmount() {
    this.props.saveFormValues(this.props.formState.partners.values, 'formPartnersValues');
  }

  render() {
    const { partnersFields, name, handleSubmit, loading, formState } = this.props;

    // Construct output of all fields.
    const outputPartners = getFormMarkup(!loading ? false : loading.state, partnersFields, name, formState[formName]);

    return (
      <div className="partners main-content">
        <form onSubmit={handleSubmit} className="partners-form">
          {outputPartners}
        </form>
        </div>
    );
  }
}

PartnersForm = reduxForm({
  form: formName,
  onSubmit: submit
})(PartnersForm);

PartnersForm = withRouter(connect(
  state => {
    return {
      initialValues: state.appState.formPartnersValues,
      enableReinitialize: true,
      formState: state.form
    }
  }
)(PartnersForm));

PartnersForm.propTypes = {
  partnersFields: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func,
  formState: PropTypes.object,
  saveFormValues: PropTypes.func.isRequired,
};

export default PartnersForm;