"use strict";

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import jQuery from "jquery";

jQuery(document).ready(function() {
  ReactDOM.render(<App />, document.getElementById("root"));
});
