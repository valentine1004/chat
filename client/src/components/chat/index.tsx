import React, {useEffect, useState} from 'react';
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

// const ws = new WebSocket('ws://localhost:4000');
// var socket = io.connect('http://' + document.domain + ':' + window.location.port + '/test');
var socket = io.connect('http://127.0.0.1:5000/test');

const Chat = () => {

    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [messages, updateMessages] = useState<{ text: string, align: string }[]>([]);

    useEffect(() => {
        socket.on('my response', function(msg: any) {
            console.log('msg', msg);
        });
        // ws.onmessage = function (event) {
        //     updateMessages((prevMessages) => [...prevMessages, {text: event.data, align: 'left'}]);
        // }
        // return () => ws.close();
    }, []);

    const onSubmit = (): void => {
        updateMessages([...messages, {text: currentMessage, align: 'right'}]);
        // ws.send(currentMessage);
        socket.emit('my event', {data: currentMessage});
        setCurrentMessage('');
    }

    return (
        <ChatWrapper>
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