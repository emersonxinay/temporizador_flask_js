from flask import Flask, render_template, request, jsonify
import threading
import time

app = Flask(__name__)
timer = None
remaining_time = 0
initial_time = 0
paused_time = 0
timer_is_running = False


def countdown():
    global remaining_time, timer_is_running
    while remaining_time > 0 and timer_is_running:
        remaining_time -= 1
        time.sleep(1)
    if timer_is_running:
        timer_expired()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/start_timer', methods=['POST'])
def start_timer():
    global timer, remaining_time, initial_time, paused_time, timer_is_running
    if not timer_is_running:
        data = request.get_json()
        hours = int(data['hours'])
        minutes = int(data['minutes'])
        seconds = int(data['seconds'])
        total_seconds = hours * 3600 + minutes * 60 + seconds
        initial_time = total_seconds
        remaining_time = total_seconds - paused_time
        paused_time = 0
        timer_is_running = True
        timer = threading.Thread(target=countdown)
        timer.start()
    return jsonify({'status': 'success'})


@app.route('/pause_timer', methods=['POST'])
def pause_timer():
    global timer, timer_is_running, paused_time
    if timer_is_running:
        paused_time = initial_time - remaining_time
        timer_is_running = False
        timer.join()
    return jsonify({'status': 'success'})


@app.route('/resume_timer', methods=['POST'])
def resume_timer():
    global timer, timer_is_running
    if not timer_is_running:
        timer_is_running = True
        timer = threading.Thread(target=countdown)
        timer.start()
    return jsonify({'status': 'success'})


@app.route('/reset_timer', methods=['POST'])
def reset_timer():
    global remaining_time, initial_time, paused_time, timer_is_running
    remaining_time = initial_time
    paused_time = 0
    if not timer_is_running:
        timer_is_running = True
        timer = threading.Thread(target=countdown)
        timer.start()
    return jsonify({'status': 'success'})


@app.route('/get_remaining_time')
def get_remaining_time():
    global remaining_time
    return jsonify({'remaining_time': remaining_time})


def timer_expired():
    # Puedes cambiar esto a cualquier acción que desees realizar al finalizar el temporizador.
    print('¡Tiempo!')


if __name__ == '__main__':
    app.run(debug=True)
