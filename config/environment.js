var fs = require('fs'),
    sys = require('sys');
    
var AppEnvironment = function() {
    this.config = {};
    this.init();
}

AppEnvironment.prototype.init = function() {
    try {
        var configJSON = fs.readFileSync(
            fs.realpathSync('config/app.json')
        );
    } catch (e) {
        sys.log(e.toString());
        sys.log("File config/app.json not found: try `cp config/app.json.template config/app.json`");
        process.exit();
    }
     //TODO how to force exit from a node program?
    sys.log("Started with config: ");
    sys.puts(configJSON);
    var config = JSON.parse(configJSON.toString());
    for(var setting in config)
        this.config[setting] = config[setting];
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