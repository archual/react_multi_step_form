import React from 'react';
import { Row, Col } from 'antd';
import MapsUploadSection from './MapsUploadSection';
import { FormSection } from 'redux-form';
import { Popconfirm } from 'antd';
import { getFormMarkup } from '../../utils/formBuilder/universalFormBuilder';

class MapsFileSection extends React.Component {
  render() {
    const { files, index, change, handlers, handleRemoveSection, formMapsValues, formState, loading } = this.props;
    let uploadFields = [];
    uploadFields[0] = files.fields ? files.fields.filter(e => e.name === 'field_pdf') : [];
    uploadFields[1] = files.fields ? files.fields.filter(e => e.name === 'field_map_image') : [];

    const sectionFields = files.fields ?
      files.fields.filter(e => (e.name !== 'field_pdf' && e.name !== 'field_map_image')) : [];

    return (
      <div className="maps-file-section">
        <label>{`Map-${index + 1}`}</label>
        <FormSection name={files.name}>
          <Row className={`upload-section`}>
            {uploadFields.map(field => (
              <Col span={12} className="file-upload" key={`${field[0].name}-${index}`}>
                <MapsUploadSection
                  field={field[0]}
                  change={change}
                  name={files.name}
                  handlers={handlers}
                  formMapsValues={formMapsValues}
                />
              </Col>
              ))}
          </Row>
          {sectionFields.length ? getFormMarkup(!loading ? false : loading.state, sectionFields, files.name, {}, [], files.name) : ''}
        </FormSection>
        <Popconfirm
          placement="topLeft"
          title="Are you sure you want to delete this Field?"
          onConfirm={handleRemoveSection.bind(this, index)}
          okText="Yes"
          cancelText="No">
          <span className="button remove-field">Remove</span>
        </Popconfirm>
      </div>
    );
  }
}

export default MapsFileSection;