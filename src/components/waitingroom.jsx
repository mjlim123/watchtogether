import CreateRoomModal from "./CreateRoomModal";
import JoinRoomModal from "./JoinRoomModal";


const WaitingRoom = () => {



return (
<div className="waitingroomContainer">
    <h1>Watchtogether</h1>
    <CreateRoomModal />
    <JoinRoomModal />

</div>
)
}

export default WaitingRoom;