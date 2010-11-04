var Promise = require('promise');

var UserProvider = require('user_provider_mongodb').UserProvider;
Users = new UserProvider();  

var UsersController = function() {
  this.app = module.parent.exports.app;
  this.init();
}

UsersController.prototype.init = function() {
  
  this.app.helpers({app: this.app});
    
  var xMessageErrorHandler = function(response, code) {
    return function(err) {
      response.headers['X-Message'] = err;
      response.send(code);
    }
  }
    
  this.app.get('/users', function(req, res) {
    //TODO
  });

  this.app.post('/users', function(req, res) {
    // TODO
  });
  
  this.app.del('/users/:id', function(req, res) {
    // TODO
  });

  this.app.put('/users/:id', function(req, res) {
    // TODO
  });  
}

exports = module.exports = UsersController;
