var fs = require('fs'),
    sys = require('sys');
        
var AppEnvironment = function() {
    this.config = {};
    this.init();
}

AppEnvironment.prototype.init = function() {
    this.config = require('./app_config.js');
    sys.print("Started with app_config: \n" + JSON.stringify(this.config, undefined, 4));
    this.root = fs.realpathSync(__dirname + "/..");
}

var env = new AppEnvironment();
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
    require.paths.unshift(env.root+requires[i]);
    
exports = module.exports = env;