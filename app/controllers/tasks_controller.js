var sys = require('sys');

var TaskProvider = require('task_provider_memory').TaskProvider;
Tasks = new TaskProvider();  

app = module.parent.exports;

app.get('/', function(req, res) {
  res.redirect('/tasks');
});

app.get('/tasks', function(req, res) {
  sys.log('get');
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

app.post('/tasks', function(req, res) {
  sys.log('post');
  sys.log(req.body.title);
  res.headers['Content-Type'] = 'application/javascript';
  Tasks.save(
    {title: req.param('title')},
    function (err, saved) { 
      res.render('tasks/create.js.ejs', {layout:false, locals:{task:saved[0]}});
    }
  );
});

app.del('/tasks/:id', function(req, res) {
  Tasks.deleteById(req.param('id'), function(err, task){
    if (err) {
      //what to do - some kind of error render I guess
      sys.log(err);
    } else {
      res.render('tasks/deleted.js.ejs', {layout:false, locals:{task:task}});
    }
  });
});

app.put('/tasks/complete/:id', function(req, res) {
  Tasks.updateById(req.param('id'), {complete: true}, function(err, task){
    if (err) {
      sys.log(err);
    } else {
      res.render('tasks/complete.js.ejs', {layout:false, locals:{task:task}});
    }
  });
});

app.put('/tasks/uncomplete/:id', function(req, res){
  Tasks.updateById(req.param('id'), {complete: false}, function(err, task){
    if (err) {
      sys.log(err);
    } else {
      // TODO persist the change
      res.render('tasks/uncomplete.js.ejs', {layout:false, locals:{task:task}});
    }
  });
});

app.put('/tasks/:id', function(req, res) {
  Tasks.updateById(req.param('id'), req.body, function(err, task){
    if (err) {
      sys.log(err);
    } else {
      Tasks.allTags(function(all_tags) {
        // TODO persist the change
        res.render('tasks/update.js.ejs', {layout:false, locals:{task:task, all_tags:all_tags}});
      })
    }
  });  
});