import WaitingRoom from "./waitingroom";



const Home = () => {
    const url = process.env.REACT_APP_FETCH_URL;
    const key = process.env.REACT_APP_API_KEY;

    console.log(url)
    console.log(key)
    
    return (
        <div className="center"><WaitingRoom></WaitingRoom></div>
    )
}

export default Home;