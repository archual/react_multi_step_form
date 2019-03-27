import React from 'react';
import { Input as InputAntd } from 'antd';
import Label from './Label';
import PropTypes from 'prop-types';

class Input extends React.Component {
  render() {
    const { input: { value, onChange } } = this.props;
    const { field, required, disabled } = this.props;
    return (
      <div className="text-field">
        {field.label !== 'hidden' &&
          <Label field={field} required={required}/>
        }
        <InputAntd
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          disabled={disabled}
        />
      </div>
    );
  }
}

Input.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func
};

export default Input;