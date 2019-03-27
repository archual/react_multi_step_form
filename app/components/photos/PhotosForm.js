import React from 'react';
import { FormSection, Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import submit from '../Submit';
import prepareValues from '../../utils/prepareValues';
import { Popconfirm, Spin, Icon } from 'antd';
import { getFormMarkup } from '../../utils/formBuilder/universalFormBuilder';

// An unique name for this form
let formName = 'photos';

class PhotosForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };

    this.image = null;
  }

  setImageRef = element => {
    this.image = element;

    if (!element) {
      return;
    }

    element.addEventListener('load', function () {
      if (this.state.isLoading) {
        this.setState({isLoading: false});
      }
    }.bind(this))
  };

  componentWillUnmount() {
    const { sectionName } = this.props;
    const values = this.props.formState.photos.values[sectionName];
    let flatValues = prepareValues(values);

    this.props.saveFormValues(this.props.formState.photos.values, 'formPhotoValues', flatValues);
  }

  checkFeatured = (fieldName) => (value, previousValue, allValues) => {
    const fieldParts = fieldName.length ? fieldName.split('-') : [];
    const fieldGroupName = `${fieldParts[0]}-${fieldParts[1]}`;
    const fieldNumber = this.props.fields.findIndex(field => field.name === fieldGroupName);
    const fieldCleanedName = fieldParts[2];

    // Save changes to photos values.
    this.props.handleUpdatePhotoFields(fieldNumber, fieldCleanedName, value, change);

    return value;
  };

  handleDownloadLink = () => {
    // Save download status for remove checking about leaving page.
    if (window.Drupal.settings.adventure) {
      window.Drupal.settings.adventure.download = true;
    }
  };



  componentWillUpdate = (nextProps) => {
    const currentPhoto = this.props.visibleFields ? this.props.visibleFields.preview : '';
    const nextPhoto = nextProps.visibleFields ? nextProps.visibleFields : '';
    if (currentPhoto !== nextPhoto) {

      if (!this.state.isLoading) {
        this.setState({isLoading: true});
      }
    }
  };

  render() {
    const { visibleFields, selectedPhoto, sectionName, handleSubmit, handleRemovePhoto, handleChangePhoto, handleReplacePhoto, loading } = this.props;

    if (!visibleFields) return null;

    const callbacks = [
      {
        name: 'field_comment_featured_image',
        callback: this.checkFeatured
      }
    ];

    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    // Construct output of all fields.
    const section = (
      <FormSection name={sectionName}>
        <div className={visibleFields.selected ? '' : 'hide'}>
          <FormSection name="image">
            <Spin spinning={this.state.isLoading} indicator={antIcon}>
              <div className={`photo-preview ${this.state.isLoading ? 'loading' : ''}`}>
                <img src={visibleFields.preview} ref={this.setImageRef}/>
                <Popconfirm
                  placement="topRight"
                  title="Are you sure you want to delete this photo?"
                  onConfirm={handleRemovePhoto.bind(this, selectedPhoto)}
                  okText="Yes"
                  cancelText="No">
                  <span className="remove">Delete</span>
                </Popconfirm>
                {visibleFields.featured ? <span className="featured-flag">Featured</span> : ''}
                <span className="download safety">
                    <a href={visibleFields.src} onClick={this.handleDownloadLink} target="_blank">Download</a>
                  </span>
                <span className="slide-prev" onClick={() => (handleChangePhoto(selectedPhoto, 'prev'))}>Prev</span>
                <span className="slide-next" onClick={() => (handleChangePhoto(selectedPhoto, 'next'))}>Next</span>
                <Popconfirm
                  placement="topRight"
                  title="Are you sure you want to replace this photo?"
                  onConfirm={handleReplacePhoto.bind(this, selectedPhoto)}
                  okText="Yes"
                  cancelText="No">
                  <span className="replace">Replace Photo</span>
                </Popconfirm>
              </div>
            </Spin>
          </FormSection>
          <FormSection name={visibleFields.name}>
            {visibleFields.fields &&
            getFormMarkup(!loading ? false : loading.state, visibleFields.fields, visibleFields.name, {}, callbacks, visibleFields.name)}
          </FormSection>
        </div>
      </FormSection>
    );
    return (
      <form onSubmit={handleSubmit}>
        {section}
      </form>
    );
  }
}

PhotosForm = reduxForm({
  form: formName,
  onSubmit: submit,
  enableReinitialize: true
})(PhotosForm);

PhotosForm = connect(
  state => {
    return {
      initialValues: state.appState.formPhotoValues,
      formState: state.form
    }
  }
)(PhotosForm);

export default PhotosForm;