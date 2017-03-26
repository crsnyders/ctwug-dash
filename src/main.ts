import {Aurelia} from 'aurelia-framework';

import '../styles/styles.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';


import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('table')
    .plugin('aurelia-notification', config => {
      config.configure({
        translate: false,  // 'true' needs aurelia-i18n to be configured
        notifications: {
         'success': 'humane-libnotify-success',
         'error': 'humane-libnotify-error',
         'info': 'humane-libnotify-info'
          }
        });
    })
    .developmentLogging();

  //Uncomment the line below to enable animation.
  //aurelia.use.plugin('aurelia-animator-css');
  //if the css animator is enabled, add swap-order="after" to all router-view elements

  //Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  //aurelia.use.plugin('aurelia-html-import-template-loader')

  await aurelia.start();
  aurelia.setRoot('app');
}
