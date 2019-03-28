import React from 'react';
import { Input } from 'antd';
import Label from './Label';
import PropTypes from 'prop-types';

const TextAreaAntD = Input.TextArea;

class TextArea extends React.Component {  render() {
    const { input: { value, onChange } } = this.props;
    const { field, required, disabled } = this.props;
    return (
      <div className="text-field">
        {field.label !== 'hidden' &&
          <Label field={field} required={required}/>
        }
        <TextAreaAntD
          rows={4}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          disabled={disabled}
        />
      </div>
    );
  }
}

TextArea.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func
};

export default TextArea;