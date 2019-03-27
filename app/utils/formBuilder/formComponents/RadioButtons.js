import React from 'react';
import { Radio as RadioAntd } from 'antd';
import Label from './Label';
import PropTypes from 'prop-types';

const RadioGroup = RadioAntd.Group;

class RadioButtons extends React.Component {
  render() {
    const { input: { value, onChange } } = this.props;
    const { field, required, options, disabled } = this.props;
    const { empty_option } = field;

    const updatedOptions = (empty_option && !required) ? [{key: '', value: 'N/A'}, ...options] : options;

    const markup = updatedOptions.map((option, index) => (
      <RadioAntd key={option.key} value={option.key + ''} disabled={disabled}>{option.value}</RadioAntd>
    ));

    return (
      <div>
        <Label field={field} required={required}/>
        <RadioGroup onChange={onChange} value={value}>
          {markup}
        </RadioGroup>
      </div>
    );
  }
}

RadioButtons.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func,
  options: PropTypes.array.isRequired
};

export default RadioButtons;