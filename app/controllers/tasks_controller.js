var Promise = require('promise');

//var TaskProvider = require('task_provider_memory').TaskProvider;
var TaskProvider = require('task_provider_mongodb').TaskProvider;
Tasks = new TaskProvider();  

var TasksController = function() {
  this.app = module.parent.exports.app;
  this.init();
}

TasksController.prototype.init = function() {
  
  this.app.helpers({app: this.app});
  
  this.app.get('/', function(req, res) {
    res.redirect('/tasks');
  });
  
  var xMessageErrorHandler = function(response, code) {
    return function(err) {
      response.headers['X-Message'] = err;
      response.send(code);
    }
  }
  
  // return a promise that resolves when the
  // passes promise and a created promise to
  // collect all tags is fulfilled.
  var withAllTags = function(promise) {
    Promise.all(
      promise,
      Tasks.collectAllTags();
    )
  }
  
  this.app.get('/tasks', function(req, res) {
    withAllTags(Tasks.findAllSplitByComplete(req.param('tag')))
    .then(function(tasks_and_tags) {
      res.render('tasks/index.html.ejs', {
        locals : {
          'incomplete_tasks': tasks_and_tags[0].incomplete,
          'complete_tasks': tasks_and_tags[0].complete,
          'all_tags': tasks_and_tags[1]
        }
      });
    })
  });

  this.app.post('/tasks', function(req, res) {
    withAllTags(Tasks.save({title: req.param('title')}))
    .then(
      function (saved_and_all_tags) { 
        var saved = saved_and_all_tags[0]
        var all_tags = saved_and_all_tags[1] //TODO update the tags via jQuery
        res.headers['Content-Type'] = 'application/javascript';
        res.render('tasks/create.js.ejs', {layout:false, locals:{task:saved[0], all_tags:all_tags}});
      },
      xMessageErrorHandler(res, 400);
    );
  });

  this.app.del('/tasks/:id', function(req, res) {
    var id = req.param('id');
    withAllTags(Tasks.deleteById(id))
    .then(
      function(result){
        all_tags = result[1]; //TODO update the tags via jQuery
        res.headers['Content-Type'] = 'application/javascript';
        res.render('tasks/deleted.js.ejs', {layout:false, locals:{task:id, all_tags:all_tags}});
      },
      xMessageErrorHandler(res, 404);
    );
  });

  this.app.put('/tasks/complete/:id', function(req, res) {
    Tasks.updateById(req.param('id'), {'complete': true})
    .then(
      function(task){
        res.headers['Content-Type'] = 'application/javascript';
        res.render('tasks/complete.js.ejs', {layout:false, locals:{task:task}});
      },
      xMessageErrorHandler(res, 404);
    );
  });

  this.app.put('/tasks/uncomplete/:id', function(req, res) {
    Tasks.updateById(req.param('id'), {'complete': false})
    .then(
      function(task){
        res.headers['Content-Type'] = 'application/javascript';
        res.render('tasks/uncomplete.js.ejs', {layout:false, locals:{task:task}});
      },
      xMessageErrorHandler(res, 404);
    );
  });

  this.app.put('/tasks/:id', function(req, res) {
    withAllTags(Tasks.updateById(req.param('id'), req.body))
    .then(
      function(task_and_tags){
        var task = task_and_tags[0];
        var all_tags = task_and_tags[1]; //TODO update the tags via jQuery
        res.headers['Content-Type'] = 'application/javascript';
        res.render('tasks/update.js.ejs', {layout:false, locals:{task:task, all_tags:all_tags}});
      },
      xMessageErrorHandler(res, 404);
    );  
  });  
}

exports = module.exports = TasksController;
