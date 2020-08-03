import React, {useEffect, useState, useMemo} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from "styled-components";
import io from 'socket.io-client';

const ChatWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChatBlock = styled.div`
    border: 1px solid steelblue;
    width: 300px;
    height: 400px;
`;

const MessagesList = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
`;

const MessageWrapper = styled.div`
    margin: 10px;
    text-align: ${(props: {textAlign: string}) => props.textAlign}
`;

const Message = styled.span`
    background: lightblue;
    padding: 5px 10px;
    border-radius: 10px;
`;

var socket = io.connect('http://127.0.0.1:5000/chat');

const Chat = () => {

    const { roomName } = useParams();
    const history = useHistory();

    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [messages, updateMessages] = useState<{ text: string, align: string }[]>([]);

    const getId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    const userId = useMemo(() => getId(), []);

    useEffect(() => {
        socket.emit('join', {username: userId, room: roomName});
        socket.on('get message', function(msg: any) {
            if(msg.userId !== userId){
                updateMessages((prevMessages) => [...prevMessages, {text: msg.data, align: 'left'}]);
            }
        });
        return () => {
            socket.emit('leave', {username: userId, room: roomName});
            socket.close();
        }
    }, [userId, roomName]);

    const onSubmit = (): void => {
        updateMessages([...messages, {text: currentMessage, align: 'right'}]);
        socket.emit('send message', {data: currentMessage, userId, room: roomName});
        setCurrentMessage('');
    }

    const onChangeRoom = (e: any) => {
        history.push('/rooms/' + e.target.value);
    }

    return (
        <ChatWrapper>
            <select
                defaultValue={roomName}
                onChange={(e) => onChangeRoom(e)}
            >
                <option value="room1">Room 1</option>
                <option value="room2">Room 2</option>
                <option value="room3">Room 3</option>
            </select>
            <ChatBlock id="chat">
                <div>
                    <input
                        type="text"
                        id="input-message"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                    />
                    <button id="send-btn" onClick={onSubmit}>Send</button>
                    <MessagesList>
                        {
                            messages.map((el, idx) => {
                                return (
                                    <MessageWrapper key={idx} textAlign={el.align}>
                                        <Message>{el.text}</Message>
                                    </MessageWrapper>
                                )
                            })
                        }
                    </MessagesList>
                </div>
            </ChatBlock>
        </ChatWrapper>
    )
}

export default Chat;