import logo from './logo.svg';
import './App.css';
import Scoreboard from './Scoreboard';
import { GamesContext } from './context'
import { useState, useMemo } from "react";


export default function App() {
  var [games, setGames] = useState([]);

  const value = useMemo(
    () => ({ games, setGames }), 
    [games]
  );

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        </header>
        <div className='Main-container'>

          <div className='Scoreboard'>
            <GamesContext.Provider value={value}>
            {useMemo(() => (
            <>
              <Scoreboard 
              // finishedGame={onGameFinished}
              // onScoreUpdate={onScoreUpdated}
            />
            </>
      ), [])}

           </GamesContext.Provider>
          </div>
        </div>
    </div>
  );
}

