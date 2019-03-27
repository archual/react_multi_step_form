import React from 'react';
import { Checkbox as CheckboxAntd } from 'antd';
import Label from './Label';
import PropTypes from 'prop-types';

class CheckBox extends React.Component {
  render() {
    const { input: { value, onChange } } = this.props;
    const { field, disabled } = this.props;
    const label = field.placeholder;
    return (
      <CheckboxAntd
        checked={!!value}
        onChange={onChange}
        name={field.name}
        disabled={disabled}
      >
        {label}
      </CheckboxAntd>
    );
  }
}

CheckBox.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func
};

export default CheckBox;