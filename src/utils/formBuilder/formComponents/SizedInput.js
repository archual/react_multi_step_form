import React from 'react';
import { Input as InputAntd } from 'antd';
import Label from './Label';
import PropTypes from 'prop-types';

class SizedInput extends React.Component {
  render() {
    let { input: { value, onChange } } = this.props;
    const { field, required, disabled } = this.props;
    const counter = field.max_length - value.length;
    const alertClass = counter <= 0 ? 'red' : (counter < field.max_length * 0.1 ? 'orange' : '');

    return (
      <div className="sized-input">
        {field.label !== 'hidden' &&
          <Label field={field} required={required}/>
        }
        <InputAntd
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          disabled={disabled}
          addonAfter={<span className={alertClass}>{counter}</span>}
        />
      </div>
    );
  }
}

SizedInput.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func
};

export default SizedInput;