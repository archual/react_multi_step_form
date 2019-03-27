import React from 'react';
import { Radio as RadioAntd } from 'antd';
import Label from './Label';
import PropTypes from 'prop-types';

const RadioButton = RadioAntd.Button;
const RadioGroup = RadioAntd.Group;

class RadioSwitcher extends React.Component {
  render() {
    const { input: { value, onChange } } = this.props;
    const { field, required, options, disabled } = this.props;

    const markup = options.map((option, index) => (
      <RadioButton key={option.key} value={option.key + ''} disabled={disabled}>{option.value}</RadioButton>
    ));

    return (
      <span className={`children-${options.length}`}>
        <Label field={field} required={required}/>

        <RadioGroup onChange={onChange} value={value}>
          {markup}
        </RadioGroup>
      </span>
    );
  }
}

RadioSwitcher.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func,
  options: PropTypes.array.isRequired
};

export default RadioSwitcher;