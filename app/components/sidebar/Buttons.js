import React from 'react';
import {Route, Redirect} from 'react-router';
import {nextStep} from '../../constants/configuration';
import {connect} from 'react-redux';
import {submit} from 'redux-form';
import {withRouter} from 'react-router-dom';
import {setStatus} from '../../actions/AppActions';
import {validateForm} from '../../utils/formBuilder/validateForm';
import {uniqId} from '../../utils/unique_id';
import {Button} from 'antd';
import getObjectValue from '../../utils/getObjectValue';


class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleNextButton = (e) => {
    e.preventDefault();

    const { pathname } = this.props.history.location;
    const currentStep = pathname.split('/').pop();

    const { submitData, buttonsDisabled } = this.props.formState;

    const title = submitData['title'] || '';
    const date = submitData['field_date'] || '';

    const path = pathname.split(currentStep)[0] + nextStep[currentStep];

    // Find selected draft ID.
    const { selectedDraft } = this.props.formState.map;
    if (!selectedDraft || !selectedDraft.editable || buttonsDisabled || (currentStep !== 'submityouradventure' && (!title || !date))) return;

    switch (currentStep) {
      case 'submityouradventure':
        if (selectedDraft.nid !== 'new') {
          this.props.history.push(`/submityouradventure/edit/${selectedDraft.nid}/${nextStep[currentStep]}`);
        }
        else {
          this.props.history.push(`/submityouradventure/add/${nextStep[currentStep]}`);
        }
        break;
      case 'info':
        this.props.history.push(path);
        break;
      case 'photos':
        this.props.history.push(path);
        break;
      case 'description':
        this.props.history.push(path);
        break;
      case 'location':
        this.props.history.push(path);
        break;
      case 'partners':
        this.props.history.push(path);
        break;
      case 'video':
        this.props.history.push(path);
        break;
      case 'maps':
        break;
    }
  };

  disableNextButton = () => {
    const { pathname } = this.props.history.location;
    const currentStep = pathname.split('/').pop();

    const {submitData, buttonsDisabled} = this.props.formState;

    const title = submitData['title'] || '';
    const date = submitData['field_date'] || '';

    const path = pathname.split(currentStep)[0] + nextStep[currentStep];

    // Find selected draft ID.
    const { selectedDraft } = this.props.formState.map;

    if (!selectedDraft || !selectedDraft.editable || buttonsDisabled || (currentStep !== 'submityouradventure' && (!title || !date))) {
      return true;
    }
  };

  handleSaveButton = (type, e) => {
    e.preventDefault();

    let saveType = type;
    const { pathname } = this.props.history.location;

    const { buttonsDisabled, submitData } = this.props.formState;
    const title = submitData['title'] || '';

    if (buttonsDisabled || !title) return;

    // Validate data in submitData, and show errors
    if (saveType === 'submit') {
      let validated = validateForm(this.props.appState, submitData, this.props.form, this.props.handlers, this.props.history, pathname);
      saveType = validated ? saveType : 'save';
    }

    // If preview - open popup immediately (else it will blocked by Chrome) and
    // save it to Window object.
    if (saveType === 'preview') {
      const redirectNid = window.Drupal.settings.adventure && window.Drupal.settings.adventure.redirect_nid || '/';
      const redirect = redirectNid === '/' ? redirectNid : `/node/${redirectNid}`;
      window.reactPreviewPopup = window.open(redirect);
    }

    this.props.dispatch(setStatus(saveType));

    const currentStep = pathname.split('/').pop();
    switch (currentStep) {
      case 'info':
        this.props.dispatch(submit('info'));
        break;
      case 'photos':
        this.props.dispatch(submit('photos'));
        this.props.dispatch(submit('subphotos'));
        break;
      case 'description':
        this.props.dispatch(submit('description'));
        break;
      case 'location':
        this.props.dispatch(submit('location'));
        this.props.dispatch(submit('location-files'));
        break;
      case 'partners':
        this.props.dispatch(submit('partners'));
        break;
      case 'video':
        this.props.dispatch(submit('video'));
        break;
      case 'maps':
        this.props.dispatch(submit('maps'));
        break;
    }
  };

  render() {
    const { map, submitData, buttonsDisabled } = this.props.formState;
    const title = submitData['title'] || '';
    const { pathname } = this.props.history.location;
    const step = pathname.split('/').pop();
    const isDisabled = buttonsDisabled || (step !== 'submityouradventure' && !title);
    const DrupalSettings = getObjectValue(['Drupal', 'settings', 'adventure'], window);
    const isAdmin = DrupalSettings ? DrupalSettings.admin : false;

    const nextButton = <Button
      className="button btn-next"
      disabled={this.disableNextButton()}
      onClick={this.handleNextButton}
      key={uniqId('button')}
      title={step === 'info' ? 'Fields "title" and "Date information was collected" should be filled in' : ''}>Next Step</Button>;

    const saveButton = <Button
      className="button btn-save"
      onClick={this.handleSaveButton.bind(this, 'save')}
      disabled={isDisabled}
      key={uniqId('button')}>Save</Button>;

    const submitButton = <Button
      className="button btn-submit"
      onClick={this.handleSaveButton.bind(this, 'submit')}
      disabled={isDisabled}
      key={uniqId('button')}>Submit</Button>;

    const saveAndCreate = <Button
      className="button btn-save-create"
      onClick={this.handleSaveButton.bind(this, 'save_create')}
      disabled={isDisabled}
      key={uniqId('button')}>Save + Create another</Button>;

    const saveStubAndCreate = <Button
      className="button btn-save-create"
      onClick={this.handleSaveButton.bind(this, 'stub_create')}
      disabled={isDisabled}
      key={uniqId('button')}>Save stub + Create another</Button>;

    const sendBack = <Button
      className="button admin-button"
      onClick={this.handleSaveButton.bind(this, 'back')}
      disabled={isDisabled}
      key={uniqId('button')}>Send draft back to contributor</Button>;

    const saveAsUnedited = <Button
      className="button admin-button"
      onClick={this.handleSaveButton.bind(this, 'needs_review')}
      disabled={isDisabled}
      key={uniqId('button')}>Save as unedited</Button>;

    const saveAsEdited = <Button
      className="button admin-button"
      onClick={this.handleSaveButton.bind(this, 'edited_once')}
      disabled={isDisabled}
      title="Save as edited once"
      key={uniqId('button')}>Save as edited once</Button>;

    const saveAsPublished = <Button
      className="button admin-button"
      onClick={this.handleSaveButton.bind(this, 'published')}
      disabled={isDisabled}
      title="Save as published"
      key={uniqId('button')}>Save as published</Button>;

    const previewButton = <Button
      className="button btn-preview"
      onClick={this.handleSaveButton.bind(this, 'preview')}
      disabled={isDisabled}
      title="Preview"
      key={uniqId('button')}>Preview</Button>;

    let buttons = nextButton;

    switch (step) {
      case 'info':
        if (isAdmin) {
          buttons = [previewButton, saveStubAndCreate, saveAndCreate, saveButton, nextButton];
        }
        else {
          buttons = [previewButton, saveAndCreate, saveButton, nextButton];
        }
        break;
      case 'photos':
      case 'description':
        buttons = [previewButton, saveButton, nextButton];
        break;
      case 'location':
        if (isAdmin) {
          buttons = [previewButton, saveButton, submitButton, nextButton];
        }
        else {
          buttons = [previewButton, saveButton, submitButton];
        }
        break;
      case 'partners':
      case 'video':
      case 'maps':
        buttons = [sendBack, saveAsUnedited, saveAsEdited, saveAsPublished];
        break;
      default:
        buttons = nextButton;
    }

    return (
      <div className={`buttons-group `}>
        {buttons}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    appState: state.appState,
    form: state.form
  }
}

export default withRouter(connect(mapStateToProps)(Buttons));