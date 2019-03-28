import React from 'react';
import { Form, AutoComplete } from 'antd';
import Label from './Label';
import { connect } from 'react-redux';
import { toggleButtons } from '../../../actions/AppActions';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

const Option = AutoComplete.Option;
const FormItem = Form.Item;

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class AutocompleteField extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
      suggestionsObject: {},
      valid: true,
      changed: false
    };
  }

  onChange = (newValue) => {
    const key = Object.keys(this.state.suggestionsObject).find(key => this.state.suggestionsObject[key] === newValue);
    const value = key || newValue || '';

    if (this.props.customNormilize) {
      this.props.customNormilize(value, this.props.input.name);
    }

    this.props.input.onChange(value);

    this.setState({
      value: value
    });
  };

  getSuggestionValue = (suggestion) => {
    const key = Object.keys(this.state.suggestionsObject).find(key => this.state.suggestionsObject[key] === suggestion);
    this.props.input.onChange(key);
    this.setState({
      value: key
    });
  };

  // Fetch suggestions from request.
  onSuggestionsFetchRequested = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      this.setState({
        suggestions: [],
        suggestionsObject: []
      });
      return;
    }

    // Get data from DB.
    fetch(`/${this.props.field.autocomplete}/${escapedValue}`, {
      method: 'get',
      credentials: 'same-origin'
    })
      .then((response) => response.json())
      .then((responseData) => {

        let data = [];
        for (let property in responseData) {
          data.push(responseData[property]);
        }

        this.setState({
          suggestions: data,
          suggestionsObject: responseData
        });
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error);
      });
  };

  onBlur = () => {
    if (!this.state.valid) {
      this.onChange('');
    }
  };

  componentDidUpdate() {
    if (this.props.meta.dirty && this.state.value.length > 0 && !this.state.suggestionsObject[this.state.value] && this.state.valid) {
      this.setState({
        valid: false,
      });
      this.props.actions.toggleButtons(true);
    }
    else if ((this.state.value.length === 0 || this.state.suggestionsObject[this.state.value]) && !this.state.valid) {
      this.setState({
        valid: true,
      });
      this.props.actions.toggleButtons(false);
    }

    if (this.state.value === '' && this.props.input.value) {
      this.setState({
        value: this.props.input.value || ''
      });
    }
  }

  componentDidMount() {
    this.setState({
      value: this.props.input.value || ''
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.input.value !== this.props.input.value) {
      this.setState({
        value: nextProps.input.value || ''
      });
    }
  }

  render() {
    const { suggestions } = this.state;
    const { field, required, disabled } = this.props;
    const options = suggestions.map(option => (
      <Option key={option}>
        {option}
      </Option>
    ));

    return (
      <div>
        <Label field={field} required={required}/>
        <FormItem
          validateStatus={this.state.valid ? '' : 'warning'}
          help={this.state.valid ? '' : 'Please chose one from list'}
        >
          <AutoComplete
            onSelect={this.getSuggestionValue}
            onSearch={this.onSuggestionsFetchRequested}
            onChange={this.onChange}
            onBlur={this.onBlur}
            placeholder={field.placeholder}
            value={this.state.value}
            disabled={disabled}
            allowClear={true}
          >
            {options}
          </AutoComplete>
        </FormItem>
      </div>
    );
  }
}

AutocompleteField.propTypes = {
  field: PropTypes.object.isRequired,
  required: PropTypes.bool,
  normalize: PropTypes.func,
  customNormilize: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    appState: state.appState,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({toggleButtons}, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AutocompleteField);