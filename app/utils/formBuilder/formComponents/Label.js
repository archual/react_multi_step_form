import React from 'react';
import {Icon, Tooltip} from 'antd';
import PropTypes from 'prop-types';

class Label extends React.Component {
  render() {
    const {field, required, labelClass} = this.props;
    let classes = field.class ? field.class.join(' ') : '';
    classes = labelClass ? `${classes} ${labelClass}` : classes;
    return (
      <label className={classes}>
        {field.placeholder}
        {required && (
          <Tooltip placement="top" arrowPointAtCenter={true}
                   title="Required field">
            <Icon type="exclamation-circle-o" style={{fontSize: 14, verticalAlign: 'initial', margin: '0 5px'}}/>
          </Tooltip>
        )}
        {field.description && (
          <Tooltip placement="right" arrowPointAtCenter={true}
                   title={<div dangerouslySetInnerHTML = {{__html: field.description}} />}>
            <Icon type="question-circle-o" style={{fontSize: 14, verticalAlign: 'initial', margin: '0 5px'}}/>
          </Tooltip>)}
      </label>
    )
  }
}

Label.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool
};

export default Label;