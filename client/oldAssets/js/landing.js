$(document).ready(function () {
  setTitles();
});

function setTitles() {
  var titles = [
    'Bienvenidos',
    'Welcome',
    'Willkommen',
    'Bienvenue',
    'Benvenuti',
  ];

  var counter = 1;

  setTimeout(function () {
    $('#hide-title').fadeOut();
  }, 2000);

  setInterval(function () {
    if (counter >= 5) {
      counter = 0;
    }

    $('#change-title').fadeOut();
    $('#change-title').text(titles[counter]).fadeIn();

    counter++;
  }, 2000);
}
