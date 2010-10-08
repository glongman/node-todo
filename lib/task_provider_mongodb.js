// UNTESTED - NOT USED AT THIS POINT - AN UNEDUCATED GUESS
// MUSING ALOUD IN CODE UNTIL THE BASIC HTTP ACTIONS ARE IMPLEMENTED


var ENV = require('environment');

var Db= require('mongodb/db').Db,
    ObjectID= require('mongodb/bson/bson').ObjectID,
    Server= require('mongodb/connection').Server;

TaskProvider = function(host, port) {
  this.db= new Db(ENV.config.database, new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

TaskProvider.prototype.getCollection= function(callback) {
  this.db.collection('tasks', function(error, task_collection) {
    if( error ) callback(error);
    else callback(null, task_collection);
  });
};

TaskProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, task_collection) {
      if( error ) callback(error)
      else {
        task_collection.find(function(error, cursor) {
          if( error ) callback(error)
          else {
            cursor.toArray(function(error, results) {
              if( error ) callback(error)
              else callback(null, results)
            });
          }
        });
      }
    });
};

TaskProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, task_collection) {
      if( error ) callback(error)
      else {
        task_collection.findOne({_id: ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

TaskProvider.prototype.save = function(tasks, callback) {
    this.getCollection(function(error, task_collection) {
      if( error ) callback(error)
      else {
        if( typeof(tasks.length)=="undefined")
          tasks = [tasks];

        for( var i =0;i< tasks.length;i++ ) {
          task = tasks[i];
          task.created_at = new Date();
        }

        task_collection.insert(tasks, function() {
          callback(null, tasks);
        });
      }
    });
};

exports.TaskProvider = TaskProvider;