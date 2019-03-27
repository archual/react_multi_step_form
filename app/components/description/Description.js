import React from 'react';
import { FormSection, Field, reduxForm } from 'redux-form';
import CKEditorWrapper from './CKEditorWrapper';
import { connect } from 'react-redux';
import submit from '../Submit';
import { loadAdventure } from '../../utils/loadAdventure';
import PropTypes from 'prop-types';

// An unique name for this form.
let formName = 'description';

class Description extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    if (this.props.formState.description && this.props.formState.description.values) {
      this.props.handlers.saveFormValues(this.props.formState.description.values, 'formDescriptionValue');
    }
  }

  componentWillMount() {
    const nid = this.props.match.params.id;
    const { selectedDraft } = this.props;

    // If page loaded for edit, get initial date for draft.
    if (nid && !selectedDraft) {
      loadAdventure(nid, this.props.handlers, this.props.history, 'description');
    }
  }

  render() {
    const { fields, loading } = this.props;
    if (!fields.length) return null;

    const DescriptionGroup = fields.filter(e => e.name === 'group_description');
    const body = DescriptionGroup[0].fields.filter(e => e.name === 'body');
    return (
      <form className="main-content">
        <div className={body.length && body[0].error ? 'description error' : ''}>
          <Field
            name={'body'}
            component={CKEditorWrapper}
            loading={!loading ? false : loading.state}
          />
        </div>
      </form>
    )
  }
}

Description = reduxForm({
  form: formName,
  enableReinitialize: true,
  onSubmit: submit
})(Description);

Description = connect(
  state => {
    return {
      initialValues: state.appState.formDescriptionValue,
      formState: state.form
    }
  }
)(Description);

Description.propTypes = {
  fields: PropTypes.array.isRequired,
  handlers: PropTypes.object
};

export default Description;