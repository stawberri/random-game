!function() {
  var listTime = Math.floor($.now() / 86400000);
  var random = rg.util.randomSeed(listTime);

  // Generate strings
  rg.list = {};
  rg.answers = [];
  for(i = 0; i < 1000; i++) {
    var randomString = rg.util.randomString(16, random);
    // Make sure there aren't any duplicates
    while($.type(rg.list[randomString]) !== 'undefined') {
      randomString += rg.util.randomString(1, random);
    }

    // Add it to list
    rg.list[randomString] = true;
    rg.answers.push(randomString);
  }

  if(listTime != rg.util.rhanum(rg.ls.d, 'listTime')) {
    // Write time
    rg.util.rhanum(rg.ls.d, 'listTime', listTime);

    // Make new answer
    rg.answers = [LZString.compress(rg.answers[Math.floor(Math.random() * rg.answers.length)])];
    rg.answers = rg.ls.d.write('answers', rg.answers).answers;
  } else {
    // Load old answer list
    rg.answers = rg.ls.d.answers;
  }

  // Setup score function
  rg.score = function(mod) {
    var score = rg.util.rhanum(rg.ls.d, 'score') || 0;
    if($.type(mod) !== 'undefined') {
      score += Number(mod);

      // Score can't be negative
      if(score < 0) {
        score = 0;
      }

      rg.util.rhanum(rg.ls.d, 'score', score);
    }
    return score;
  }

  // Refresh when time is reached
  setTimeout(function() {
    location.reload();
  }, (listTime + 1) * 86400000 - $.now() + 1000);

  // Actually launch game
  rg.getScript('js/game.js');
}();
