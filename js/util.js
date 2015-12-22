!function() {
  rg.util = {};

  // Concise number storage
  rg.util.rhanum = function(container, name, value) {
    if($.type(value) !== 'undefined') {
      container.write(name, LZString.compress(String(value)));
    }

    if($.type(container[name]) !== 'undefined') {
      return Number(LZString.decompress(container[name]));
    }
  }

  // Random string generator
  var randomStringChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  rg.util.randomString = function(length, random) {
    random = random || Math.random;

    var output = '';
    while(length) {
      output += randomStringChars[Math.floor(random() * 62)];

      length--;
    }

    return output;
  };

  // http://stackoverflow.com/questions/521295/javascript-random-seeds
  rg.util.randomSeed = function(seed) {
    var twister = new MersenneTwister(seed);
    return function() {
      return twister.random.apply(twister, arguments);
    }
  };

  // Append version to url to get around caching
  rg.util.l = function(url) {
    if(url.search(/ /) < 0) {
      // No spaces. Add a ? or a ; intelligently.
      return url + ((url.search(/\?/) < 0) ? '?' : ';') + '_=' + rg.v;
    } else {
      // There's a space.
      return url.replace(/ /, ((url.search(/\?/) < 0) ? '?' : ';') + '_=' + rg.v + ' ');
    }
  }

  // Load a css file
  var loadedCss = {};
  rg.util.getcss = function(url, callback) {
    return $.get(url, {_: rg.v}, function(data) {
      loadedCss[url] = loadedCss[url] || $('<style>').appendTo('head').html(data);
      if($.isFunction(callback)) {
        callback();
      }
    }, 'text');
  };
}();
