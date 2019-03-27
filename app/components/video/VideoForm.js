import React from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import submit from '../Submit';
import prepareValues from '../../utils/prepareValues';
import { withRouter } from 'react-router-dom';
import { getFormMarkup } from '../../utils/formBuilder/universalFormBuilder';

let formName = 'video';

class VideoForm extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentWillUnmount() {
    const values = this.props.formState.video.values;
    let flatValues = prepareValues(values);

    this.props.saveFormValues(this.props.formState.video.values, 'formVideoValues', flatValues);
  }

  render() {
    const { videoFields, name, handleSubmit, formState, loading } = this.props;

    // Construct output of all fields.
    const outputVideo = getFormMarkup(!loading ? false : loading.state, videoFields, name, formState[formName], undefined, false, formName);
    return (
      <div className="video main-content">
        <form onSubmit={handleSubmit}  className="video-form">
          {outputVideo}
        </form>
      </div>
    );
  }
}

VideoForm = reduxForm({
  form: formName,
  enableReinitialize: true,
  onSubmit: submit
})(VideoForm);

VideoForm = withRouter(connect(
  state => {
    return {
      initialValues: state.appState.formVideoValues,
      formState: state.form
    }
  }
)(VideoForm));

export default VideoForm;