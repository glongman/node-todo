var defer = require('promise').defer

/**
 * Converts a Node async function to a promise returning function
 * @param target          target passed as 'this' when the async function is applied
 * @param asyncFunction   node compatible async function which takes a callback as its last argument
 * @return A function that returns a promise
 */
var convert = function(target, asyncFunction, callbackNotDeclared){
  var arity = asyncFunction.length;
  if(callbackNotDeclared){
    arity++;
  }
  return function(){
    var deferred = defer();
    arguments.length = arity;
    arguments[arity - 1] = function(error, result) {
      if(error) {
        deferred.emitError(error);
      }
      else {
        if(arguments.length > 2){
          // if there are multiple success values, we return an array
          Array.prototype.shift.call(arguments, 1);
          deferred.emitSuccess(arguments);
        }
        else{
          deferred.emitSuccess(result);
        }
      }
    };
    asyncFunction.apply(target, arguments);
    return deferred.promise;
  };
};

var Cursor = exports.Cursor = function(mongo_cursor) {
  this.cursor = mongo_cursor;
  this.toArray = convert(this.cursor, this.cursor.toArray);
}

var Collection = exports.Collection = function(mongo_collection) {
  this.collection = mongo_collection;
  
  var findReturnsCursor = convert(this.collection, this.collection.find, true);
  
  this.find = function() {
    return findReturnsCursor.apply(this, arguments).then(function(mongo_cursor) {
      return new Cursor(mongo_cursor);
    });
  }
  
  var mapReduceReturnsCollection = convert(this.collection, this.collection.mapReduce);
  
  this.mapReduce = function() {
    return mapReduceReturnsCollection.apply(this, arguments).then(function(mongo_collection) {
      return new Collection(mongo_collection);
    });
  }
  
  this.findOne = convert(this.collection, this.collection.findOne);
  this.findAndModify = convert(this.collection, this.collection.findAndModify)
}

var Db = exports.Db = function(mongodb_db) {
  this.db = mongodb_db;
  
  this.open = convert(this.db, this.db.open);
  var collectionReturnsCollection = convert(this.db, this.db.collection);
  this.collection = function() {
    return collectionReturnsCollection.apply(this, arguments).then(function(c) {
      return new Collection(c);
    })
  }
}

