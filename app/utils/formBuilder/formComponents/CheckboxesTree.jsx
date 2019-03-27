import React from 'react';
import { Field } from 'redux-form';
import CheckBox from './CheckBox';
import Label from './Label';
import PropTypes from 'prop-types';

class CheckboxesTree extends React.Component {
  render() {
    const { name, field, required, options, normalize, disabled } = this.props;
    let checkboxes = [];

    {options && options.forEach((option, index) => {
      let element = (
      <label className={'child' + (option.depth ? ' depth-' + option.depth : '')}>
        <Field
          name={`${name}-${option.key}`}
          component={CheckBox}
          field={{name: `${name}-${option.key}`, placeholder: option.value}}
          disabled={disabled}
          normalize={normalize}
        />
      </label>
      );

      if (index > 0 && option.group !== options[index - 1].group) {
        checkboxes.push(<div key={option.key + index} className={`delimiter-line`}>&nbsp;</div>);
      }

      checkboxes.push(<div key={option.key} className={`checkbox-wrapper group-${option.group}`}>{element}</div>);
    })}

    const markup = <div>{checkboxes}</div>;

    return <div className="clearfix">
      <Label field={field} required={required}/>
      {markup}
    </div>
  }
}

CheckboxesTree.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func,
  options: PropTypes.array.isRequired
};

export default CheckboxesTree;
