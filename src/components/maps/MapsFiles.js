import React from 'react';
import MapsFileSection from './MapsFileSection';
import { FormSection } from 'redux-form';

class MapsFiles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseField: {},
      fields: []
    }
  }

  handleAddField = () => {
    const updatedFields = [...this.state.fields];
    const baseField = this.state.baseField;

    let newField = JSON.parse(JSON.stringify(baseField));
    newField.name = `${baseField.name}-${updatedFields.length}`;

    if (newField.fields) {
      newField.fields.map((field) => {
        let updatedField = field;
        if (updatedField.name === 'delta') {
          updatedField.value = updatedFields.length;
        }
        return updatedField;
      });
    }

    updatedFields.push(newField);

    this.setState({
      fields: updatedFields,
    });

    this.props.handlers.updateMaps(newField, newField.name);
  };

  handleRemoveField = (index) => {
    let updatedFields = [...this.state.fields];

    this.props.handlers.updateMaps(false, updatedFields[index].name);


    updatedFields.splice(index, 1);

    this.setState({
      fields: updatedFields,
    });

    // Dispatch removing form submitData...
    let updatedData = {};
    for (let field in this.props.submitData) {
      if (field.indexOf(this.state.baseField.name) !== 0) {
        updatedData[field] = this.props.submitData[field];
      }
    }

    if (updatedFields.length === 0) {
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
    if (!this.state.fields.length ||
      Object.keys(nextProps.formMapsValues).length !== Object.keys(this.props.formMapsValues).length) {
      this.prepareComponent(nextProps.formMapsValues);
    }
  }

  prepareComponent = (values) => {
    const formMapsValues = values;
    const { baseField } = this.state;

    if (!baseField) return;

    if (typeof formMapsValues === 'object') {
      let updatedFields = [];

      for (let property in formMapsValues) {
        if (property.indexOf(this.state.baseField.name) === 0) {
          let newField = JSON.parse(JSON.stringify(this.state.baseField));
          newField.name = property;
          updatedFields.push(newField);
        }
      }

      if (!updatedFields.length) {
        let newField = JSON.parse(JSON.stringify(baseField));
        newField.name = `${baseField.name}-0`;

        if (newField.fields) {
          newField.fields.map((field) => {
            let updatedField = field;
            if (updatedField.name === 'delta') {
              updatedField.value = 0;
            }
            return updatedField;
          });
        }

        updatedFields.push(newField);
        this.props.handlers.updateMaps(newField, newField.name);
      }

      this.setState({
        fields: updatedFields
      });
    }
  };

  render() {
    const { handlers, change, formMapsValues, loading } = this.props;

    // Construct output of all fields.
    const output = this.state.fields.map((field, index) => (
      <MapsFileSection
        key={field.name}
        index={index}
        files={field}
        change={change}
        formMapsValues={formMapsValues}
        handlers={handlers}
        handleRemoveSection={this.handleRemoveField}
        loading={loading}
      />
    ));

    return (
      <div>
        {output}
        <span className="button add-field" onClick={this.handleAddField}>Add another</span>
      </div>
    );
  }
}

export default MapsFiles;