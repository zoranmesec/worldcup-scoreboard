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

function AddCardComponent() {
  const {games, setGames} = useContext(GamesContext);
  const [selectValue, setSelectValue] = useState("");
  const onChange = (event) => {
    const value = event.target.value;
    setSelectValue(value);
  };

  function addRedCard(type) {

    if(!selectValue) return;
    var gameIndex = games.findIndex((el) => el.timestamp === Number.parseInt(selectValue));
    if(!games[gameIndex].cards) games[gameIndex].cards = []
    games[gameIndex].cards.push({ts: Date.now(), cardType: 'RED', type: type})
    setGames(games.map((game => game)));
  }

  function addYellowCard(type) {
    if(!selectValue) return;
    var gameIndex = games.findIndex((el) => el.timestamp === Number.parseInt(selectValue));
    if(!games[gameIndex].cards) games[gameIndex].cards = []
    games[gameIndex].cards.push({ts: Date.now(), cardType: 'YELLOW', type: type})
    setGames(games.map((game => game)));
  }
  
  if(games.length !==0) {
    const listItems = games.map(game => <option value={game.timestamp} key={game.timestamp}>{game.homeTeam} vs {game.awayTeam}</option>);
    return (
      <div><h2>Add cards</h2>
      <select onChange={onChange}>
        <option value="">Please select a game</option>
        {listItems}
      </select><br />
      <button className='yellow' onClick={ e => addYellowCard('home')} >Add yellow card to home team</button><button className='yellow' onClick={  e => addYellowCard('away')} >Add yellow card to away team</button>
      <br />
      <button className='red' onClick={ e => addRedCard('home')} >Add red card to home team</button><button className='red' onClick={ e => addRedCard('away')} >Add red card to away team</button>
      </div>
    )
  } else
    return '';
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
        goals: [],
        cards: [],
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

function UpdateScoreComponent({timestamp}) {
    const [playerName, setPlayerName] = useState("");
    const [playerLastname, setPlayerLastname] = useState("");
    const {games, setGames} = useContext(GamesContext);

    const increaseHomeTeamScore = (e) => {
      e.preventDefault();
      if(!playerName || !playerLastname) return
      var gameIndex = games.findIndex((el) => el.timestamp === timestamp);
      games[gameIndex].homeTeamScore++;
      if(!games[gameIndex].goals) games[gameIndex].goals = []
      games[gameIndex].goals.push({ts: Date.now(), player: playerName.substring(0,1) + playerLastname.substring(0,1), type: 'home'})
      setGames(games.map((game => game)));
    }

    const increaseAwayTeamScore = (e) => {
      e.preventDefault();
      if(!playerName || !playerLastname) return
      var gameIndex = games.findIndex((el) => el.timestamp === timestamp);
      games[gameIndex].awayTeamScore++;
      if(!games[gameIndex].goals) games[gameIndex].goals = []
      games[gameIndex].goals.push({ts: Date.now(), player: playerName.substring(0,1) + playerLastname.substring(0,1), type: 'away'})

      setGames(games.map((game => game)));
    }
 
    return (
      <div>
        
        {/* <button onClick={ decreaseHomeTeamScore} >-</button> */}
        <label>Type player name:</label>
        <input 
            type="text" 
            onChange={(e) => setPlayerName(e.target.value)}
          /><br />
          <label>Type player last name:</label>
          <input 
            type="text" 
            onChange={(e) => setPlayerLastname(e.target.value)}
          /><br />
          <label>Add home team goal:</label>
          <button onClick={ increaseHomeTeamScore} >+</button><br />
        <label>Add away team goal:
        </label>
        {/* <button onClick={ decreaseAwayTeamScore} >-</button> */}

        <button onClick={ increaseAwayTeamScore}>+</button>
      </div>
    )
  }

function GameActivity({timestamp}) {
  const {games} = useContext(GamesContext);
  var gameIndex = games.findIndex((el) => el.timestamp === timestamp);

  
  if(games[gameIndex].goals || games[gameIndex].cards) {
    const activities = games[gameIndex].goals.concat(games[gameIndex].cards).sort((a,b) => b.ts - a.ts);
    const listItems = activities.map(activity => {
      if(activity.player) return <li key={activity.ts}>GOAL! {activity.player} on {formatDate(activity.ts)} for {activity.type} team</li>
      else return <li key={activity.ts}>card {activity.cardType} on {formatDate(activity.ts)} for {activity.type} team</li>
      
    });
    return (
      <ul>{listItems}</ul>
    )
  } else
    return '';
}

function Game({homeTeam, homeTeamScore, awayTeam, awayTeamScore, timestamp}) {
    const {games, setGames} = useContext(GamesContext);
    const changeHandler = (timestamp) => setGames(games.filter(game => game.timestamp!== timestamp));
    return (
      <div data-testid="game">
        {homeTeam} : {awayTeam} &nbsp;{homeTeamScore} : {awayTeamScore}
        <br />
      <GameActivity timestamp={timestamp} /><br />
      <button className="square" data-testid={ 'finish' + homeTeam + awayTeam} value={timestamp} onClick={() => changeHandler(timestamp)}>
        Finish match {homeTeam} vs {awayTeam}
      </button><br />
      <br />
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
      <div className="flex-container">
        <div>
          <AddGameComponent />
          <AddCardComponent />
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

