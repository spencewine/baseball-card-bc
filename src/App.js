import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import secrets from './secrets'

class App extends Component {
    async componentDidMount(){

        //gets player data for 2017 batting title leaders
        let data = await axios.get(secrets.sportradarStats)
        let mlbBattingLeaders = data.data.leagues[0].hitting.batting_average.players
        mlbBattingLeaders.map((player) => {
            const playerURL = secrets.playerProfile(player.id)
            return axios.get(playerURL)
        })

        const PlayerDATA = await Promise.all(mlbBattingLeaders)
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
