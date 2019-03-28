import React from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import { FormSection } from 'redux-form';
import { getFormMarkup } from '../universalFormBuilder';
import { Popconfirm } from 'antd';
import PropTypes from 'prop-types';

const SortableItem = SortableElement(({value, name, position, handleRemoveField, normalize, loading}) => {
  const fields = value.length ? value : [value];
  const output = getFormMarkup(loading, fields, fields[0].name, {}, normalize);
  return <li className="noselect">
    <div className="wrapper">
      <FormSection name={fields[0].name}>
        {output}
      </FormSection>
      <Popconfirm
        placement="topLeft"
        title="Are you sure you want to delete this field?"
        onConfirm={handleRemoveField.bind(this, position)}
        okText="Yes"
        cancelText="No">
        <span className="button remove-field">Remove</span>
      </Popconfirm>
    </div>
  </li>
});

const SortableList = SortableContainer(({items, name, handleRemoveField, normalize, loading}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          name={name}
          position={index}
          value={value}
          handleRemoveField={handleRemoveField}
          normalize={normalize}
          loading={loading}
        />
      ))}
    </ul>
  );
});

class SortableMultiField extends React.Component {
  state = {
    items: this.props.fields,
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    this.props.handleSort(arrayMove(this.props.fields, oldIndex, newIndex));
  };

  render() {
    const { handleRemoveField, name, normalize, fields, disabled } = this.props;
    return <div className="sortable-list">
      <SortableList
        axis="y"
        items={fields}
        name={name}
        onSortEnd={this.onSortEnd}
        handleRemoveField={handleRemoveField}
        pressDelay={150}
        normalize={normalize}
        loading={disabled}
      />
    </div>;
  }
}

SortableMultiField.propTypes = {
  fields: PropTypes.array,
  handleRemoveField: PropTypes.func,
  handleSort: PropTypes.func,
  normalize: PropTypes.func
};

export default SortableMultiField;