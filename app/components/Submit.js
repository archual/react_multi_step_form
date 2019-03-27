import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { saveData, setDraftData } from '../actions/AppActions';
import prepareValues from '../utils/prepareValues';

function submit(values, dispatch, props) {
  console.log(values);
  // Save current data to store.
  if (values) {
    let updatedValues = {};
    // Prepare values to flat structure for photos, GPSfiles, videos forms.
    switch (props.form) {
      case 'photos':
        for (let section in values) {
          updatedValues = {
            ...updatedValues,
            ...prepareValues(values[section])
          };
        }
        break;
      case 'location-files':
      case 'video':
      case 'maps':
        updatedValues = prepareValues(values);
        break;
      default:
        updatedValues = values;
    }
    dispatch(saveData(updatedValues));
  }
  // Skip extra saving on steps with two forms.
  if (props.form === 'subphotos' || props.form === 'location') return;
  dispatch(setDraftData());
}

export default submit;