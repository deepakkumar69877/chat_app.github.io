import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

let socket;

const Chat = ({ location }) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers]= useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';



    useEffect(() => {
        // const data =queryString.parse(location.search);
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);
        // console.log(location.search);
        // console.log(data);
        setName(name);
        setRoom(room);
        // console.log(socket);
        socket.emit('join', { name, room }, (error) => {
            // alert(error);
            if(error){
                alert(error);
            }
        });

        // return () => {
        //     socket.emit('disconnect');
        //     socket.off();
        // }

    }, [ENDPOINT,location.search]);



    useEffect(()=> {
        socket.on('message',message=>{
            setMessages(messages=>[ ...messages ,message]);

        });

        socket.on("roomData",({ users })=>{
            setUsers(users);
        });

    },[]);

    // function for sending messages
    const sendMessage = (event) =>{
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message, ()=> setMessage(''));
        }
    }

    // console.log(message,messages);

    return (
        <div>
            <div className="outerContainer">
                <div className="container">
                    {/* <input value={message} onChange={(event)=> setMessage(event.target.value)}
                    onKeyPress={event=> event.key === 'Enter' ? sendMessage(event):null}
                    /> */}

                    <InfoBar  room={room}/>
                        <Messages messages={messages} name={name} />
                    <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                
                </div>

            </div>
        </div>
    )
}
export default Chat;