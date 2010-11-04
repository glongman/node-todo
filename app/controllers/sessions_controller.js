var Promise = require('promise');

var UserProvider = require('user_provider_mongodb').UserProvider;
Users = new UserProvider();  

var SessionsController = function() {
  this.app = module.parent.exports.app;
  this.init();
}

SessionsController.prototype.init = function() {
  
  this.app.helpers({app: this.app});
        
  this.app.get('/login', function(req, res) {
    //TODO
  });
  
  this.app.post('/login', function(req, res) {
    //TODO
  });
  
  this.app.get('/signup'), function(req, res) {
    //TODO
  });
  
  this.app.post('/signup'), function(req, res) {
    //TODO
  });

  this.app.get('/logout', function(req, res) {
    // TODO
  });

}

exports = module.exports = SessionsController;
