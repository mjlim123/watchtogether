import CreateRoomModal from "./CreateRoomModal";
import JoinRoomModal from "./JoinRoomModal";


const WaitingRoom = () => {



return (
    <div className="background">
        <div className="waitingroomContainer">
            <h1 className="waitingroomText">WatchParty</h1>
            <CreateRoomModal />
            <JoinRoomModal />
        </div>
    </div>

)
}

export default WaitingRoom;