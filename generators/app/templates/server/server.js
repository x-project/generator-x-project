var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');

var app = module.exports = loopback();

var morgan = require('morgan');
app.middleware('routes:before', morgan('dev'));

app.start = function() {
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

boot(app, __dirname, function(err) {
  if (err) throw err;

  app.use(loopback.static(path.resolve(__dirname, '../public')));

  var client_index_path = path.resolve(__dirname, '../public/index.html');
  app.get('*', function (req, res) { res.sendFile(client_index_path); });

  if (require.main === module) {
    app.start();
  }
});
