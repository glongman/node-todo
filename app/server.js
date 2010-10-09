var ENV = require('config/environment');

var sys = require('sys'),
    fs = require('fs'),
    express = require('express');
    
var app = module.exports = express.createServer();
    
app.configure(function(){
  app.set('root', ENV.root);
  app.set('views', ENV.root+'/app/views');
  app.use(express.staticProvider(ENV.root+'/public'));
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
});

//require all js files in controllers subdir  
var controllers = fs.readdirSync(__dirname+'/controllers');
for (i in controllers) {
  if (/\.js$/.test(controllers[i])) {
    require("controllers/"+controllers[i].substring(0, controllers[i].length - 3));
  }
}

if (process.env.NODE_ENV != 'test') {
  app.listen(parseInt(app.set('port')));
}

