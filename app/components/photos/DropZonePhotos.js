import React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import { connect } from 'react-redux';
import { toggleButtons } from '../../actions/AppActions';

class Dropzone extends React.Component {
  constructor(props) {
    super(props);
  }

  componentConfig = {
    addRemoveLinks: false,
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: false,
    postUrl: '/api/files'
  };

  djsConfig = {
    addRemoveLinks: true,
    acceptedFiles: "image/jpeg,image/png,image/gif",
    paramName: `files[${this.props.fieldName}]`,
    params: {
      field: this.props.fieldName
    },
    createImageThumbnails: true,
    maxFilesize: 10,
    maxThumbnailFilesize: 10,
    dictDefaultMessage: `<p class="upload-text">
      <span>Click or drag file to this area to upload.</span>
      <span class="types">(JPG under 10MB. Support for a single or bulk upload.)</span>
    </p>`,
    dictFileTooBig: 'Max filesize: 10MiB. Current - {{filesize}}MiB',
    thumbnailWidth: 300,
    thumbnailHeight: 200
  };

  eventHandlers = {
    addedfile: (file) => {
      this.props.addPhoto({
        fileName: file.name
      });
      this.props.dispatch(toggleButtons(true));
    },
    success: (file, response) => {
      this.props.updatePhoto({
        fid: response.fid,
        src: response.path,
        fileName: file.name,
        thumbnail: response.thumbnail,
      });
      this.props.dispatch(toggleButtons(false));
      // Remove successfully uploaded photos.
      setTimeout(() => {
        jQuery(file.previewElement).hide(500);
      }, 1000);
    },
    error: (file, error) => {
      this.props.removeWrong({
        fileName: file.name
      });
      this.props.dispatch(toggleButtons(false));
    },
    thumbnail: (file, thumbs) => {
      this.props.updatePhoto({
        src: thumbs,
        fileName: file.name
      });
    }
  };

  render() {
    return (
      <DropzoneComponent config={this.componentConfig}
                eventHandlers={this.eventHandlers}
                djsConfig={this.djsConfig}>
      </DropzoneComponent>
    )
  }
}


function mapStateToProps (state) {
  return {
    appState: state.appState,
  }
}

export default connect(mapStateToProps)(Dropzone);
