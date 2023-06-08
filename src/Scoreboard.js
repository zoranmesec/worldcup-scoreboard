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
  const games = useContext(GamesContext);
  var tmp = games.map((game) => game);
  var sorted = tmp.sort((a, b) => {
      if((a.homeTeamScore + a.awayTeamScore) < (b.homeTeamScore + b.awayTeamScore)) return 1;
      if((a.homeTeamScore + a.awayTeamScore) > (b.homeTeamScore + b.awayTeamScore)) return -1;
      
      if(a.timestamp < b.timestamp) return 1;
      if(a.timestamp > b.timestamp) return -1;
      return 0;

  });

  return (
      <div>
          <h2>Summary:</h2>
          {sorted.map((game) => 
            <div key={game.timestamp}>
                {game.homeTeam} : {game.awayTeam} ({game.homeTeamScore} : {game.awayTeamScore}) started on {formatDate(game.timestamp)}
            </div>
          )}
      </div>
  )
  }

function UpdateScoreForm({homeTeamScoreProp, awayTeamScoreProp, timestamp, updateScore}) {
    const [homeTeamScore, setHomeTeamScore] = useState("");
    const [awayTeamScore, setAwayTeamScore] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        updateScore(homeTeamScore, awayTeamScore, timestamp);
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

function Game({homeTeam, homeTeamScore, awayTeam, awayTeamScore, timestamp, onFinish, onScoreUpdate}) {
    return (
      <div name='icons'>
        {homeTeam} : {awayTeam}
      <p>{homeTeamScore} : {awayTeamScore}</p>
      <button className="square" onClick={() => onFinish(timestamp)}>
        Finish match
      </button>
      <UpdateScoreForm 
        homeTeamScoreProp={homeTeamScore} 
        awayTeamScoreProp={awayTeamScore} 
        timestamp={timestamp} 
        updateScore={onScoreUpdate} />
      <hr />
      </div>
    );
}

export default function Scoreboard(props)  {
  const games = useContext(GamesContext);
    return (
        <div>
            <h2>Scoreboard:</h2>
            {games.map((game) => 
            <Game 
                key={game.homeTeam + game.awayTeam + game.timestamp} 
                homeTeam={game.homeTeam} 
                homeTeamScore={game.homeTeamScore} 
                awayTeam={game.awayTeam} 
                awayTeamScore={game.awayTeamScore} 
                timestamp={game.timestamp} 
                onFinish={() => props.finishedGame(game.timestamp)}
                onScoreUpdate={(homeTeamScore, awayTeamScore, timestamp) => props.onScoreUpdate(homeTeamScore, awayTeamScore, timestamp)}
                />)}
            <Summary/>
        </div>
        );
}

