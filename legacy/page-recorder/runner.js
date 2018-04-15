var page = require('webpage').create();
page.viewportSize = { width: 640, height: 480 };

page.open('http://www.goodboydigital.com/pixijs/examples/12-2/', function () {
  setInterval(function() {
    page.render('/dev/stdout', { format: "png" });
  }, 25);
});