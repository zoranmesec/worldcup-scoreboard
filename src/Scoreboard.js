import React from 'react';
import { useState, useContext } from "react";
import { GamesContext } from './context'


function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-us', { hour:"numeric", minute:"numeric", second:'numeric'}) ;
}

/**
 * Sample documentation...
 * @description Renders summary of games
 * @param {*} games Array of games
 * @returns rendered html
 */
function Summary() {
  const gamesContext = useContext(GamesContext);
  var tmp = gamesContext.games.map((game) => game);
  var sorted = tmp.sort((a, b) => {
      if((a.homeTeamScore + a.awayTeamScore) < (b.homeTeamScore + b.awayTeamScore)) return 1;
      if((a.homeTeamScore + a.awayTeamScore) > (b.homeTeamScore + b.awayTeamScore)) return -1;
      
      if(a.timestamp < b.timestamp) return 1;
      if(a.timestamp > b.timestamp) return -1;
      return 0;

  });

  return (
      <div data-testid="summary">
          <h2>Summary:</h2>
          {sorted.map((game, index) => 
            <div key={game.timestamp} data-testid={'summary' + index} title="Summary of game">
                {game.homeTeam} : {game.awayTeam} ({game.homeTeamScore} : {game.awayTeamScore}) started on {formatDate(game.timestamp)}
            </div>
          )}
      </div>
  )
}

function AddGameComponent() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const {games, setGames} = useContext(GamesContext);
  const handleSubmit = (event) => {
    event.preventDefault();
    if(homeTeam && awayTeam) {
      games.push({
        homeTeam: homeTeam, 
        homeTeamScore: 0, 
        awayTeam: awayTeam,
        awayTeamScore:0,
        timestamp: Date.now()
      });
      setGames(games.map((game => game)));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add game</h2>
      <label htmlFor="home">Home team:</label>
      <input 
          id="home"
          type="text" 
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
        />
      <br />
      <label htmlFor="away">Away team:</label>
      <input 
          id="away"
          type="text" 
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
        />
      <input type="submit" value="Add game"/>
    </form>
  )
}

function UpdateScoreComponent({homeTeamScoreProp, awayTeamScoreProp, timestamp, updateScore}) {
    const [homeTeamScore, setHomeTeamScore] = useState("");
    const [awayTeamScore, setAwayTeamScore] = useState("");

    const {games, setGames} = useContext(GamesContext);

    const handleSubmit = (event) => {
      event.preventDefault();
      var gameIndex = games.findIndex((el) => el.timestamp === timestamp);
      if(homeTeamScore!=='' && Number.isInteger(parseInt(homeTeamScore))) games[gameIndex].homeTeamScore = parseInt(homeTeamScore);
      if(awayTeamScore!=='' && Number.isInteger(parseInt(awayTeamScore))) games[gameIndex].awayTeamScore = parseInt(awayTeamScore);
      setGames(games.map((game => game)));
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <label>New score home team
        <input 
            type="text" 
            defaultValue={homeTeamScoreProp}
            onChange={(e) => setHomeTeamScore(e.target.value)}
          />
        </label><br />
        <label>New score away team
        <input 
            type="text" 
            defaultValue={awayTeamScoreProp}
            onChange={(e) => setAwayTeamScore(e.target.value)}
          />
        </label>
        <input type="submit" value="Update"/>
      </form>
    )
  }

function Game({homeTeam, homeTeamScore, awayTeam, awayTeamScore, timestamp}) {
    const {games, setGames} = useContext(GamesContext);
    const changeHandler = (timestamp) => setGames(games.filter(game => game.timestamp!== timestamp));
    return (
      <div data-testid="game">
        {homeTeam} : {awayTeam}
      <p>{homeTeamScore} : {awayTeamScore}</p>
      <button className="square" data-testid={ 'finish' + homeTeam + awayTeam} value={timestamp} onClick={() => changeHandler(timestamp)}>
        Finish match {homeTeam}:{awayTeam}
      </button>
      <UpdateScoreComponent 
        homeTeamScoreProp={homeTeamScore} 
        awayTeamScoreProp={awayTeamScore} 
        timestamp={timestamp} 
      />
      <hr />
      </div>
    );
}

export default function Scoreboard()  {
  const gamesContext = useContext(GamesContext);
    return (
      <div>
          <div className='Add-game'>
            <AddGameComponent />
          </div>
        <div>
            <h2>Scoreboard:</h2>
            {gamesContext.games.map((game) => 
            <Game 
                key={game.homeTeam + game.awayTeam + game.timestamp} 
                homeTeam={game.homeTeam} 
                homeTeamScore={game.homeTeamScore} 
                awayTeam={game.awayTeam} 
                awayTeamScore={game.awayTeamScore} 
                timestamp={game.timestamp} 
                />)}
            <Summary/>
        </div>
      </div>
        );
}

