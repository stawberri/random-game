!function() {
  // Current data version
  var dataStorageVersion = 1;

  rg.ls = Rhaboo.persistent('rg-ls');

  // Check localStorage version
  switch(rg.ls.v) {
    default:
      rg.ls.erase('d');
      rg.ls.write('d', {});
    break;

    case 0:
      rg.ls.d.erase('list');
      rg.ls.d.write('answers', $.map(rg.ls.d.answers, function(value, index) {
        return LZString.compress(value);
      }));
    break;

    case dataStorageVersion:
  }

  // Update version
  rg.ls.write('v', dataStorageVersion);

  // Launch game
  rg.getScript('js/launch.js');
}();
