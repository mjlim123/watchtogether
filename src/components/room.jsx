import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { HubConnectionBuilder, LogLevel, HubConnectionState } from "@microsoft/signalr";
import { Form, FormControl, Button } from "react-bootstrap";
import YouTube from 'react-youtube';


const Room = () => {

    const key = process.env.REACT_APP_API_KEY;
    const url = process.env.REACT_APP_FETCH_URL;

    const {id} = useParams();

    const [queue, setQueue] = useState([]);
    const [video, setVideo] = useState('');
    const [user, setUser] = useState(null);
    const [isVisibleUser, setIsVisibleUser] = useState(true);
    const [isVisibleChat, setIsVisibleChat] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('')
    const [connection, setConnection] = useState(null)
    const [btn, setBtn] = useState()

    function toggleVisibility() {
        setIsVisibleChat(!isVisibleChat);
        setIsVisibleUser(!isVisibleUser)
      };

    function cooldown() {
        const putOnCooldown = () => {
            setBtn(false);
        }
        setBtn(true)
        setTimeout(putOnCooldown,500)

    }
    async function startup(something) {
        console.log("Player ready!")
        setVideo(something)
    }

    function handleSubmit(){
        var date = new Date().toISOString();
        fetch(`${url}/api/Message`, {
        method: 'POST',
        headers: {
            'x-api-key': key,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": 0,
            "contents": input,
            "author": user,
            "roomId": roomData.roomId,
            "sentAt": date
        })})
    }

    function pauseYouTube () {
        video.target.pauseVideo();

    }

    function playYouTube () {
        video.target.playVideo();

    }
    function moveYouTube (time) {
        console.log("moving...")
        video.target.seekTo(time);
    }

    async function updateMessages(roomData){
        const fire = async () => {
                try {
                const response = await fetch(`${url}/api/Message/roomID?id=${roomData.roomId}`,{
                    method: 'GET',
                    headers: {
                        'x-api-key': key}
                });
                const messageData = await response.json();
                
                
                // Process and update messages state
                messageData.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
                setMessages(messageData);
                
            } catch (error) {
                console.error('Error fetching or updating messages:', error);
            }
        }
        setTimeout(fire, 50);
        }
    
    const establishConnection = async (user, code) => {
        console.log(user, code)
        try{
            const newConnection = new HubConnectionBuilder()
                .withUrl(`${url}/chat`)
                .configureLogging(LogLevel.Information)
                .build();

                newConnection.on("SendMessage", (user, message, code) => {
                    updateMessages(roomData);
                });

            await newConnection.start();
            await newConnection.invoke("JoinSpecificChatRoom", user, code);        
            setConnection(newConnection);
        }
        catch (error) {
            console.log(error);
        }
    };

    const sendMessage = async (conn, user, message, code) => {
        try {
            // Check if the connection is in the 'Connected' state before sending the message
            if (conn.state === HubConnectionState.Connected) {
                // Invoke the SendMessage method on the server
                conn.on("SendMessage", (user, message, code) => {
                    updateMessages(roomData)
                })
                    await conn.invoke("SendMessage", user, message, code);
            } else {
                console.warn("SignalR connection is not in the 'Connected' state. Message not sent.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }

    }
    const pauseForAll = async (conn, user, code) => {
        try {
            // Check if the connection is in the 'Connected' state before sending the message
            if (conn.state === HubConnectionState.Connected) {
                // Invoke the SendMessage method on the server
                conn.on("PauseVideo", (user, code) => {
                    pauseYouTube()
                })
                await conn.invoke("PauseVideo", user, code);

            } else {
                console.warn("SignalR connection is not in the 'Connected' state. Message not sent.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }

    }

    const moveVideoTime = async (event, conn, user, code) => {
        if (event.data == 3)
            try {
                let time = event.target.getCurrentTime();
                // Check if the connection is in the 'Connected' state before sending the message
                if (conn.state === HubConnectionState.Connected) {
                    // Invoke the SendMessage method on the server
                    conn.on("MoveVideoTime", (user, code, time) => {
                        moveYouTube(time);
                    })
                    await conn.invoke("MoveVideoTime", user, code, time);

                } else {
                    console.warn("SignalR connection is not in the 'Connected' state. Message not sent.");
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }

    }

    const playForAll = async (conn, user, code) => {
        try {
            // Check if the connection is in the 'Connected' state before sending the message
            if (conn.state === HubConnectionState.Connected) {
                // Invoke the SendMessage method on the server
                conn.on("PlayVideo", (user, code) => {
                    playYouTube()
                })
                await conn.invoke("PlayVideo", user, code);

            } else {
                console.warn("SignalR connection is not in the 'Connected' state. Message not sent.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }

    }

// Fetch Room Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}/api/Room/roomCode?roomCode=${id}`, {
                    method: 'GET',
                    headers: {'x-api-key': key }
                });
                const roomData = await response.json();
                setRoomData(roomData[0]);
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };
        fetchData();
    }, []);

    if (!roomData) {
        return <div>Fetching...</div>
    }

    return (
        <div>
            <Button onClick={()=> console.log(typeof(video.target.getCurrentTime()))}></Button>
            <h1>{roomData.roomName}</h1>
            <h1>{roomData.roomId}</h1>
            <h1>Code: {id}</h1>
            {isVisibleUser && <Form id="submitUser" onSubmit={(e) => {
                e.preventDefault();
                establishConnection(user, id);
                toggleVisibility();
                updateMessages(roomData)
                }}>
                <FormControl placeholder="Enter name" onChange={e => setUser(e.target.value)}></FormControl>
                <Button type="submit" form="submitUser">Submit</Button>
            </Form>}
            {isVisibleChat && 
            <Form id="submitMessage" onSubmit={(e)=> {
                e.preventDefault();
                handleSubmit();
                sendMessage(connection, user, input, id);
                setInput("");
                cooldown();
            }}>
                <FormControl placeholder="Enter message" value={input} onChange={e => setInput(e.target.value)}></FormControl>
                <Button disabled={btn} type="submit" form="submitMessage">Send</Button>
            </Form>}
            {messages.map((message, index) => <h5 key={index}>{message.author} says:  {message.contents}</h5>)}
            <YouTube onReady={startup} videoId="yOG0PcutnmY" onStateChange={(e)=>moveVideoTime(e, connection, user, id)} onPause={()=> pauseForAll(connection, user, id)}  onPlay={()=> playForAll(connection, user, id)} ></YouTube>
        </div>
    )
}
export default Room;