import React from 'react';
import CKEditor from 'react-ckeditor-wrapper';
import { maxFileSize } from '../../constants/configuration';
import { showAlert } from '../../utils/alerts';
import PropTypes from 'prop-types';

class CKEditorWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: 'content'
    };
  }

  componentDidMount() {
    this.setState(
      {
        content: this.props.input.value
      }
    );
  }

  componentWillUpdate(nextProps) {
    if (nextProps.input.value !== this.props.input.value) {
      this.setState(
        {
          content: nextProps.input.value
        }
      );
    }
  }

  updateContent = (value) => {
    this.setState(
      {
        content: value
      }
    );
    this.props.input.onChange(value);
  };

  fileRequest = (evt) => {
    let fileLoader = evt.data.fileLoader,
        formData = new FormData();

    formData.append('files[ckeditor]', fileLoader.file, fileLoader.fileName);
    formData.append('field', 'ckeditor');
    fileLoader.xhr.send(formData);

    // Prevented the default behavior.
    evt.stop();
  };

  fileDrop = (evt) => {
    const dataTransfer = evt.data && evt.data.dataTransfer;
    const numberFiles = dataTransfer.getFilesCount();

    for (let i = 0; i < numberFiles; i++) {
      let file = dataTransfer.getFile(i);

      if (file.size > maxFileSize) {
        showAlert(`Error: ${file.name} - too big. Max upload size is 10MB`, 'error');
        evt.stop();
        return;
      }
    }
  };

  render() {
    const { loading } = this.props;

    return (
      <CKEditor
        value={this.state.content}
        onChange={this.updateContent}
        config={
          {
            contentsCss: ["body {font-size: 16px; font-family: 'Open Sans', sans-serif;}"],
            uploadUrl: '/api/files',
            pasteFilter: 'p ul li ol br; img[!src,alt,width,height]; a[!href]',
            on: {
              fileUploadRequest: this.fileRequest,
              paste: this.fileDrop
            }
          }
        }
      />)
  }
}

CKEditorWrapper.propTypes = {
  input: PropTypes.object.isRequired,
};

export default CKEditorWrapper;