if (global.TODO_ENV == undefined) {
  
  var fs = require('fs'),
      path = require('path'); 
        
  var AppEnvironment = function() {
    this.init();
  }

  AppEnvironment.prototype.init = function() {
    this.setNodeEnvironment(process.env.NODE_ENV);
    this.root = fs.realpathSync(__dirname + "/..");
    this.setRequirePaths();
    this.readConfig();
  }

  AppEnvironment.prototype.readConfig = function() {
    try {
      this.config = require('config/app_config.js');
    } catch (e) {
      console.log("File config/app_config.js not found: try `cp config/app_config.js.sample config/app_config.js`");
      process.exit();
    }
    this.session_secret = this.getSessionSecret(this.config);
    this.config.database = this.config.database[process.env.NODE_ENV];
    console.log("Starting with app_config: \n" + JSON.stringify(this.config, undefined, 4));
    
  }
  
  AppEnvironment.prototype.getSessionSecret = function(config) {
    if (config.session_secret == undefined || config.session_secret == 'REPLACE ME') {
      console.log('config/app_config.js needs a random session secret. see the README FILE');
      process.exit();
    }
    var secret = config.session_secret;
    config.session_secret = 'hidden from prying eyes';
    return secret;
  }

  AppEnvironment.prototype.setRequirePaths = function() {
    var requires = [
        '',
        '/app',
        '/lib',
        '/vendor/connect/lib',
        '/vendor/express/lib',
        '/vendor/express/support',
        '/vendor/node-mongodb-native/lib',
        '/vendor/cookie-sessions/lib'
    ]
    //set the require paths
    for (i in requires)
        require.paths.unshift(this.root+requires[i]);
  }

  AppEnvironment.prototype.setNodeEnvironment = function(environment) {
    if (environment == undefined) {
      process.env.NODE_ENV = 'development'; 
    } else {
      process.env.NODE_ENV = environment;
    }
    console.log("environment is "+process.env.NODE_ENV);
  }
    
  global.TODO_ENV = exports = module.exports = new AppEnvironment();
  
  if (process.env.NODE_ENV != 'test') {
      var Server = require('app/server').Server;
      new Server();
  }
} else {   
  exports = module.exports = global.TODO_ENV;
}