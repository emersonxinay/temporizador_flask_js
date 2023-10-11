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
        document.getElementById('timer').innerText = '⏰ ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
        setTimeout(updateTimer, 1000);
      } else {
        document.getElementById('timer').innerText = '¡Tiempo!';
      }
    });
}