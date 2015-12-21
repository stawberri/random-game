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
    return function() {
      seed = Math.sin(seed) * 10000;
      return seed - Math.floor(seed);
    };
  };
}();
