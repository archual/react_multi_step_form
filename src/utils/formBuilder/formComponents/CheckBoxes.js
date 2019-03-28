import React from 'react';
import { Field } from 'redux-form';
import CheckBox from './CheckBox';
import Label from './Label';
import PropTypes from 'prop-types';

class CheckBoxes extends React.Component {
  render() {
    const { name, field, required, options, normalize, disabled } = this.props;
    const classes = field.class ? field.class.join(' ') : '';

    const markup = options && options.map((option, index) => (
        <Field
          key={option.key}
          name={`${name}-${option.key}`}
          component={CheckBox}
          field={{name: `${name}-${option.key}`, placeholder: option.value}}
          disabled={disabled}
          normalize={normalize}
        />
    ));

    return (
      <div className={classes}>
        {(field.show_label || typeof field.show_label === 'undefined') &&
          <Label field={field} required={required}/>
        }
        <div className="checkboxes-group">
          {markup}
        </div>
      </div>
    );
  }
}

CheckBoxes.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func,
  options: PropTypes.array.isRequired
};

export default CheckBoxes;