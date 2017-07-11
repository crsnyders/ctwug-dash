import {Aurelia} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import {PLATFORM} from 'aurelia-pal';

export class App {
    router: Router;
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'CTWUG-DASH';
    config.map([
      { route: ['', 'transmission'],  name: 'transmission-remote',      moduleId: PLATFORM.moduleName('./transmission-remote'),      nav: true, title: 'Transmission' },
      { route: 'dc',                  name: 'dc',                       moduleId: PLATFORM.moduleName('./eiskaltdcpp'),      nav: true, title: 'DC++' },
      { route: 'torrent',             name: 'torrent',                  moduleId: PLATFORM.moduleName('./torrent-page'),      nav: true, title: 'Torrents' }
    ]);

    this.router = router;
  }
}
