import React from 'react';
import { Cascader } from 'antd';
import Label from './Label';
import PropTypes from 'prop-types';

class HierarchicalSelect extends React.Component {
  constructor() {
    super();

    this.state = {
      options: []
    }
  }

  onChangeHandler = (value, selectedOptions) => {
    this.props.input.onChange(value);
  };

  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // Get new values for second select.
    fetch(`/${this.props.field.autocomplete}/${targetOption.value}`, {
      method: 'get',
      credentials: 'same-origin'
    })
      .then((response) => response.json())
      .then((responseData) => {
        targetOption.loading = false;

        if (responseData.length) {
          targetOption.children = responseData.map((option) => (
              {
                value: option.key,
                label: option.value
              }
            )
          );
        }
        this.setState({
          options: [...this.state.options],
        });
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error);
      });

  };

  componentDidMount() {
    const options = this.props.field.options.map((option) => {
        return {
          value: option.key,
          label: option.value,
          isLeaf: !option.children
        }
      }
    );

    // Load second level options, if we have second initial value.
    if (this.props.input.value && this.props.input.value.length > 1) {
      const value = this.props.input.value[0];
      const selectedOption = options.filter(e => e.value === value);
      this.loadData(selectedOption);
    }

    this.setState({
      options: options
    })
  }

  componentWillUpdate(nextProps) {
    if (nextProps.input.value[0] && !this.props.input.value && !nextProps.meta.dirty) {
      const options = nextProps.field.options.map((option) => {
          return {
            value: option.key,
            label: option.value,
            isLeaf: !option.children
          }
        }
      );

      // Load second level options, if we have second initial value.
      if (nextProps.input.value && nextProps.input.value.length > 1) {
        const value = nextProps.input.value[0];
        const selectedOption = options.filter(e => e.value === value);
        this.loadData(selectedOption);
      }

      this.setState({
        options: options
      })
    }
  }

  render() {
    const value = this.props.input.value ? this.props.input.value : [];
    const { field, required, disabled } = this.props;

    return (
      <div className="hierarchical-field">
        {!field.show_label &&
          <Label field={field} required={required}/>
        }
        <Cascader
          placeholder={field.placeholder}
          options={this.state.options}
          value={value}
          loadData={this.loadData}
          onChange={this.onChangeHandler}
          disabled={disabled}
          changeOnSelect
        />
      </div>
    );
  }
}

HierarchicalSelect.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func
};

export default HierarchicalSelect;