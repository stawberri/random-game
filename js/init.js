!function() {
  // Move people to https://rg.aideen.pw/ if they aren't already there
  if(location.protocol + location.host != 'https:rg.aideen.pw' && location.host != 'localhost:8000') {
    // Attempt to record that redirection is needed. It's okay if this fails--players will just have to keep coming back here
    try {window.localStorage.setItem('rg-redirecthttps', 1);} catch(e) {}
    location.replace('https://rg.aideen.pw' + location.pathname + location.search + location.hash);
    return;
  }

  var rg = {};

  // Create init function
  rg.init = function() {
    if(rg.init.once) return;
    rg.init.once = true;

    var pendingTasks = [], defer;

    // Create getScript function
    rg.getScript = function(url, callback) {
      return $.get(url, {_: rg.v}, function(data) {
        eval(data);
        if($.isFunction(callback)) {
          callback();
        }
      }, 'text');
    };

    $.getScript('lib/rhaboo.2015.11.8.js', pendingTasks[pendingTasks.push($.Deferred()) - 1].resolve);
    $.getScript('lib/lz-string.2015.11.9.js', pendingTasks[pendingTasks.push($.Deferred()) - 1].resolve);
    rg.getScript('js/util.js', pendingTasks[pendingTasks.push($.Deferred()) - 1].resolve);

    $.when.apply($, pendingTasks).done(function() {
      rg.getScript('js/update.js');
    });
  }

  // Expose rg for debugging
  if(location.host === 'localhost:8000') {
    window.rg = rg;
  }

  // Version checks
  $.get('version.txt', {_: $.now()}, function(initial) {
    rg.v = $.trim(initial);
    setInterval(function() {
      $.get('version.txt', {_: $.now()}, function(current) {
        if(initial !== current) {
          location.reload();
        }
      }, 'text');
    }, 60000);

    rg.init();
  }, 'text');
}();
