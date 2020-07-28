from flask import Flask, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit

# app = Flask(__name__, static_folder='../client/build', static_url_path='/')
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
# cors = CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')

@app.route('/')
def index():
    return app.send_static_file('index.html')


@socketio.on('send message', namespace='/test')
def test_message(message):
    emit('get message', {'data': message['data'], 'userId': message['userId']}, broadcast=True)

@socketio.on('connect', namespace='/test')
def test_connect():
    print('Connected')

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app)