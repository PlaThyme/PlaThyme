import './App.css';
import Carousel from './components/carousel';
import GameRoom from './components/GameRoom';


const gameInfo = {
  name: "Enigma Breaker",
  roomName: "Cool Players Only",
  roomCode: "12345"
}
const playerInfo = ["Mike", "Vandana", "Zach", "David", "QuizMASTER"]

function App() {
  return (
    <div className="App">
      <Carousel/>
      <GameRoom gameInfo={gameInfo} playerInfo={playerInfo}/>
    </div>
  );
}

export default App;