!function() {
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
    $('<li>').text(value).appendTo(el.list).css('order', -index);
  });

  // Display score
  el.scoreAmount.text(rg.score());

  // Update css class to match whether or not text is there
  function checkInput() {
    if(el.input.prop('value')) {
      el.input.addClass('yes');
    } else {
      el.input.removeClass('yes');
    }
  }
  el.input.keyup(checkInput);

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
    var stringValue = rg.list[value], color;
    if($.type(stringValue) === 'number') {
      var answerIndex = $.inArray(value, rg.answers);
      if($.inArray(value, rg.answers) > -1) {
        // It's already guessed!
        color = 'rgba(0, 0, 255, .85)';
      } else {
        // Set opacity to a value based on value (which has a max of 10)
        var opacity = .1 + stringValue / 20;
        color = 'rgba(0, 255, 0, ' + opacity + ')';

        // Add value to answers
        answerIndex = rg.answers.length;
        rg.answers.push(value);
        $('<li>').text(value).appendTo(el.list).css('order', -answerIndex);

        // Award score
        el.scoreAmount.text(rg.score(stringValue));
      }

      var entryElement = el.list.find('li').eq(answerIndex);
      entryElement.addClass('no-transition').css({
        color: color,
        textShadow: '0 0 10px ' + color
      })[0].offsetHeight;
      entryElement.removeClass('no-transition').css({color: '', textShadow: ''});

      // Figure out how much to scroll
      var targetScroll = entryElement.offset().top - el.main.offset().top + el.main.scrollTop() - 20;
      el.main.scrollTop(targetScroll);
    } else {
      // It's invalid.
      color = 'rgba(255, 0, 0, .5)';

      // Penalize score
      var penalty = Math.ceil(rg.score() / 2);
      el.scoreAmount.text(rg.score(-penalty));
    }
    el.topBar.addClass('no-transition').css('backgroundColor', color)[0].offsetHeight;
    el.topBar.removeClass('no-transition').css('backgroundColor', '');
  });
}();
