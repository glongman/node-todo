if (global.TODO == undefined) {
  
  var fs = require('fs'),
      path = require('path'); 
        
  var AppEnvironment = function() {
    this.root = fs.realpathSync(__dirname + "/..");
    this.init();
  }

  AppEnvironment.prototype.init = function() {
    this.setRequirePaths();
    this.setNodeEnvironment(process.env.NODE_ENV)
    this.readConfig(function() {
      require('app/server');
    });
  }

  AppEnvironment.prototype.readConfig = function(callback) {
    var callback = callback;
    var self = this;
    path.exists(self.root+'/config/app_config.js', function(exists) {
      if (exists) {
        self.config = require('config/app_config.js');
        self.config.database = self.config.database[process.env.NODE_ENV];
        console.log("Started with app_config: \n" + JSON.stringify(self.config, undefined, 4));
        callback();
      } else {
        console.log("File config/app_config.js not found: try `cp config/app_config.js.sample config/app_config.js`");
        process.exit();
      }
    });
  }

  AppEnvironment.prototype.setRequirePaths = function() {
    var requires = [
        '',
        '/app',
        '/lib',
        '/vendor/connect/lib',
        '/vendor/express/lib',
        '/vendor/express/support',
        '/vendor/node-mongodb-native/lib'
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
  
  // global
  global.TODO = new AppEnvironment();
}    
exports = module.exports = global.TODO;