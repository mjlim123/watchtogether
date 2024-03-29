import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { HubConnectionBuilder, LogLevel, HubConnectionState } from "@microsoft/signalr";
import { Form, FormControl, Button, Stack } from "react-bootstrap";
import YouTube from 'react-youtube';



const Room = () => {

    const key = process.env.REACT_APP_API_KEY;
    const url = process.env.REACT_APP_FETCH_URL;

    const {id} = useParams();

    const [currentVideoId, setCurrentVideoId] = useState('');
    const [queue, setQueue] = useState([]);
    const [currentVideo, setCurrentVideo] = useState('');
    const [user, setUser] = useState(null);
    const [isVisibleUser, setIsVisibleUser] = useState(true);
    const [isVisibleChat, setIsVisibleChat] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('')
    const [videoSearch, setVideoSearch] = useState('')
    const [videoSearchResults, setVideoSearchResults] = useState([])
    
    const [connection, setConnection] = useState(null)
    const [btn, setBtn] = useState()

    async function searchYoutube(search) {
        try{
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${search}&type=video&key=AIzaSyCdRxZyDdm1PSYWpDk2bYOe6VxYCn5ymUY`)
            const result = await response.json()
            setVideoSearchResults(result.items)


        } catch (error) {
            console.log(error)
        }
        
    }

    function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

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
    function startup(something) {
        setCurrentVideo(something)
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
        currentVideo.target.pauseVideo();

    }

    function playYouTube () {
        currentVideo.target.playVideo();

    }
    function moveYouTube (time) {
        currentVideo.target.seekTo(time);
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
        try{
            const newConnection = new HubConnectionBuilder()
                .withUrl(`${url}/chat`)
                .configureLogging(LogLevel.Information)
                .build();

                newConnection.on("JoinSpecificChatRoom", (user, message, code) => {
                    updateMessages(roomData);
                });
                newConnection.on("ChangeVideo", (user, code, videoId) => {
                    setCurrentVideoId(videoId)
                });
                newConnection.on("SendMessage", (user, message, code) => {
                    updateMessages(roomData)
                })


            await newConnection.start();
            await newConnection.invoke("JoinSpecificChatRoom", user, code);        
            setConnection(newConnection);
        }
        catch (error) {
            ;
        }
    };

    const sendMessage = async (conn, user, message, code) => {
        try {
            if (conn.state === HubConnectionState.Connected) {
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
            if (conn.state === HubConnectionState.Connected) {    
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
                if (conn.state === HubConnectionState.Connected) {
            
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
            if (conn.state === HubConnectionState.Connected) {

                
                await conn.invoke("PlayVideo", user, code);

            } else {
                console.warn("SignalR connection is not in the 'Connected' state. Message not sent.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }

    }

    const changeVidForAll = async (conn, user, code, vidId) => {
        try {
            if (conn.state === HubConnectionState.Connected) {
                await conn.invoke("ChangeVideo", user, code, vidId);

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

    useEffect(() => {
        const resetConnections = () => {
            try {
                if (connection.state === HubConnectionState.Connected) {
                    connection.on("PauseVideo", (user, code) => {
                        pauseYouTube()
                    })
                    
                    connection.on("MoveVideoTime", (user, code, time) => {
                        moveYouTube(time);
                    })
                    connection.on("PlayVideo", (user, code) => {
                        playYouTube()
                    })
                }
            } catch (error) {;}
        }
        resetConnections();
    },[currentVideo])

    if (!roomData) {
        return <div>Fetching...</div>
    }

    return (
        <div>
            <Button onClick={()=> console.log(currentVideo.target)}>BUTTON</Button>
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
            <Form id="searchVideos" onSubmit={(e)=> {
                e.preventDefault()
                searchYoutube(videoSearch)
            }}>
                <FormControl placeholder="Search videos" value={videoSearch} onChange={e => setVideoSearch(e.target.value)}></FormControl>
                <Button type="submit" form="searchVideos">Search</Button>
            </Form>
            {messages.map((message, index) => <h5 key={index}>{message.author} says:  {message.contents}</h5>)}
            <YouTube onReady={(e)=> startup(e)} videoId={currentVideoId} onStateChange={(e)=>moveVideoTime(e, connection, user, id)} onPause={()=> pauseForAll(connection, user, id)}  onPlay={(e)=> {playForAll(connection, user, id)}} ></YouTube>
            <Stack>
                {videoSearchResults.map((vid, index) => <div onClick={() => {changeVidForAll(connection, user, id, vid.id.videoId)}} key={index}>{decodeHtml(vid.snippet.title)}</div>)}
            </Stack>
        </div>
    )
}
export default Room;