var gulp = require('gulp');
var browserSync = require('browser-sync');
var url = require('url');
var proxy = require('proxy-middleware');

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000


var apiProxyOptions = url.parse('https://estellesnyders.ip.afrihost.co.za/rest');
apiProxyOptions.route = '/rest';
apiProxyOptions.rejectUnauthorized= false,
gulp.task('serve', ['build'], function(done) {
  browserSync({
    online: false,
    open: false,
    port: 9000,
    server: {
      baseDir: ['.'],
      middleware: [proxy(apiProxyOptions),function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }]
    }
  }, done);
});

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve-bundle', ['bundle'], function(done) {
  browserSync({
    online: false,
    open: false,
    port: 9000,
    server: {
      baseDir: ['.'],
      middleware: function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  }, done);
});
