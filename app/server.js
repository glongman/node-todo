var ENV = require('config/environment');

var sys = require('sys'),
    fs = require('fs'),
    express = require('express');
   
var Server = function() {
  return this.init();
}

Server.prototype.init = function() {
  // until cookie-sessions works as a SessionStore of the connect's session middleware
  // we have to do this silliness.
  var app;
  if (process.env.NODE_ENV == 'test') {
    // for sessions see configure call below for test env    
    app = express.createServer();
  } else {
    // cookie sessions configured here.
    var sessions = require('cookie-sessions');
    app = express.createServer(sessions({secret: ENV.session_secret}))
  }

  app.configure(function(){
    app.set('root', ENV.root);
    app.set('views', ENV.root+'/app/views');
    app.use(express.staticProvider(ENV.root+'/public'));
    app.use(express.cookieDecoder());
    app.use(express.bodyDecoder());
    app.use(express.methodOverride());
    app.use(express.logger());

    for (var i in ENV.config)
      app.set(i, ENV.config[i]);
  });

  app.configure('development', function() {
    app.use(express.errorHandler(
      {dumpExceptions:true, showStack:true}
    ));
  });

  app.configure('production', function() {
    app.use(express.errorHandler(
      {dumpExceptions:true}
    ));
  })

  app.configure('test', function() {
    app.use(express.errorHandler(
      {dumpExceptions:true, showStack:true}
    ));
    app.use(express.session());
  });

  //require all js files in controllers subdir  
  exports.app = app;
  var controllers = fs.readdirSync(__dirname+'/controllers');
  for (i in controllers) {
    if (/\.js$/.test(controllers[i])) {
      var ControllerClass = require("controllers/"+controllers[i].substring(0, controllers[i].length - 3));
      new ControllerClass();
    }
  }

  if (process.env.NODE_ENV != 'test') {
    // test framework will call listen()
    app.listen(parseInt(app.set('port')));
  }  
  
  return app;
}
exports.Server = Server;




