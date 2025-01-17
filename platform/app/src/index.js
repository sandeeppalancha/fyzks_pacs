/**
 * Entry point for development and production PWA builds.
 */
import 'regenerator-runtime/runtime';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import { history } from './utils/history';

/**
 * EXTENSIONS AND MODES
 * =================
 * pluginImports.js is dynamically generated from extension and mode
 * configuration at build time.
 *
 * pluginImports.js imports all of the modes and extensions and adds them
 * to the window for processing.
 */
import { modes as defaultModes, extensions as defaultExtensions } from './pluginImports';
import loadDynamicConfig from './loadDynamicConfig';
import CustomApp from './customApp';

loadDynamicConfig(window.config).then(config_json => {
  // Reset Dynamic config if defined
  if (config_json !== null) {
    window.config = config_json;
  }

  /**
   * Combine our appConfiguration with installed extensions and modes.
   * In the future appConfiguration may contain modes added at runtime.
   *  */
  const appProps = {
    config: window ? window.config : {},
    defaultExtensions,
    defaultModes,
  };

  /** Create App */
  // const app = React.createElement(App, appProps, null);
  // const pacs_app_element = document.getElementById('pacs-app');
  // if(pacs_app_element) {
  //   ReactDOM.render(app, pacs_app_element);
  // }

  const customApp = React.createElement(CustomApp, appProps, null);

  window.volumeLoadInfo = {};
  window.seriesLoadInfo = {};

  // const root = document.getElementById('root');
  /** Render */
  ReactDOM.render(customApp, document.getElementById('custom-root'));
});

export { history };
