import React from 'react';
import VideoForm from './VideoForm';
import { loadAdventure } from '../../utils/loadAdventure';

class Video extends React.Component {
  componentWillMount() {
    const nid = this.props.match.params.id;
    const { selectedDraft } = this.props;

    // If page loaded for edit, get initial date for draft.
    if (!selectedDraft) {
      loadAdventure(nid, this.props.handlers, this.props.history, 'video');
    }
  }

  render() {
    const { saveFormValues } = this.props.handlers;
    const { video, loading } = this.props;

    if (!video) return null;

    return (
      <VideoForm
        videoFields={video}
        saveFormValues={saveFormValues}
        name='group_video'
        loading={loading}
      />
    );
  }
}

export default Video;