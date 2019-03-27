import React from 'react';
import { Row, Col } from 'antd';
import Dropzone from './DropZonePhotos';
import SortableGrid from '../SortableGrid';
import PhotosForm from './PhotosForm';
import PhotosSubForm from './PhotosSubForm';
import { change } from 'redux-form';
import { Popconfirm } from 'antd';
import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';

class PhotoSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseField: {},
      fields: [],
      selectedPhoto: undefined,
      replacedField: {},
      featuredEnabled: false,
      maxFileNumber: 0
    };
  }

  handleUpdatePhoto = (file) => {
    const fields = [...this.state.fields];

    const updatedFields = fields.map((field, index) => {
      if (file.fid && field.fileName === file.fileName) {
        field.value = file.fid;
        field.fid = file.fid;
        field.src = file.src;
        field.thumbnail = file.thumbnail;
        field.preview = file.thumbnail;

        field.fields = field.fields.map(field => {
          let updatedField = field;
          if (field.name === 'fid') {
            updatedField.value = file.fid;
          }
          if (field.name === 'link') {
            updatedField.value = file.src;
            updatedField.fileName = file.fileName;
            updatedField.thumbnail = file.thumbnail;
            updatedField.preview = file.thumbnail;
          }
          return updatedField;
        });
      }
      else if (file.src && field.fileName === file.fileName) {
        field.src = field.src || file.src;
        field.thumbnail = field.thumbnail || file.src;
        field.preview = field.thumbnail || file.src;

        field.fields = field.fields.map(field => {
          let updatedField = field;
          if (field.name === 'link') {
            updatedField.value = file.src;
            updatedField.fileName = file.fileName;
            updatedField.thumbnail = field.thumbnail || file.src;
            updatedField.preview = field.thumbnail || file.src;
          }
          return updatedField;
        });
      }
      return field;
    });

    // Save to store.
    this.props.handlers.updatePhotos(updatedFields, this.props.sectionName);

    this.setState({
      fields: updatedFields
    });
  };

  handleAddPhoto = (file) => {
    let replacedField = {...this.state.replacedField};
    let updatedFields = [...this.state.fields];


    if (replacedField.oldField) {
      // Replace old one.
      let oldField = replacedField.oldField;
      oldField = {...oldField, ...file};
      oldField.fileName = file.fileName;

      updatedFields.splice(replacedField.index, 1, oldField);
      this.setState({
        fields: updatedFields,
        replacedField: {}
      });
    }
    else {
      // Add new photo.
      let newField = JSON.parse(JSON.stringify(this.state.baseField));

      let maxFileNumber = this.state.maxFileNumber;
      maxFileNumber = updatedFields.length > maxFileNumber ? updatedFields.length : maxFileNumber;

      newField.name = `${this.state.baseField.name}-${maxFileNumber}`;

      newField.fields.map((field) => {
        let updatedField = field;
        updatedField.value = field.name === 'delta' ? updatedFields.length : field.value;
        return updatedField;
      });

      newField = {...newField, ...file};
      updatedFields.push(newField);

      if (typeof this.state.selectedPhoto === 'undefined') {
        updatedFields[0].selected = true;

        this.setState({
          selectedPhoto: 0
        });
      }

      if (this.state.featuredEnabled) {
        let featured = updatedFields.findIndex(e => e.featured);
        // Set first uploaded photo as featured, if no one featured yet.
        if (featured === -1) {
          updatedFields[0].featured = true;
          updatedFields[0].fields.map((field) => {
            let updatedField = field;
            updatedField.value = field.name === 'field_comment_featured_image' ? true : field.value;
            return updatedField;
          });
        }
      }

      this.setState((prevState) => {
        return {
          fields: updatedFields,
          selectedPhoto: prevState.selectedPhoto || 0,
          maxFileNumber: ++maxFileNumber
        };
      });
    }
  };

  handlePhotoClick = (index) => {
    const fields = [...this.state.fields];
    const updatedFields = fields.map((field, curIndex) => {
      field.selected = curIndex == index;
      return field;
    });

    this.setState({
      fields: updatedFields,
      selectedPhoto: index
    });
  };

  handleSortPhotos = (photos) => {
    const updatedPhotos = photos.length && photos.map((photo, photoIndex) => {
      let updated = Object.assign({}, photo);

      updated.fields = updated.fields.map(field => {
        let updatedField = Object.assign({}, field);
        if (updatedField.name === 'delta') {
          updatedField.value = photoIndex;
        }
        return updatedField;
      });
      return updated;
    });

    const newSelected = photos.findIndex(e => e.selected);

    this.setState({
      fields: updatedPhotos,
      selectedPhoto: newSelected
    });

    this.props.handlers.updatePhotos(updatedPhotos, this.props.sectionName);
  };

  handleRemovePhoto = (index) => {
    let fields = [...this.state.fields];
    fields.splice(index, 1);

    this.updateSubmittedData(fields);

    fields.length && fields.map((field, index) => {
      let updated = field;
      updated.fields.map(field => {
        let updatedField = field;
        if (updatedField.name === 'delta') {
          updatedField.value = index;
        }
        return updatedField;
      });
      return updated;
    });

    this.setState(prevState => {
      return {
        fields: fields,
        selectedPhoto: prevState.selectedPhoto - 1 > 0 ? prevState.selectedPhoto - 1 : 0
      }
    });

    // Save to store.
    this.props.handlers.updatePhotos(fields, this.props.sectionName);
  };

  handleRemoveWrongElement = (file) => {
    const fields = [...this.state.fields];

    const index = fields.findIndex(e => (e.fileName === file.fileName));

    fields.splice(index, 1);

    this.updateSubmittedData(fields);

    // Save to store.
    this.props.handlers.updatePhotos(fields, this.props.sectionName);

    this.setState({
      fields: fields,
      selectedPhoto: undefined
    });
  };

  handleRemoveAll = () => {
    this.updateSubmittedData([]);

    this.props.handlers.updatePhotos([], this.props.sectionName);
    this.setState({
      fields: [],
      selectedPhoto: undefined
    });
  };

  // Dispatch removing form submitData...
  updateSubmittedData = (fields) => {
    let updatedData = {};

    for (let field in this.props.submitData) {
      if (field.indexOf(this.state.baseField.name) !== 0) {
        updatedData[field] = this.props.submitData[field];
      }
    }

    if (fields.length === 0) {
      updatedData[this.state.baseField.name] = null;
    }

    this.props.handlers.updateData(updatedData);
  };

  handleChangePhoto = (index, direction) => {
    let fields = [...this.state.fields];
    fields[index].selected = false;

    let newSelectedIndex = index;
    if (direction === 'prev') {
      if (index - 1 >= 0) {
        newSelectedIndex = index - 1;
      }
      else {
        newSelectedIndex = fields.length - 1;
      }
    }
    else {
      if (index + 1 < fields.length) {
        newSelectedIndex = index + 1;
      }
      else {
        newSelectedIndex = 0;
      }
    }


    fields[newSelectedIndex].selected = true;

    this.setState({
      fields: fields,
      selectedPhoto: newSelectedIndex
    });
  };

  handleReplacePhoto = (index) => {
    // Upload new photo.
    let fields = [...this.state.fields];
    let replacedField = {
      index,
      oldField: JSON.parse(JSON.stringify(fields[index]))
    };

    this.setState({
      replacedField
    });

    const sectionName = this.props.sectionName;
    jQuery(`.${sectionName} .dz-clickable`).click();
  };

  handleUpdatePhotoFields = (index, fieldName, value) => {
    let fields = [...this.state.fields];

    // Update fields data.
    // Update featured flag.
    if (fieldName === 'field_comment_featured_image') {
      fields = fields.map((field, fieldIndex) => {
        let updatedField = field;
        if (fieldIndex === index) {
          updatedField.featured = value;
        }
        else {
          updatedField.featured = false;
        }

        // Set featured value for internal fields.
        updatedField.fields = updatedField.fields.map((subField) => {
          let updatedSubField = subField;

          if (updatedSubField.name === fieldName) {
            if (updatedSubField.value !== updatedField.featured) {
              updatedSubField.value = updatedField.featured;
              // Change field value.
              const fieldFeaturedName = `${this.props.sectionName}.${field.name}.${field.name}-${updatedSubField.name}`;
              change('photos', fieldFeaturedName, updatedField.featured);
            }
          }
          return updatedSubField;
        });

        return updatedField;
      });
    }

    // Rest values.
    fields[index].fields = fields[index].fields.map((field) => {
      let updatedField = field;

      if (updatedField.name === fieldName) {
        updatedField.value = value;
      }

      return updatedField;
    });

    this.setState({
      fields: fields,
      currentFeatured: index
    });

    this.props.handlers.updatePhotos(fields, this.props.sectionName);
  };

  componentWillUpdate = (nextProps, nextState) => {
    const currentPhotoValues = this.props.formPhotoValues[this.props.sectionName] || {};
    const nextPhotoValues = nextProps.formPhotoValues[this.props.sectionName] || {};
    if (!deepEqual(currentPhotoValues, nextPhotoValues)) {
      this.prepareComponent(nextProps.formPhotoValues);
    }

    let baseField = {...this.state.baseField};

    const { submitData, formInfoValues } = this.props;
    let currentDate = submitData ? submitData['field_date'] ||
      (formInfoValues ? formInfoValues['field_date'] : '') : '';
    let nextDate = nextProps.submitData ? nextProps.submitData['field_date'] ||
      (nextProps.formInfoValues ? nextProps.formInfoValues['field_date'] : '') : '';


    if (currentDate !== nextDate) {
      baseField.fields = baseField.fields.map((field) => {
        let cleanedField = field;

        if (cleanedField.name === 'field_photo_date') {
          cleanedField.value = nextDate;
        }

        return cleanedField;
      });

      this.setState({
        baseField: baseField,
      });
    }

    let currentContributor = submitData ? submitData['field_contributor'] ||
      (formInfoValues ? formInfoValues['field_contributor']  : '') : '';
    let nextContributor = nextProps.submitData ? nextProps.submitData['field_contributor'] ||
      (nextProps.formInfoValues ? nextProps.formInfoValues['field_contributor']  : '') : '';

    if (currentContributor !== nextContributor) {
      baseField.fields = baseField.fields.map((field) => {
        let cleanedField = field;

        if (cleanedField.name === 'field_photographer_reference') {
          cleanedField.value = nextContributor;
        }

        return cleanedField;
      });

      this.setState({
        baseField: baseField,
      });
    }
  };

  componentWillMount = () => {
    const { photos, submitData, formInfoValues } = this.props;

    // Save base field.
    let baseField = JSON.parse(JSON.stringify(photos));

    // Clear data for baseField.
    baseField.value = '';
    baseField.fid = '';
    baseField.src = '';
    baseField.featured = false;
    baseField.thumbnail = '';
    baseField.fields = baseField.base_field.fields;

    let currentContributor = submitData ? submitData['field_contributor'] ||
      (formInfoValues ? formInfoValues['field_contributor']  : '') : '';

    let currentDate = submitData ? submitData['field_date'] ||
      (formInfoValues ? formInfoValues['field_date'] : '') : '';

    // Set default contributor.
    baseField.fields = baseField.fields.map((field) => {
      let cleanedField = field;

      if (cleanedField.name === 'field_photographer_reference') {
        cleanedField.value = currentContributor;
      }
      if (cleanedField.name === 'field_photo_date') {
        cleanedField.value = currentDate;
      }

      return cleanedField;
    });

    // Set featured flag.
    let featured = baseField.fields.findIndex(e => e.name ===  'field_comment_featured_image');
    if (featured !== -1) {
      this.setState({
        featuredEnabled: true
      });
    }

    this.setState({
      baseField: baseField,
    });
  };

  componentDidMount() {
    this.prepareComponent();
  }

  prepareComponent = (values) => {
    const formPhotoValues = values ? values : this.props.formPhotoValues;

    // Create fields from values.
    if (typeof formPhotoValues[this.props.sectionName] === 'object') {
      let updatedFields = [];
      const photoValue = formPhotoValues[this.props.sectionName];

      for (let property in photoValue) {

        let newField = JSON.parse(JSON.stringify(this.state.baseField));

        newField.name = property;
        newField.src = photoValue[property][`${property}-link`];
        newField.featured = photoValue[property][`${property}-field_comment_featured_image`];

        newField = {...newField, ...photoValue[property][`${property}-link_additional`]};

        // Remove predefined date and contributor.
        newField.fields = newField.fields.map((field) => {
          let cleanedField = field;

          if (cleanedField.name === 'field_photographer_reference') {
            cleanedField.value = photoValue[property][`${property}-field_photographer_reference`] || '';

          }
          if (cleanedField.name === 'field_photo_date') {
            cleanedField.value = photoValue[property][`${property}-field_photo_date`] || '';
          }

          return cleanedField;
        });

        if (photoValue[property][`${property}-delta`] !== "") {
          updatedFields[photoValue[property][`${property}-delta`]] = newField;
        }
        else {
          updatedFields.push(newField);
        }
      }

      updatedFields = updatedFields.filter(function (item) {
        return item !== undefined;
      });

      const selectedPhoto = this.state.selectedPhoto || 0;
      if (updatedFields.length && updatedFields[selectedPhoto]) {
        updatedFields[selectedPhoto].selected = true;
        this.setState({
          selectedPhoto: selectedPhoto
        });
      }

      this.setState({
        fields: updatedFields
      });
    }
  };

  render() {
    const { sectionName, placeholder, fields, formPhotoValues, loading } = this.props;
    const { saveFormValues, showAlert } = this.props.handlers;
    const { selectedPhoto } = this.state;
    let additionalFields = fields.length ? fields.filter(e => e.name === 'group_additional') : [];
    additionalFields = additionalFields[0] ? additionalFields[0].fields : [];

    const visibleFields = this.state.fields.filter(e => e.selected);

    return (
      <Row className={`photos ${sectionName}`}>
        <p>{placeholder}</p>
        <Col span={16} className="grid-upload">
          <div className="photo-grid">
            <SortableGrid
              files={this.state.fields}
              selectedItem={this.state.selectedPhoto}
              handleFileClick={this.handlePhotoClick}
              handleSortFiles={this.handleSortPhotos}
            />
          </div>
          <div className="dropzone">
            <Dropzone
              updatePhoto={this.handleUpdatePhoto}
              addPhoto={this.handleAddPhoto}
              removeWrong={this.handleRemoveWrongElement}
              fieldName={sectionName}
            />
          </div>
          <PhotosSubForm
            sectionName={sectionName}
            fields={additionalFields}
            saveFormValues={saveFormValues}
            loading={loading}
          />

          {this.state.fields.length ?
            <Popconfirm
              placement="topLeft"
              title="Are you sure you want to delete all photos?"
              onConfirm={this.handleRemoveAll}
              okText="Yes"
              cancelText="No">
              <span className="button btn-remove-all">{`Delete all ${placeholder}`}</span>
            </Popconfirm> : ''}
        </Col>
        <Col span={8} className="photo-form">
          <PhotosForm
            sectionName={sectionName}
            visibleFields={visibleFields[0]}
            selectedPhoto={selectedPhoto}
            fields={this.state.fields}
            saveFormValues={saveFormValues}
            formPhotoValues={formPhotoValues}
            handleRemovePhoto={this.handleRemovePhoto}
            handleChangePhoto={this.handleChangePhoto}
            handleReplacePhoto={this.handleReplacePhoto}
            handleUpdatePhotoFields={this.handleUpdatePhotoFields}
            loading={loading}
          />
        </Col>
      </Row>
    )
  }
}

PhotoSection.propTypes = {
  sectionName: PropTypes.string,
  photos: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  fields: PropTypes.array,
  handlers: PropTypes.object,
};

export default PhotoSection;