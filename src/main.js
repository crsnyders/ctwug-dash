import 'bootstrap';


export function configure(aurelia) {
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

  aurelia.start().then(() => aurelia.setRoot());
}
