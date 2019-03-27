import React from 'react';
import { DatePicker as DatePickerAntd } from 'antd';
import Label from './Label';
import moment from 'moment';
import PropTypes from 'prop-types';


class DatePicker extends React.Component {
  onChangeHandler = (date, dateString) => {
    this.props.input.onChange(dateString);
  };

  render() {
    const { field, required, disabled } = this.props;
    const value = this.props.input.value ? moment(this.props.input.value, field.format) : null;
    return (
      <div className="date-field">
        <Label field={field} required={required}/>
        <DatePickerAntd
          onChange={this.onChangeHandler}
          value={value}
          format={field.format}
          disabled={disabled}
        />
      </div>
    );
  }
}

DatePicker.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func
};

export default DatePicker;