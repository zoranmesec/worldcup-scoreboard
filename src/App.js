import logo from './logo.svg';
import './App.css';
import Scoreboard from './Scoreboard';
import { useState } from "react";

function AddGameForm({addGame}) {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    if(homeTeam && awayTeam) addGame(homeTeam, awayTeam);
  }

  return (
    
    <form onSubmit={handleSubmit}>
      <h2>Add game</h2>
      <label>Home team:
      <input 
          type="text" 
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
        />
      </label><br />
      <label>Away team:
      <input 
          type="text" 
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
        />
      </label>
      <input type="submit" value="Add game"/>
    </form>
  )
}


export default function App() {
  var [games, setGames] = useState([]);

  function addGame(homeTeam, awayTeam) {
    games.push({
      homeTeam: homeTeam, 
      homeTeamScore: 0, 
      awayTeam: awayTeam,
      awayTeamScore:0,
      timestamp: Date.now()
    });
    //not sure why array needs to be copied in order components to update
    var map1 = games.map(game => game)
    setGames( map1);
  }

  function onGameFinished(timestamp) {
    setGames(games.filter(game => game.timestamp!== timestamp));
  }

  function onScoreUpdated(homeTeamScore, awayTeamScore, timestamp) {

    var gameIndex = games.findIndex((el) => el.timestamp === timestamp);
    
    if(homeTeamScore!=='' && Number.isInteger(parseInt(homeTeamScore))) games[gameIndex].homeTeamScore = parseInt(homeTeamScore);
    if(awayTeamScore!=='' && Number.isInteger(parseInt(awayTeamScore))) games[gameIndex].awayTeamScore = parseInt(awayTeamScore);
    setGames(games.map((game => game)));
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        </header>
        <div className='Main-container'>
          <div className='Add-game'>
            <AddGameForm addGame={addGame} /></div>
          <div className='Scoreboard'>
            <Scoreboard 
            games={games} 
            finishedGame={onGameFinished}
            onScoreUpdate={onScoreUpdated}
           />
          </div>
        </div>
        
          
          


    </div>
  );
}

