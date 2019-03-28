import React from 'react';
import SortableMultiField from '../formComponents/SortableMultiField';
import { FormSection, connect } from 'react-redux';
import Label from './Label';
import { change } from 'redux-form';
import { updateMultiValues, updateData } from '../../../actions/AppActions';
import PropTypes from 'prop-types';

class MultiValueField extends React.Component {
  constructor() {
    super();

    this.state = {
      baseField: {},
      fields: []
    };
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

    this.props.dispatch(updateMultiValues(this.state.baseField, updatedFields, this.props.formName));
  };

  handleRemoveField = (index) => {
    let fields = [...this.state.fields];
    fields.splice(index, 1);

    // Dispatch removing form submitData...
    let updatedData = {};
    for (let field in this.props.appState.submitData) {
      if (field.indexOf(this.state.baseField.name) !== 0) {
        updatedData[field] = this.props.appState.submitData[field];
      }
    }

    if (fields.length === 0) {
      updatedData[this.state.baseField.name] = null;
    }

    this.props.dispatch(updateData(updatedData));

    this.props.dispatch(updateMultiValues(this.state.baseField, fields, this.props.formName));
  };

  handleSortFields = (sortedFields) => {
    sortedFields.length && sortedFields.map((field, fieldIndex) => {
      let updated = Object.assign({}, field);

      updated.fields = updated.fields.map(subField => {
        let updatedField = subField;
        if (updatedField.name === 'delta') {
          updatedField.value = fieldIndex;
        }
        return updatedField;
      });
      return updated;
    });

    this.setState({
      fields: sortedFields
    });

    this.props.dispatch(updateMultiValues(this.state.baseField, sortedFields, this.props.formName));
  };

  componentWillMount() {
    // Save base field.
    let baseField = JSON.parse(JSON.stringify(this.props.field));
    baseField.fields = baseField.base_field.fields;
    baseField.cardinality = 1;

    this.setState({
      baseField: baseField
    });
  }

  componentWillReceiveProps(nextProps) {
    const { form, formName } = nextProps;
    const { baseField } = this.state;

    if (!baseField) return;

    let updatedFields = [];


    for (let field in form[formName].values) {
      if (field === `${baseField.name}-${updatedFields.length}`) {
        let newField = JSON.parse(JSON.stringify(baseField));
        newField.name = field;
        newField.fields && newField.fields.map((field, index) => {
          let updatedField = field;
          if (updatedField.name === 'delta') {
            updatedField.value = updatedFields.length;
          }
          return updatedField;
        });

        updatedFields.push(newField);
      }
    }

    if (!updatedFields.length) {
      let newField = JSON.parse(JSON.stringify(baseField));
      newField.name = `${baseField.name}-0`;
      updatedFields.push(newField);
    }

    this.setState({
      fields: updatedFields,
    });
  }

  render() {
    const { name, field, placeholder, normalize, required, disabled } = this.props;
    const output = <SortableMultiField
      fields={this.state.fields}
      handleRemoveField={this.handleRemoveField}
      handleSort={this.handleSortFields}
      normalize={normalize}
      name={name}
      disabled={disabled}
    />;

    return (
      <div>
        <Label field={field} required={required}/>
        {output}
        <span className="button add-field" onClick={this.handleAddField}>Add another</span>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    appState: state.appState,
    form: state.form
  }
}

MultiValueField.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func
};

export default connect(mapStateToProps)(MultiValueField);