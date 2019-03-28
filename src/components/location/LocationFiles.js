import React from 'react';
import { Row, Col } from 'antd';
import DropzoneFiles from '../DropZoneFiles';
import SortableGrid from '../SortableGrid';
import LocationFilesForm from './LocationFilesForm';
import PropTypes from 'prop-types';

class LocationFiles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseField: {},
      fields: [],
      selectedFile: false,
      maxFileNumber: 0
    };
  }

  handleUpdateFile = (file) => {
    const fields = [...this.state.fields];

    const updatedFields = fields.map((field, index) => {
      let updatedField = JSON.parse(JSON.stringify(field));
      if (file.fid && updatedField.fileName === file.fileName) {
        updatedField.value = file.fid;
        updatedField.fid = file.fid;
        updatedField.src = file.src;

        updatedField.fields = updatedField.fields.map(subField => {
          let updatedSubField = JSON.parse(JSON.stringify(subField));
          if (updatedSubField.name === 'fid') {
            updatedSubField.value = file.fid;
          }
          if (updatedSubField.name === 'link') {
            updatedSubField.value = file.src;
            updatedSubField.fileName = file.fileName;
          }
          return updatedSubField;
        });
      }
      else if (file.src && updatedField.fileName === file.fileName) {
        updatedField.src = updatedField.src || file.src;

        updatedField.fields = updatedField.fields.map(subField => {
          let updatedSubField = JSON.parse(JSON.stringify(subField));
          if (updatedSubField.name === 'link') {
            updatedSubField.value = file.src;
            updatedSubField.fileName = file.fileName;
          }
          return updatedSubField;
        });
      }
      return updatedField;
    });

    // Save to store.
    this.props.handlers.updateGPSFiles(updatedFields);

    this.setState({
      fields: updatedFields
    });
  };

  handleAddFile = (file) => {
    let updatedFields = [...this.state.fields];

    // Add new GPS file.
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

    const selectedFile = updatedFields.findIndex(e => e.selected);

    if (selectedFile === -1) {
      updatedFields[0].selected = true;

      this.setState({
        selectedFile: 0
      });
    }

    this.setState((prevState) => {
      return {
        fields: updatedFields,
        selectedFile: prevState.selectedFile || 0,
        maxFileNumber: ++maxFileNumber
      };
    });
  };

  handleFileClick = (index) => {
    const fields = [...this.state.fields];
    const updatedFields = fields.map((field, curIndex) => {
      field.selected = curIndex == index;
      return field;
    });

    this.setState({
      fields: updatedFields,
      selectedFile: index
    });
  };

  handleSortFiles = (files) => {
    files.length && files.map((file, fileIndex) => {
      let updated = file;
      updated.fields = updated.fields.map(field => {
        let updatedField = field;
        if (updatedField.name === 'delta') {
          updatedField.value = fileIndex;
        }
        return updatedField;
      });
      return updated;
    });

    this.setState({
      fields: files
    });

    this.props.handlers.updateGPSFiles(files);
  };

  handleRemoveFile = (index) => {
    let fields = [...this.state.fields];
    fields.splice(index, 1);

    this.updateSubmitedData(fields);

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

    // Save to store.
    this.props.handlers.updateGPSFiles(fields);

    this.setState({
      fields: fields,
      selectedFile: false
    });
  };

  handleRemoveWrongElement = (file) => {
    const fields = [...this.state.fields];

    const index = fields.findIndex(e => (e.fileName === file.fileName));

    fields.splice(index, 1);

    this.updateSubmitedData(fields);

    // Save to store.
    this.props.handlers.updateGPSFiles(fields);

    this.setState({
      fields: fields,
      selectedFile: undefined
    });
  };


  // Dispatch removing form submitData.
  updateSubmitedData = (fields) => {
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

  componentWillMount = () => {
    const { fields } = this.props;

    // Save base field.
    let baseField = JSON.parse(JSON.stringify(fields));

    // Clear data for baseField.
    baseField.value = '';
    baseField.fid = '';
    baseField.src = '';
    baseField.fields = baseField.base_field.fields;

    this.setState({
      baseField: baseField,
      fields: [],
    });
  };

  componentWillUpdate(nextProps) {
    const currentGPSFilesValues = this.props.formGPSFilesValues || {};
    const nextGPSFilesValues = nextProps.formGPSFilesValues || {};

    if (Object.keys(currentGPSFilesValues).length !== Object.keys(nextGPSFilesValues).length) {
      const { formGPSFilesValues } = nextProps;
      this.prepareComponent(formGPSFilesValues);
    }
  }

  componentDidMount() {
    this.prepareComponent(this.props.formGPSFilesValues);
  }

  prepareComponent(formGPSFilesValues) {
    if (typeof formGPSFilesValues === 'object') {
      let updatedFields = [];

      for (let property in formGPSFilesValues) {

        let newField = JSON.parse(JSON.stringify(this.state.baseField));
        newField.name = property;
        newField.src = formGPSFilesValues[property][`${property}-link`];
        newField = {...newField, ...formGPSFilesValues[property][`${property}-link_additional`]};

        if (formGPSFilesValues[property][`${property}-delta`] !== "") {
          updatedFields[formGPSFilesValues[property][`${property}-delta`]] = newField;
        }
        else {
          updatedFields.push(newField);
        }
      }

      updatedFields = updatedFields.filter(function (item) {
        return item !== undefined;
      });

      updatedFields.length && (updatedFields[0].selected = true);

      this.setState({
        fields: updatedFields,
        selectedFile: 0
      });
    }
  }

  render() {
    const { fields, loading } = this.props;
    const extensions = fields && (fields.extensions || 'pdf');
    const { saveFormValues } = this.props.handlers;
    const { selectedFile } = this.state;

    return (
      <Row className="locations row">
        <Col span={16} className="grid-upload">
          <div className="files-grid">
            <SortableGrid
              files={this.state.fields}
              handleFileClick={this.handleFileClick}
              handleSortFiles={this.handleSortFiles}
            />
          </div>
          <div className="dropzone">
            <DropzoneFiles
              updateFile={this.handleUpdateFile}
              addFile={this.handleAddFile}
              removeWrong={this.handleRemoveWrongElement}
              fieldName={'field_gpx_file_upload'}
              fieldExtensions={extensions}
            />
          </div>
        </Col>
        <Col span={8} className="files-form">
          <LocationFilesForm
            fields={this.state.fields}
            selectedFile={selectedFile}
            saveFormValues={saveFormValues}
            handleRemoveFile={this.handleRemoveFile}
            loading={loading}
          />
        </Col>
      </Row>
    );
  }
}

LocationFiles.propTypes = {
  fields: PropTypes.object.isRequired,
  formGPSFilesValues: PropTypes.object.isRequired,
  handlers: PropTypes.object,
};

export default LocationFiles;