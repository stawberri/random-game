!function() {
  // Current data version
  var dataStorageVersion = 2;

  rg.ls = Rhaboo.persistent('rg-ls');

  // Check localStorage version
  switch(rg.ls.v) {
    default:
    case 0:
    case 1:
      rg.ls.erase('d');
      rg.ls.write('d', {});
    break;

    case dataStorageVersion:
  }

  // Update version
  rg.ls.write('v', dataStorageVersion);

  // Launch game
  rg.getScript('js/launch.js');
}();
