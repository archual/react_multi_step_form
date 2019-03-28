import React from 'react';
import DropzoneComponent from 'react-dropzone-component';

class DropzoneFiles extends React.Component {
  constructor(props) {
    super(props);
  }

  componentConfig = {
    addRemoveLinks: false,
    postUrl: '/api/files'
  };

  djsConfig = {
    addRemoveLinks: true,
    acceptedFiles: ".gps, .gpx, .kml, .kmz, .pdf, .jpeg, .jpg, .png",
    paramName: `files[${this.props.fieldName}]`,
    params: {
      field: this.props.fieldName
    },
    previewsContainer: false,
    createImageThumbnails: true,
    thumbnailWidth: 300,
    thumbnailHeight: 250
  };

  dropzone = null;

  eventHandlers = {
    init: dropzone => {
      this.dropzone = dropzone;
    },
    addedfile: (file) => {
      this.props.addFile({
        fileName: file.name
      });
    },
    success: (file, response) => {
      this.props.updateFile({
        fid: response.fid,
        src: response.path,
        fileName: file.name,
      });
    },
    error: (file, error) => {
      console.log(error);
      this.props.removeWrong({
        fileName: file.name
      });
    },
    thumbnail: (file, thumbs) => {
      this.props.updateFile({
        src: thumbs,
        fileName: file.name
      });
    },
    removedfile: (file) => {
      console.log('removing...', file);
    }
  };

  componentWillUpdate(nextProps) {
    if (!nextProps.field && this.dropzone.files.length && this.djsConfig.maxFiles === 1) {
      this.dropzone.removeFile(this.dropzone.files[0]);
    }
  }

  render() {
    const { maxFiles, fieldExtensions } = this.props;
    const extensions =  `.${fieldExtensions}`.split(' ').join(', .');
    const readableExtensions = fieldExtensions.toUpperCase();
    this.djsConfig.acceptedFiles = extensions;
    this.djsConfig.dictDefaultMessage = `<p class="upload-text">
      <span>Click or drag file to this area to upload.</span>
      <span class="types">${readableExtensions} under 10MB. <br/> (Support for a single or bulk upload.)</span>
    </p>`;
    if (maxFiles) {
      this.djsConfig.maxFiles = maxFiles;
    }
    return (
      <DropzoneComponent config={this.componentConfig}
                eventHandlers={this.eventHandlers}
                djsConfig={this.djsConfig}>
      </DropzoneComponent>
    )
  }
}

export default DropzoneFiles;