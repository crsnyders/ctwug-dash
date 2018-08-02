import {Aurelia} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import {PLATFORM} from 'aurelia-pal';
import {AuthorizeStep} from './autherize-step';

export class App {
    router: Router;
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'CTWUG-DASH';
    //config.options.pushState = false;
    config.options.root = '/dash';
    config.map([
      { route: 'login', name: 'login',      moduleId: PLATFORM.moduleName('views/admin/login') , settings : {auth: false}},
      { route: 'register', name: 'register',      moduleId: PLATFORM.moduleName('views/admin/register'), settings : {auth: false}},
      { route: 'profile', name: 'profile',      moduleId: PLATFORM.moduleName('views/admin/profile'), settings : {auth: true}},
      { route: ['', 'transmission'],  name: 'transmission-remote',      moduleId: PLATFORM.moduleName('./transmission-remote'),      nav: true, title: 'Transmission' },
      { route: 'torrent',             name: 'torrent',                  moduleId: PLATFORM.moduleName('./torrent-page'),      nav: true, title: 'Torrents' }
    ]);

    config.fallbackRoute("login");
    config.addPipelineStep('authorize', AuthorizeStep);
    this.router = router;
  }
}
