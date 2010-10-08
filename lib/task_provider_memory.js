// THIS IS QUICK AND DIRTY. CAVEAT EMPTOR

var taskCounter = 1;


TaskProvider = function(){};
TaskProvider.prototype.dummyData = [];

TaskProvider.prototype.findAll = function(callback) {
  callback( null, this.dummyData )
};

TaskProvider.prototype.findAllSplitByComplete = function(callback) {
  var callback = callback, 
      result = {all: null, complete:[], incomplete:[]};      
  this.findAll(function(err, tasks) {
    if (err) {
      callback(err);
      return;
    }
    result.all = tasks;
    for (i in tasks) {
      if (tasks[i].complete) {
        result.complete.push(tasks[i]);
      } else {
        result.incomplete.push(tasks[i]);
      }
    }
    callback(null,result);
  });
}

TaskProvider.prototype.findById = function(id, callback) {
  var result = null;
  for(var i =0;i<this.dummyData.length;i++) {
    if( this.dummyData[i]._id == id ) {
      result = this.dummyData[i];
      break;
    }
  }
  if (result == null) {
    callback("No task found with id: "+id);
  } else {
    callback(null, result);
  }
};

TaskProvider.prototype.updateById = function(id, updates, callback) {
  var callback = callback, updates = updates;
  // I realize that the find call will not be necessary in mongodb
  this.findById(id, function(err, result) {
    if (err) {
      callback(err);
    } else {
      for (key in updates) { 
      	if (key == 'tags' && updates.tags) {
      		result.tags = updates.tags.replace(/^\s+|\s+$/g, '').split(/\s*,\s*/).sort();
      	} else {
          result[key] = updates[key]; 
        }
      }
      result.updated_at = new Date();
      callback(null, result);
    }
  });
}

TaskProvider.prototype.deleteById = function(id, callback) {
  // really, this is not bulletproof for so many reasons!
  var task = null, newDummyData = [];
  for(var i =0;i<this.dummyData.length;i++) {
    if( this.dummyData[i]._id == id ) {
      task = this.dummyData[i];
    } else {
      newDummyData.push(this.dummyData[i]);
    }
  }
  this.dummyData = newDummyData;
  if (task == null) {
    callback("No task found with id: "+id);
  } else {
    callback(null, task);
  }
}

TaskProvider.prototype.allTags = function(callback) {
  callback(this.collectAllTags(this.dummyData));
}

// no callback
TaskProvider.prototype.collectAllTags = function(tasks) {
  if (typeof(tasks.length) == "undefined") {
    return tasks.tags;
  }
  var result = [];
  var tmp = {};
  for(var i =0;i<tasks.length;i++) {
    for (var j=0;j<tasks[i].tags.length; j++) {
      var tag = tasks[i].tags[j];
      if( typeof(tag) != "undefined" && typeof(tmp[tag]) == "undefined" ) {
        tmp[tag] = 1;
        result.push(tag);
      }
    }
  }
  return result;
}

TaskProvider.prototype.save = function(tasks, callback) {
  var task = null;

  if( typeof(tasks.length)=="undefined")
    tasks = [tasks];

  for( var i =0;i< tasks.length;i++ ) {
    task = tasks[i];
    task._id = taskCounter++;
    task.created_at = new Date();
    task.updated_at = task.created_at;
    if (typeof(task.tags) == 'undefined')
      task.tags = [];
      
    this.dummyData.unshift(task);
  }
  callback(null, tasks);
}


/* Lets bootstrap with dummy data */
new TaskProvider().save([
  {title: 'Task three', complete: true},
  {title: 'Task two', complete: false, tags: ['home', 'work']},
  {title: 'Task one', complete: false, tags: ['home']}
], function(error, tasks){});

exports.TaskProvider = TaskProvider;