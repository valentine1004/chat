from flask import Flask, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit, send, join_room, leave_room

# app = Flask(__name__, static_folder='../client/build', static_url_path='/')
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
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

@socketio.on('join', namespace='/test')
def on_join(data):
    print('data', data)
    username = data['username']
    room = data['room']
    join_room(room)
    send(username + ' has entered the room.', room=room)

@socketio.on('leave', namespace='/test')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app)