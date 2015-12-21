!function() {
  var listTime = rg.util.rhanum(rg.ls.d, 'listTime');
  if(!listTime || $.now() >= (listTime + 1) * 86400000) {
    // Generate a new list
    rg.ls.d.erase('list');

    // Pretty simple seeder for now.
    listTime = Math.floor($.now() / 86400000);
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
      // Approximately half chance of being 1
      var randomScore = Math.ceil(Math.random() * 20);
      randomScore -= 10;
      if(randomScore < 1) {
        randomScore = 1;

        // Consider making it the answer
        if(Math.random() < .5) {
          rg.answers.push(randomString);
        }
      }
      // Add it to list
      rg.list[randomString] = randomScore;
    }

    // Pick an answer
    rg.answers = [rg.answers[Math.floor(Math.random() * rg.answers.length)]];

    // Write list and time
    rg.ls.d.write('list', LZString.compress(JSON.stringify(rg.list)));
    rg.answers = rg.ls.d.write('answers', rg.answers).answers;
    rg.util.rhanum(rg.ls.d, 'listTime', listTime);
  } else {
    // Load old lists
    rg.list = JSON.parse(LZString.decompress(rg.ls.d.list));
    rg.answers = rg.ls.d.answers;
  }

  // Setup score function
  rg.score = function(mod) {
    var score = rg.util.rhanum(rg.ls.d, 'score') || 0;
    if($.type(mod) !== 'undefined') {
      console.log(score, mod);
      score += Number(mod);

      // Score can't be negative
      if(score < 0) {
        score = 0;
      }

      rg.util.rhanum(rg.ls.d, 'score', score);
    }
    return score;
  }

  // Actually launch game
  rg.getScript('js/game.js');
}();
