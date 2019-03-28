import React from "react";
import AlertContainer from "react-alert";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as AppActions from "../actions/AppActions";
// import LogRocket from 'logrocket';

import Layout from "./Layout";

@connect(state => ({
  appState: state.appState
}))
export class AppContainer extends React.Component {
  constructor() {
    super(...arguments);

    // Alert message options.
    this.alertOptions = {
      offset: 100,
      position: "top left",
      theme: "light",
      time: 3000,
      transition: "scale"
    };
  }

  onUnload = event => {
    if (window.Drupal.settings.adventure) {
      if (
        !window.Drupal.settings.adventure.submit &&
        !window.Drupal.settings.adventure.download
      ) {
        event.returnValue = Drupal.t(
          "Looks like you're closing this window without saving. You will lose all unsaved work."
        );
        return Drupal.t(
          "Looks like you're closing this window without saving. You will lose all unsaved work."
        );
      }

      // Reset submit flag.
      window.Drupal.settings.adventure.submit = false;
      window.Drupal.settings.adventure.download = false;
    }
  };

  componentDidMount() {
    window.addEventListener("beforeunload", this.onUnload);
    // Identify user for LogRocket.
    // let user = {};
    // if (window.Drupal.settings.adventure) {
    //   user.name = window.Drupal.settings.adventure.user || '';
    //   user.admin = window.Drupal.settings.adventure.admin || '';
    // }

    // LogRocket.identify(window.Drupal.settings.uid, user);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onUnload);
  }

  render() {
    const { appState, dispatch, history } = this.props;
    const actions = bindActionCreators(AppActions, dispatch);

    return (
      <div>
        <div className="alerts-container">
          <AlertContainer ref={a => (global.msg = a)} {...this.alertOptions} />
        </div>
        <Layout formState={appState} handlers={actions} history={history} />
      </div>
    );
  }
}

export default withRouter(AppContainer);
