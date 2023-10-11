var timerExpired = false;
if (remainingTime <= 0 && !timerExpired) {
  timerExpired = true;
  // Resto del código...
}

document.title = 'Temporizador';
function startTimer() {
  var hours = document.getElementById('hours').value;
  var minutes = document.getElementById('minutes').value;
  var seconds = document.getElementById('seconds').value;
  fetch('/start_timer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ hours: hours, minutes: minutes, seconds: seconds })
  });
  updateTimer();
}

function stopTimer() {
  fetch('/stop_timer', {
    method: 'POST'
  });
}

function pauseTimer() {
  fetch('/pause_timer', {
    method: 'POST'
  });
}

function resumeTimer() {
  fetch('/resume_timer', {
    method: 'POST'
  });
  updateTimer();
}

function resetTimer() {
  fetch('/reset_timer', {
    method: 'POST'
  });
}

function updateTimer() {
  fetch('/get_remaining_time')
    .then(response => response.json())
    .then(data => {
      var remainingTime = data.remaining_time;
      if (remainingTime > 0) {

        var hours = Math.floor(remainingTime / 3600);
        var minutes = Math.floor((remainingTime % 3600) / 60);
        var seconds = remainingTime % 60;
        var formattedTime = pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);

        // Actualiza el temporizador en la página
        document.getElementById('timer').innerText = '⏰ ' + hours + 'h ' + minutes + 'm ' + seconds + 's';


        // Actualiza el título de la página con el tiempo restante
        document.title = formattedTime + ' - Temporizador';

        setTimeout(updateTimer, 1000);
      } else {

        // Cuando el temporizador llega a cero, reproduce el sonido
        // var audio = new Audio('../audio/alarma.wav'); // Ajusta la ruta del archivo de sonido según tu estructura de archivos
        // audio.addEventListener('canplaythrough', function () {
        //   // Reproduce el sonido cuando el temporizador llega a cero
        //   audio.play();
        // });
        if (!timerExpired) {
          timerExpired = true;
          document.getElementById('timer').innerText = '¡Tiempo!';
          // Reinicia el temporizador automáticamente después de llegar a cero
          startTimer();
        }
      }
    });
}

// Función para rellenar con ceros a la izquierda hasta cierta longitud
function pad(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}
