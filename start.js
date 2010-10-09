var fs = require('fs'), 
    path = require('path');
    
path.exists(fs.realpathSync('config/app_config.js'), function(exists) {
  if (exists) {
    require(__dirname + '/config/environment');
    require('app');    
  } else {
    sys.log("File config/app_config.js not found: try `cp config/app_config.js.sample config/app_config.js`");
    process.exit();
  }
})

