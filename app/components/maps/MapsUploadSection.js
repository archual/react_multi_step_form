import React from 'react';
import DropzoneFiles from '../DropZoneFiles';
import MapsFilesList from './MapsFilesList';
import { FormSection } from 'redux-form';
import { getFormMarkup } from '../../utils/formBuilder/universalFormBuilder';

class MapsUploadSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadTab: true,
      baseField: {},
      field: false,
      fileName: null,
    };
  }

  handleUpdateFile = (file) => {
    if (!this.state.field) return;

    let field = {...{}, ...this.state.field};

    if (file.fid && field.fileName === file.fileName) {
      field.value = file.fid;
      field.fields.map((subField) => {
        let updatedField = subField;
        if (updatedField.name === 'fid') {
          updatedField.value = file.fid;
          // Change field value.
          const fidFieldFidName = `${this.props.name}.${this.props.name}-${this.state.baseField.name}-fid`;
          this.props.change(fidFieldFidName, file.fid);
        }
        return updatedField;
      });
    }
    if (file.src && field.fileName === file.fileName) {
      field.src = file.src;
      field.fields.map((subField) => {
        let updatedField = subField;
        if (updatedField.name === 'link') {
          updatedField.value = file.src;
        }
        return updatedField;
      });
    }

    field = {...field, ...file};

    this.setState({
      field: field,
    });


    this.props.handlers.updateMaps(field, this.props.name);
  };

  handleAddFile = (file) => {
    // Add new file.
    let newField = JSON.parse(JSON.stringify(this.state.baseField));

    newField.fields.map((field) => {
      let updatedField = field;
      updatedField.value = field.name === 'delta' ? 0 : field.value;
      return updatedField;
    });

    newField = {...newField, ...file};

    this.setState({
      field: newField,
    });
  };

  handleRemoveFile = () => {
    this.setState({
      field: false
    });

    this.props.handlers.updateMaps(this.state.baseField, this.props.name, true);
  };

  // Set fid from reference fields to pdf-fid.
  setFid = (fieldName) => (value) => {
    if (value && fieldName) {
      const field = fieldName.split('-');
      const fidFieldFidName = `${field[0]}-${field[1]}.${field[0]}-${field[1]}-${this.state.baseField.name}-fid`;
      const matches = value.match(/^\s*(.*)\s+\[fid\:(\d+)\]\s*$/);
      if (matches) {
        const fileName = matches[1];
        const fid = matches[2];

        if (fid) {
          this.props.change(fidFieldFidName, fid);
        }
        if (fileName) {
          // Add new file.
          let newField = JSON.parse(JSON.stringify(this.state.baseField));

          newField.fields.map((field) => {
            let updatedField = field;
            updatedField.value = field.name === 'delta' ? 0 : field.value;
            return updatedField;
          });

          newField.fileName = fileName;

          this.setState({
            field: newField,
          });
        }
      }
    }
    return value;
  };

  // Save base field.
  componentWillMount = () => {
    const { field } = this.props;

    let baseField = JSON.parse(JSON.stringify(field));

    this.setState({
      baseField: baseField
    });
  };

  componentWillUpdate(nextProps) {
    const { formMapsValues, name, field } = nextProps;

    if (!this.state.field && formMapsValues[name] && formMapsValues[name][`${name}-${field.name}-fid`]) {
      let newField = JSON.parse(JSON.stringify(this.state.baseField));

      newField = {...newField, ...formMapsValues[name][`${name}-${field.name}-link_additional`]};

      this.setState({
        field: newField
      });

      // Change tab, if it is reference.
      if (formMapsValues[name] && formMapsValues[name][`${name}-${field.name}-reference`]) {
        this.handleTabClick('reference');
      }
      else {
        this.handleTabClick('upload');
      }
    }
  }

  handleTabClick = (tab) => {
    if (tab === 'upload') {
      this.setState({
        uploadTab: true
      });
    }
    else {
      this.setState({
        uploadTab: false
      });
    }
  };

  render() {
    const { name, field, loading } = this.props;
    const { baseField } = this.state;
    const uploadTabState = this.state.uploadTab;
    const callbacks = [
      {
        name: 'reference',
        callback: this.setFid
      }
    ];

    return (
      <div className="maps-file-section">
        <label>{`Map-${field.placeholder}`}</label>
        <div className="tabs">
          <span className={`tab ${uploadTabState ? 'active' : ''}`} onClick={this.handleTabClick.bind(this, 'upload')}>Upload</span>
          <span className={`tab ${uploadTabState ? '' : 'active'}`} onClick={this.handleTabClick.bind(this, 'reference')}>Reference existing</span>
        </div>

        <div className={`file-upload-tab  ${uploadTabState ? '' : 'hide'}`}>
          <div className="files-list">
            <MapsFilesList
              field={this.state.field}
              buttonVisible={uploadTabState && this.state.field}
              handleRemoveFile={this.handleRemoveFile}
            />
          </div>

          <div className={`dropzone ${!this.state.field ? '' : 'hide'}`}>
            <DropzoneFiles
              updateFile={this.handleUpdateFile}
              addFile={this.handleAddFile}
              removeWrong={this.handleRemoveFile}
              fieldName={baseField.name}
              fieldExtensions={baseField.extensions}
              maxFiles={1}
              field={this.state.field}
            />
          </div>
        </div>
        <div className={`pdf-fields ${uploadTabState ? 'hide' : ''}`}>
          {field.fields ? getFormMarkup(!loading ? false : loading.state, field.fields, field.name, {}, callbacks, `${name}-${field.name}`) : ''}
        </div>
      </div>
    );
  }
}

export default MapsUploadSection;