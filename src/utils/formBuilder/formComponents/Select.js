import React from 'react';
import { Select as SelectAntd } from 'antd';
import Label from './Label';
import PropTypes from 'prop-types';

const { Option, OptGroup } = SelectAntd;

class Select extends React.Component {
  // Create select options list.
  getOptionsList = (elements) => {
    return elements ? elements.map((option, index) => {
      let element;
      if (option.children) {
        element = <OptGroup key={option.key} label={option.value}>
          {this.getOptionsList(option.options)}
        </OptGroup>
      }
      else {
        element = <Option key={option.key} value={option.key + ''}>
          {option.value}
        </Option>
      }
      return element;
    }) : '';
  };


  render() {
    const { input: { value, onChange } } = this.props;
    const { field, required, options, disabled } = this.props;
    const output = this.getOptionsList(options);

    return (
      <div className="select">
        {field.label !== 'hidden' &&
          <Label field={field} required={required}/>
        }
        <SelectAntd
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          <Option value="">Choose one:</Option>
          {output}
        </SelectAntd>
      </div>
    );
  }
}

Select.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func,
  options: PropTypes.array.isRequired
};

export default Select;