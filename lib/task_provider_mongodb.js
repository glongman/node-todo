var ENV = require('config/environment');

var Db = require('mongodb-promise').Db,
    mongodb = require('mongodb'),
    ObjectID= require('mongodb/bson/bson').ObjectID,
    Server= require('mongodb/connection').Server
    
var Promise = require('promise');

TaskProvider = function(host, port) {
  this.init(host, port);
};

TaskProvider.prototype.init = function(host, port) {
  var db_connect = ENV.config.database;
  var mongodb_db = new mongodb.Db(db_connect.name, 
                      new Server(db_connect.host, db_connect.port, {auto_reconnect: true}), {native_parser:false});
  this.db = new Db(mongodb_db);
  Promise.when(this.db.open(), 
    function() {console.log("Database open")}, 
    function(err) { console.log("Error opening the database" + err)}
  );
}

// return a promise that will return the Tasks collection
TaskProvider.prototype.getCollection = function() {
  return this.db.collection('tasks');
};

// return a promise that will return a 'hash' of complete and incomplete
// tasks.
TaskProvider.prototype.findAllSplitByComplete = function(query) {
  var deferred = Promise.defer();
  Promise.all(
    this.allCompletedTasks(query),
    this.allIncompleteTasks(query)
  ).then(function(both) {
      deferred.resolve({
        complete: both[0],
        incomplete: both[1]
      });
    }
  );
  return deferred.promise;
}

// return a promise to find a Task by id
TaskProvider.prototype.findById = function(id) {
  return this.getCollection().call('findOne', {'_id': ObjectID.createFromHexString(id)})
};

// return a promise to delete a Task by id.
TaskProvider.prototype.deleteById = function(id) {
  return this.getCollection().call('remove', {'_id':ObjectID.createFromHexString(id)})
}

// return a promise to update a task and return the updated
TaskProvider.prototype.updateById = function(id, update) {
  for (key in update) { 
  	if (key == 'tags') {
  		update.tags = update.tags.replace(/^\s+|\s+$/g, '').split(/\s*,\s*/).sort();
  	} 
  }
  return this.getCollection().call('findAndModify', 
    {'_id': ObjectID.createFromHexString(id)},
    [['_id',1]],
    {'$set': update},
    {'new': true}
  );
}

// return a promise to return all the tags in the database
TaskProvider.prototype.collectAllTags = function() {
  var map = function() {
    if (!this.tags) return;
    for (index in this.tags)
      emit(this.tags[index], 1);
  };
  var reduce = function(previous, current) {
    var count = 0;
    for (index in current)
      count += current[index];
    return count;
  };
  return this.getCollection().call('mapReduce', map, reduce, {}).call('find').call("toArray")
}

// yukky non promise verion
// TaskProvider.prototype.collectAllTags = function(callback) {
//   // String functions
//   var map = function() {
//     if (!this.tags) return;
//     for (index in this.tags) {
//         emit(this.tags[index], 1);
//     }
//   };
//   var reduce = function(previous, current) {
//     var count = 0;
//     for (index in current) {
//         count += current[index];
//     }
//     return count;
//   };
//   this.getCollection(function(err, task_collection) {
//     if (err) callback(err)
//     else task_collection.mapReduce(map, reduce, {}, function(err, collection) {
//         if (err) callback(err);
//         else
//           collection.find(function(err, cursor) {
//             if (err) callback(err)
//             else
//               cursor.toArray(function(err, results) {                        
//                 if (err) callback(err)
//                 else
//                   callback(null, results)
//               });
//           });
//         });
//   });
// }

// return a promise to return all completed tasks
TaskProvider.prototype.allCompletedTasks = function(tag) {
  var query = tag ? {'complete': true, 'tags' : tag} : {'complete': true};
  return this.getCollection()
    .call("find", query, {'sort':[['updated_at',-1]]})
    .call("toArray")
}

// return a promise to return all incomplete tasks
TaskProvider.prototype.allIncompleteTasks = function(tag) {
  var query = tag ? {'complete': {'$ne' : true}, 'tags' : tag} : {'complete': {'$ne' : true}};
  return this.getCollection()
    .call('find', query, {'sort':[['updated_at',-1]]})
    .call('toArray');
}

// return a promise to insert an one or more tasks
TaskProvider.prototype.insert = function(tasks) {
  if (tasks.length == undefined)
    tasks = [tasks]
  for( var i =0;i< tasks.length;i++ ) {
    tasks[i].complete = null;
    tasks[i].updated_at = new Date();
    if (tasks[i].created_at == undefined)
      tasks[i].created_at = tasks[i].updated_at;
    if (tasks[i].tags == undefined)
      tasks[i].tags = [];
  }
  return this.getCollection().call('insert', tasks)
};

exports.TaskProvider = TaskProvider;