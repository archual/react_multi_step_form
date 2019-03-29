import React from "react";
import { Affix, Row, Col, Layout } from "antd";
import Menu from "./sidebar/Menu";
import Buttons from "./sidebar/Buttons";
import GMap from "./drafts/GMap";
import Info from "./info/Info";
import Photos from "./photos/Photos";
import Description from "./description/Description";
import Location from "./location/Location";
import Partners from "./partners/Partners";
import Video from "./video/Video";
import Maps from "./maps/Maps";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { showLoading } from "../utils/alerts";

const { Sider, Content, Footer } = Layout;

export class App extends React.Component {
  state = {
    collapsed: false
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    const { formState, history } = this.props;
    const { handlers } = this.props;
    const {
      map,
      fields,
      values,
      photos,
      GPSFiles,
      video,
      mapsFiles,
      submitData,
      formInfoValues,
      formPhotoValues,
      formGPSFilesValues,
      formMapsValues,
      buttonsDisabled,
      loading,
      validSteps
    } = formState;

    const { pathname } = history.location;
    const currentStep = pathname.split("/").pop();

    return (
      <Layout style={{ height: "calc(100vh - 95px)" }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          collapsedWidth={77}
          width={400}
          className="menu"
        >
          <div className="menu-wrapper">
            <h2>Adventure Submission</h2>

            <Menu
              handlers={handlers}
              map={map}
              submitData={submitData}
              buttonsDisabled={buttonsDisabled}
              validSteps={validSteps}
            />
            <Buttons
              formState={formState}
              history={history}
              handlers={handlers}
            />
          </div>
        </Sider>
        <Layout
          style={{ overflow: scroll }}
          className={
            "content " +
            (currentStep === "submityouradventure" ? "map-step" : "")
          }
        >
          <Content>
            {loading.state ? <div className="throbber" /> : ""}
            <Switch>
              <Route
                exact
                path="/dist/submityouradventure"
                render={props => (
                  <GMap
                    map={map}
                    handlers={handlers}
                    buttonsDisabled={buttonsDisabled}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/add/info"
                render={props => (
                  <Info
                    map={map}
                    fields={fields}
                    handlers={handlers}
                    loading={loading}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/edit/:id/info"
                render={props => (
                  <Info
                    map={map}
                    fields={fields}
                    handlers={handlers}
                    loading={loading}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/add/photos"
                render={props => (
                  <Photos
                    photos={photos}
                    fields={fields}
                    values={values}
                    handlers={handlers}
                    submitData={submitData}
                    formInfoValues={formInfoValues}
                    formPhotoValues={formPhotoValues}
                    selectedDraft={map.selectedDraft}
                    loading={loading}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/edit/:id/photos"
                render={props => (
                  <Photos
                    photos={photos}
                    fields={fields}
                    values={values}
                    handlers={handlers}
                    submitData={submitData}
                    formInfoValues={formInfoValues}
                    formPhotoValues={formPhotoValues}
                    selectedDraft={map.selectedDraft}
                    loading={loading}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/add/description"
                render={props => (
                  <Description
                    handlers={handlers}
                    fields={fields}
                    selectedDraft={map.selectedDraft}
                    loading={loading}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/edit/:id/description"
                render={props => (
                  <Description
                    handlers={handlers}
                    fields={fields}
                    selectedDraft={map.selectedDraft}
                    loading={loading}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/add/location"
                render={props => (
                  <Location
                    fields={fields}
                    GPSFiles={GPSFiles}
                    handlers={handlers}
                    submitData={submitData}
                    formGPSFilesValues={formGPSFilesValues}
                    selectedDraft={map.selectedDraft}
                    loading={loading}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/edit/:id/location"
                render={props => (
                  <Location
                    fields={fields}
                    GPSFiles={GPSFiles}
                    handlers={handlers}
                    submitData={submitData}
                    formGPSFilesValues={formGPSFilesValues}
                    selectedDraft={map.selectedDraft}
                    loading={loading}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/add/partners"
                render={props => (
                  <Partners
                    fields={fields}
                    handlers={handlers}
                    selectedDraft={map.selectedDraft}
                    loading={loading}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/edit/:id/partners"
                render={props => (
                  <Partners
                    fields={fields}
                    handlers={handlers}
                    selectedDraft={map.selectedDraft}
                    loading={loading}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/add/video"
                render={props => (
                  <Video
                    video={video}
                    handlers={handlers}
                    selectedDraft={map.selectedDraft}
                    loading={loading}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/edit/:id/video"
                render={props => (
                  <Video
                    video={video}
                    handlers={handlers}
                    selectedDraft={map.selectedDraft}
                    loading={loading}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/add/maps"
                render={props => (
                  <Maps
                    fields={fields}
                    mapsFiles={mapsFiles}
                    handlers={handlers}
                    submitData={submitData}
                    formMapsValues={formMapsValues}
                    selectedDraft={map.selectedDraft}
                    loading={loading}
                    {...props}
                  />
                )}
              />
              <Route
                path="/submityouradventure/edit/:id/maps"
                render={props => (
                  <Maps
                    fields={fields}
                    mapsFiles={mapsFiles}
                    handlers={handlers}
                    submitData={submitData}
                    formMapsValues={formMapsValues}
                    selectedDraft={map.selectedDraft}
                    loading={loading}
                    {...props}
                  />
                )}
              />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

App.propTypes = {
  formState: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default App;
