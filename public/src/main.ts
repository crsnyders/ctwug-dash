/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
import '../styles/styles.css';
import '../styles/libnotify.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import * as Bluebird from 'bluebird';
import * as firebase from 'firebase';
import 'firebase/firestore';


// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    //https://github.com/aurelia/pal/issues/22
    .feature(PLATFORM.moduleName('table/index'))
    .plugin(PLATFORM.moduleName('aurelia-notification'), config => {
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

    // Uncomment the line below to enable animation.
    // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
    // if the css animator is enabled, add swap-order="after" to all router-view elements

    // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
    // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));
    var config = {
      apiKey: "AIzaSyBk2BlfOWqXfJ9_qiwi0te5Miha9jHzDpA",
      authDomain: "ctwug-dash.firebaseapp.com",
      databaseURL: "https://ctwug-dash.firebaseio.com",
      projectId: "ctwug-dash",
      storageBucket: "ctwug-dash.appspot.com",
      messagingSenderId: "731828561868"
    }
    firebase.initializeApp(config);

    let settings = {/* your settings... */ timestampsInSnapshots: true};
    firebase.firestore().settings(settings);

  await aurelia.start();
  await aurelia.setRoot(PLATFORM.moduleName('app'));
}
