import React from 'react';
import { Popconfirm } from 'antd';

class MapsFilesList extends React.Component {
  render() {
    const { field, buttonVisible, handleRemoveFile } = this.props;
    if (!field) return null;

    return (
      <div>
        <div className="file">
          <div className="file-preview">
            <h4>File name:</h4>
            <p><a href={field.src || field.value} target="_blank">{field.fileName}</a></p>
            <span className="download"><a href={field.src || field.value} target="_blank">Download</a></span>
          </div>
        </div>
        <Popconfirm
          title="Are you sure you want to delete this file?"
          onConfirm={handleRemoveFile}
          okText="Yes"
          cancelText="No">
          <span className={`button btn-remove ${buttonVisible ? '' : 'hide'}`}>Remove</span>
        </Popconfirm>
      </div>
    )
  }
}

export default MapsFilesList;