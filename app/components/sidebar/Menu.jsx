import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import Submenu from './Submenu';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import images from '../../constants/images';
import getObjectValue from '../../utils/getObjectValue';

class Menu extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.map.filter !== this.props.map.filter ||
      nextProps.map.selectedDraft !== this.props.map.selectedDraft ||
      nextProps.map.newDraft !== this.props.map.newDraft ||
      nextProps.map.center.lat !== this.props.map.center.lat ||
      nextProps.map.center.lng !== this.props.map.center.lng ||
      nextProps.map.selectedDraft.editable !== this.props.map.selectedDraft.editable ||
      nextProps.buttonsDisabled !== this.props.buttonsDisabled ||
      nextProps.location.pathname !== this.props.location.pathname ||
      (this.props.submitData &&
        (nextProps.submitData['title'] !== this.props.submitData['title']) ||
        (nextProps.submitData['field_date'] !== this.props.submitData['field_date'])) ||
      nextProps.map.selectedDraft.nid !== this.props.map.selectedDraft.nid);
  }

  render() {
    const { map, submitData, buttonsDisabled, validSteps } = this.props;
    const { addDraft, setFilter, removeNewDraft } = this.props.handlers;
    const title = submitData['title'] || '';
    const date = submitData['field_date'] || '';
    const path = map.selectedDraft ? (map.selectedDraft.nid === 'new' ? 'add' : `edit/${map.selectedDraft.nid}`) : '';
    const editable = map.selectedDraft ? map.selectedDraft.editable && path && title && date && !buttonsDisabled : false;
    const DrupalSettings = getObjectValue(['Drupal', 'settings', 'adventure'], window);
    const isAdmin = DrupalSettings ? DrupalSettings.admin : false;

    return (
      <ul>
        <li>
          {path && map.selectedDraft.editable && !buttonsDisabled ? <NavLink exact activeClassName="active" to='/submityouradventure'>
            <img className="icon" src={images.menuicons.iconSelectDraft}/><span className="numbers">1</span><span>Select or Start Draft</span>
            </NavLink> : <div className="menu-item"><img className="icon" src={images.menuicons.iconSelectDraft}/><span className="numbers">1</span><span>Select or Start Draft</span></div>}
          <Route  exact path="/submityouradventure/" render={(props) => <Submenu
            addDraft={addDraft}
            setFilter={setFilter}
            removeNewDraft={removeNewDraft}
            map={map}
            {...props}
            />}
          />
        </li>
        <li>
          {path && map.selectedDraft.editable && !buttonsDisabled ? <NavLink
            activeClassName="active"
            to={`/submityouradventure/${path}/info`}>
            <img className={`icon ${validSteps.info ? '' : 'invalid'}`} src={images.menuicons.iconInfo}/><span className="numbers">2</span><span>General Info</span></NavLink> : <div className="menu-item"><img className="icon" src={images.menuicons.iconInfo}/><span className="numbers">2</span><span>General Info</span></div>}
        </li>
        <li>
          {editable ? <NavLink
            activeClassName="active"
            to={`/submityouradventure/${path}/photos`}>
            <img className={`icon ${validSteps.photos ? '' : 'invalid'}`} src={images.menuicons.iconPhotos}/><span className="numbers">3</span><span>Photos</span></NavLink> : <div className="menu-item"><img className="icon" src={images.menuicons.iconPhotos}/><span className="numbers">3</span><span>Photos</span></div>}
        </li>
        <li>
          {editable ? <NavLink
            activeClassName="active"
            to={`/submityouradventure/${path}/description`}>
            <img className={`icon ${validSteps.description ? '' : 'invalid'}`} src={images.menuicons.iconDescription}/><span className="numbers">4</span><span>Description</span></NavLink> : <div className="menu-item"><img className="icon" src={images.menuicons.iconDescription}/><span className="numbers">4</span><span>Description</span></div>}
        </li>
        <li>
          {editable ? <NavLink
            activeClassName="active"
            to={`/submityouradventure/${path}/location`}>
            <img className={`icon ${validSteps.location ? '' : 'invalid'}`} src={images.menuicons.iconLocation}/><span className="numbers">5</span><span>Location + Driving Directions</span></NavLink> : <div className="menu-item"><img className="icon" src={images.menuicons.iconLocation}/><span className="numbers">5</span><span>Location + Driving Directions</span></div>}
        </li>
        {isAdmin && [
          <li key={6}>
            {editable ? <NavLink
              activeClassName="active"
              to={`/submityouradventure/${path}/partners`}>
              <img className="icon" src={images.menuicons.iconPartners}/><span className="numbers">6</span><span>Partners</span></NavLink> : <div className="menu-item"><img className="icon" src={images.menuicons.iconPartners}/><span className="numbers">6</span><span>Partners</span></div>}
          </li>,
          <li key={7}>
            {editable ? <NavLink
              activeClassName="active"
              to={`/submityouradventure/${path}/video`}>
              <img className="icon" src={images.menuicons.iconVideo}/><span className="numbers">7</span><span>Video</span></NavLink> : <div className="menu-item"><img className="icon" src={images.menuicons.iconVideo}/><span className="numbers">7</span><span>Video</span></div>}
          </li>,
          <li key={8}>
            {editable ? <NavLink
              activeClassName="active"
              to={`/submityouradventure/${path}/maps`}>
              <img className="icon" src={images.menuicons.iconMaps}/><span className="numbers">8</span><span>Maps</span></NavLink> : <div className="menu-item"><img className="icon" src={images.menuicons.iconMaps}/><span className="numbers">8</span><span>Maps</span></div>}
          </li>
        ]}
      </ul>
    );
  }
}

Menu.propTypes = {
  map: PropTypes.object.isRequired,
  submitData: PropTypes.object,
  validSteps: PropTypes.object,
  buttonsDisabled: PropTypes.bool,
};

export default withRouter(Menu);