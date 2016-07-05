export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'transmission'], name: 'transmission-remote',      moduleId: 'transmission-remote',      nav: true, title: 'Transmission' },
      { route: 'dc', name: 'dc',      moduleId: 'eiskaltdcpp',      nav: true, title: 'DC++' },
      { route: 'torrent', name: 'torrent',      moduleId: 'torrent',      nav: true, title: 'Torrents' }
    ]);

    this.router = router;
  }
}
