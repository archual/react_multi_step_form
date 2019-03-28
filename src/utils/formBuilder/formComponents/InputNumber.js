import React from 'react';
import { InputNumber as InputNumberAntd } from 'antd';
import Label from './Label';
import PropTypes from 'prop-types';

class InputNumber extends React.Component {
  render() {
    const { input: { value, onChange } } = this.props;
    const { field, required, disabled } = this.props;
    return (
      <div className="text-field">
        {field.label !== 'hidden' &&
          <Label field={field} required={required}/>
        }
        <InputNumberAntd
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          disabled={disabled}
        />
      </div>
    );
  }
}

InputNumber.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func
};

export default InputNumber;