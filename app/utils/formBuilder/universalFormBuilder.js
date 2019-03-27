import React from 'react';
import { Field } from 'redux-form';

import AutocompleteField from './formComponents/AutocompleteField';
import SizedInput from './formComponents/SizedInput';
import DatePicker from './formComponents/DatePicker';
import DateRangePicker from './formComponents/DateRangePicker';
import RadioButtons from './formComponents/RadioButtons';
import RadioSwitcher from './formComponents/RadioSwitcher';
import Input from './formComponents/Input';
import InputNumber from './formComponents/InputNumber';
import TextArea from './formComponents/TextArea';
import CheckBox from './formComponents/CheckBox';
import CheckBoxes from './formComponents/CheckBoxes';
import Select from './formComponents/Select';
import MultiValueField from './formComponents/MultiValueField';
import CheckboxesTree from './formComponents/CheckboxesTree';
import HierarchicalSelect from './formComponents/HierarchicalSelect';
import Label from './formComponents/Label';
import { Form, Tooltip } from 'antd';

import { normalizePhone } from './normalizePhone';
import { checkRequired, filterVisibleOptions } from './prepareFields';

const FormItem = Form.Item;

// Create from markup.
export const getFormMarkup = (loadingState, fields = [], groupClass, form = {}, normalizers = [], treeName = '', formName) => {
  let sortedFields = fields.sort((a, b) => a.weight - b.weight);

  let formMarkup = [];
  sortedFields.forEach((field, index) => {
    let markup = '';

    // Prepare data for field.
    const placeholder = field.placeholder || '';
    const fieldGroupClass = groupClass + (field.name ? '-' + field.name : '');
    const fieldClass = field.class ? field.class.join(' ') : '';
    const fieldName = treeName ? `${treeName}-${field.name}` : field.name || '';

    let fieldNormalizer = () => {};

    // Add field normalizer.
    normalizers.forEach(normalizer => {
      if (normalizer.name === field.name) {
        fieldNormalizer = normalizer.callback;
      }
    });

    let options = '';

    const required = checkRequired(field, form);

    switch (field.type) {
      case 'checkbox':
        markup = <Field
          name={fieldName}
          component={CheckBox}
          field={field}
          required={required}
          disabled={loadingState}
          normalize={fieldNormalizer(fieldName)}
        />;
        break;
      case 'date':
        markup = <Field
          name={fieldName}
          component={DatePicker}
          field={field}
          required={required}
          disabled={loadingState}
          normalize={fieldNormalizer(fieldName)}
        />;
        break;
      case 'daterange':
        markup = <Field
          name={fieldName}
          component={DateRangePicker}
          field={field}
          required={required}
          disabled={loadingState}
          normalize={fieldNormalizer(fieldName)}
        />;
        break;
      case 'image':
      case 'file':
        const output = getFormMarkup(loadingState, field.fields, fieldName, form, normalizers, field.tree && fieldName);

        markup = output.length ? <div>
          <label className="title">{placeholder}{required ? <span className="required">*</span> : ''}</label>
          <div className={'group ' + fieldName}>
            {output}
          </div>
        </div> : '';
        break;
      case 'phone':
        markup = <Field
          name={fieldName}
          component={Input}
          field={field}
          required={required}
          disabled={loadingState}
          normalize={normalizePhone}
        />;
        break;

      case 'text':
        if (field.autocomplete) {
          markup = <Field
            name={fieldName}
            field={field}
            component={AutocompleteField}
            required={required}
            normalize={fieldNormalizer(fieldName)}
            disabled={loadingState}
            customNormilize={fieldNormalizer}
          />;
        }
        else if (field.cardinality === -1) {
          markup = <MultiValueField
            name={fieldName}
            field={field}
            formName={formName}
            required={required}
            disabled={loadingState}
            normalize={fieldNormalizer(fieldName)}
          />
        }
        else if (field.max_length) {
          markup = <Field
              name={fieldName}
              field={field}
              component={SizedInput}
              required={required}
              disabled={loadingState}
              normalize={fieldNormalizer(fieldName)}
            />
        }
        else {
          markup = <Field
            name={fieldName}
            component={Input}
            field={field}
            required={required}
            disabled={loadingState}
            normalize={fieldNormalizer(fieldName)}
          />;
        }
        break;

      case 'hidden':
        markup = <Field
          name={fieldName}
          component="input"
          field={field}
          type="hidden"
          required={required}
          disabled={loadingState}
          normalize={fieldNormalizer(fieldName)}
        />;
        break;

      case 'radiobuttons':
        options = field.options ? filterVisibleOptions(field.options, form) : '';

        markup = <Field
          name={fieldName}
          field={field}
          options={options}
          component={RadioButtons}
          required={required}
          disabled={loadingState}
          normalize={fieldNormalizer(fieldName)}
        />;
        break;

      case 'radioswitchers':
        options = field.options ? filterVisibleOptions(field.options, form) : '';

        markup = <Field
          name={fieldName}
          field={field}
          options={options}
          component={RadioSwitcher}
          required={required}
          disabled={loadingState}
          normalize={fieldNormalizer(fieldName)}
        />;
        break;

      case 'checkboxes':
        options = field.options ? filterVisibleOptions(field.options, form) : [];

        markup = <CheckBoxes
          name={fieldName}
          field={field}
          options={options}
          required={required}
          disabled={loadingState}
          normalize={fieldNormalizer(fieldName)}
        />;
        break;

      // Term-reference-tree.
      case 'checkboxes-tree':
        options = field.options ? filterVisibleOptions(field.options, form) : [];

        markup = <CheckboxesTree
          name={fieldName}
          field={field}
          options={options}
          required={required}
          disabled={loadingState}
          normalize={fieldNormalizer(fieldName)}
        />;
        break;

      case 'textarea':
        markup = <Field
          name={fieldName}
          component={TextArea}
          field={field}
          required={required}
          disabled={loadingState}
          normalize={fieldNormalizer(fieldName)}
        />;
        break;

      case 'select':
        options = field.options ? filterVisibleOptions(field.options, form) : '';

        markup = <Field
          name={fieldName}
          component={Select}
          options={options}
          field={field}
          required={required}
          disabled={loadingState}
          normalize={fieldNormalizer(fieldName)}
        />;
        break;

      case 'hierarchical':
        markup = <Field
          name={fieldName}
          component={HierarchicalSelect}
          field={field}
          required={required}
          disabled={loadingState}
          normalize={fieldNormalizer(fieldName)}
        />;
        break;

      case 'number':
        markup = <Field
          name={fieldName}
          component={InputNumber}
          field={field}
          required={required}
          disabled={loadingState}
          normalize={fieldNormalizer(fieldName)}
        />;
        break;

      case 'wrapper':
        if (field.cardinality === -1) {
          markup = <MultiValueField
            name={fieldName}
            field={field}
            formName={formName}
            required={required}
            placeholder={placeholder}
            disabled={loadingState}
            normalize={fieldNormalizer(fieldName)}
          />
        }
        else {
          const output = getFormMarkup(loadingState, field.fields, fieldGroupClass, form, normalizers, field.tree && fieldName);
          markup = (
            <div>
              {(field.show_label || fieldClass === 'link-field') ?
                <Label labelClass="fieldset-title" field={field} required={required}/>
                 : ''}
              <div className={fieldGroupClass}>
                {output}
              </div>
            </div>
          );
        }
        break;

      default:
        markup = <Field
          name={fieldName}
          component="input"
          field={field}
          type="hidden"
          required={required}
          disabled={loadingState}
          normalize={fieldNormalizer(fieldName)}
        />;
    }

    let classes = `field field-${fieldGroupClass} ${fieldClass}` + (field.description ? ' with-description' : '');

    formMarkup.push(
      <div key={`${fieldName}-${index}`} className={classes}>
        <FormItem
          validateStatus={field.error ? 'warning' : ''}
          help={field.error ? field.error : ''}
        >
          {markup}
        </FormItem>
      </div>
    );
  });

  return formMarkup;
};