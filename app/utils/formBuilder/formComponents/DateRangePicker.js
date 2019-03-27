import React from 'react';
import moment from 'moment';
import { DatePicker as DatePickerAntd } from 'antd';
import Label from './Label';
import PropTypes from 'prop-types';

const { RangePicker } = DatePickerAntd;

class DateRangePicker extends React.Component {
  onChangeHandler = (value, dateString) => {
    const values = {
      0: dateString[0],
      1: dateString[1]
    };
    this.props.input.onChange(values);
  };

  render() {
    const { field, required, disabled } = this.props;
    const value = this.props.input.value ? this.props.input.value : null;
    const value1 = value && value[0] ? moment(value[0], field.format) : null;
    const value2 = value && value[1] ? moment(value[1], field.format) : null;

    return (
      <div className="date-field">
        {!field.show_label &&
          <Label field={field} required={required}/>
        }
        <RangePicker
          placeholder={['Start Time', 'End Time']}
          value={[value1, value2]}
          format={field.format}
          onChange={this.onChangeHandler}
          disabled={disabled}
        />
      </div>
    );
  }
}

DateRangePicker.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func
};

export default DateRangePicker;