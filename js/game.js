!function() {
  function play() {
    // Variables for common elements
    var el = {
      list: $('#main-list'),
      input: $('#main-input'),
      submit: $('#main-submit'),
      score: $('#main-score'),
      scoreAmount: $('#main-score .amount'),
      window: $(window),
      html: $('html'),
      topBar: $('#top-bar'),
      main: $('#game-main')
    }

    // Setup input focus
    el.html.click(function(ev) {
      el.input.focus();
    });
    el.list.on('click', 'li', function(ev) {
      el.input.prop('value', $(this).html()).select();
      checkInput();
    });

    // Output all current answers
    $.each(rg.answers, function(index, value) {
      $('<li>').text(LZString.decompress(value)).appendTo(el.list).css('order', -index);
    });

    // Display score
    el.scoreAmount.text(rg.score());

    // Input processing
    function checkInput() {
      var value = el.input.prop('value');
      // Update css class to match whether or not text is there
      if(value) {
        el.input.addClass('yes');
        rg.ls.d.write('input', LZString.compress(value));
      } else {
        el.input.removeClass('yes');
        rg.ls.d.erase('input');
      }

    }
    el.input.keyup(checkInput);

    // Restore input
    if(rg.ls.d.input) {
      el.input.prop('value', LZString.decompress(rg.ls.d.input));
      checkInput();
    }

    // Save and restore scroll
    el.window.scroll(function() {
      rg.util.rhanum(rg.ls.d, 'scrollTop', String(el.window.scrollTop()));
    });
    el.window.scrollTop(rg.util.rhanum(rg.ls.d, 'scrollTop'));

    // Submit button
    var speedCap = 0;
    el.topBar.submit(function(ev) {
      ev.preventDefault();

      var value = $.trim(el.input.prop('value'));

      // Don't do anything if value is empty
      if(!value) {
        return;
      }

      // Throttle submissions
      if($.now() < speedCap) {
        return;
      } else {
        speedCap = $.now() + 100;
      }

      el.input.prop('value', '');
      checkInput();

      // Is it a valid string?
      var color;
      if(rg.list[value]) {
        var answerIndex = $.inArray(LZString.compress(value), rg.answers);
        if(answerIndex > -1) {
          // It's already guessed!
          color = '#9966cc';

          // Analytics
          ga('send', 'event', 'input', 'duplicate', value);
        } else {
          // Approximately half chance of being 1 point
          var stringValue = Math.ceil(Math.random() * 20);
          stringValue -= 10;
          if(stringValue < 1) {
            stringValue = 1;
          }

          color = '#81d8d0';

          // Add value to answers
          answerIndex = rg.answers.length;
          rg.answers.push(LZString.compress(value));
          $('<li>').text(value).appendTo(el.list).css('order', -answerIndex);

          // Award score
          el.scoreAmount.text(rg.score(stringValue));

          // Analytics
          ga('send', 'event', 'input', 'valid', value, stringValue);
        }

        var entryElement = el.list.find('li').eq(answerIndex);
        entryElement.addClass('no-transition').css({
          color: color,
          textShadow: '0 0 10px ' + color
        })[0].offsetHeight;
        entryElement.removeClass('no-transition').css({color: '', textShadow: ''});

        // Figure out how much to scroll
        var targetScroll = entryElement.offset().top - 120;
        el.window.scrollTop(targetScroll);
      } else {
        // It's invalid.
        color = '#f400a1';

        // Penalize score
        var penalty = Math.ceil(rg.score() / 2);
        el.scoreAmount.text(rg.score(-penalty));

        // Analytics
        ga('send', 'event', 'input', 'invalid', value);
      }
      el.topBar.addClass('no-transition').css('backgroundColor', color)[0].offsetHeight;
      el.topBar.removeClass('no-transition').css('backgroundColor', '');
    });
  };

  // Start game
  rg.util.getcss('css/style.css').done(function() {
    $('body').load(rg.util.l('html/game.html'), function() {
      play();
    });
  });
}();
