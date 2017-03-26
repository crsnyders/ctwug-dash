import {Aurelia} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
    router: Router;
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'CTWUG-DASH';
    config.map([
      { route: ['', 'transmission'], name: 'transmission-remote',      moduleId: 'transmission-remote',      nav: true, title: 'Transmission' },
      { route: 'dc', name: 'dc',      moduleId: 'eiskaltdcpp',      nav: true, title: 'DC++' },
      { route: 'torrent', name: 'torrent',      moduleId: 'torrent-page',      nav: true, title: 'Torrents' }
    ]);

    this.router = router;
  }
}
