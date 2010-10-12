var TaskProvider = require('task_provider_memory').TaskProvider;
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

  this.app.get('/tasks', function(req, res) {
    Tasks.findAllSplitByComplete(function(error, found) {
      res.render('tasks/index.html.ejs', {
        locals : {
          'all_tags': Tasks.collectAllTags(found.all),
          'incomplete_tasks': found.incomplete,
          'complete_tasks': found.complete,
        }
      });
    });
  });

  this.app.post('/tasks', function(req, res) {
    Tasks.save(
      {title: req.param('title')},
      function (err, saved) { 
        if (err) {
          res.headers['X-Message'] = "Try again in a few seconds.";
          res.send(400);
        } else {
          res.headers['Content-Type'] = 'application/javascript';
          res.render('tasks/create.js.ejs', {layout:false, locals:{task:saved[0]}});
        }
      }
    );
  });

  this.app.del('/tasks/:id', function(req, res) {
    Tasks.deleteById(req.param('id'), function(err, task){
      if (err) {
        res.headers['X-Message'] = err;
        res.send(404);
      } else {
        res.headers['Content-Type'] = 'application/javascript';
        res.render('tasks/deleted.js.ejs', {layout:false, locals:{task:task}});
      }
    });
  });

  this.app.put('/tasks/complete/:id', function(req, res) {
    Tasks.updateById(req.param('id'), {complete: true}, function(err, task){
      if (err) {
        res.headers['X-Message'] = err;
        res.send(404);
      } else {
        res.headers['Content-Type'] = 'application/javascript';
        res.render('tasks/complete.js.ejs', {layout:false, locals:{task:task}});
      }
    });
  });

  this.app.put('/tasks/uncomplete/:id', function(req, res) {
    Tasks.updateById(req.param('id'), {complete: false}, function(err, task){
      if (err) {
        res.headers['X-Message'] = err;
        res.send(404);
      } else {
        res.headers['Content-Type'] = 'application/javascript';
        res.render('tasks/uncomplete.js.ejs', {layout:false, locals:{task:task}});
      }
    });
  });

  this.app.put('/tasks/:id', function(req, res) {
    Tasks.updateById(req.param('id'), req.body, function(err, task){
      if (err) {
        res.headers['X-Message'] = err;
        res.send(400);
      } else {
        Tasks.allTags(function(all_tags) {
          res.headers['Content-Type'] = 'application/javascript';
          res.render('tasks/update.js.ejs', {layout:false, locals:{task:task, all_tags:all_tags}});
        })
      }
    });  
  });  
}

exports = module.exports = TasksController;
