jQuery(function($) {
  $('.inline').inlineLabel();

  /*
   * Editing Tasks
   */
  $('#tasks').delegate('.edit_task_link', 'click', function(){
    // show any tasks that might be hidden
    $('li.task').children().show();
    // hide any open edit forms
    $('li.task form').hide();

    // hide this task
    $(this).closest('li').children().hide();
    // show the edit form for this task
    $(this).closest('li').find('form').show();

    return false;
  });

  $('#tasks').delegate('.cancel_edit_link', 'click', function(){
    // hide this tasks edit form
    $(this).closest('li').find('form').hide();
    // show this task
    $(this).closest('li').children(':not(form)').show()

    return false;
  });

  var toggleLoading = function() { 
    // TODO
  };
  
  var ajaxErrorGrowl = function(data, xhr, status) {
    var message = xhr.getResponseHeader("X-Message");
    if (message == undefined) { message = "Try again in a few seconds."}
    $.jGrowl(message, { header: 'Oops!'}); 
  }
  
  $(document).ready(function() {
    $('form[data-remote]')
      .live("ajax:loading",   toggleLoading)
      .live("ajax:complete",  toggleLoading)
      .live("ajax:failure",   ajaxErrorGrowl)
      .live("ajax:success", function(data, status, xhr) {
        $("#response").html(status);
    });
    
    $('input[data-remote]').live('ajax:failure',  ajaxErrorGrowl);
  });
  
});


