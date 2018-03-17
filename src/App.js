import React, { Component } from 'react';
import Createuser from './Createuser.js';
import './App.css';
import axios from 'axios';
import secrets from './secrets'

import {Block, Blockchain} from './blockchain.js'

class App extends Component {
    constructor (props) {
      super (props)
      this.state = {blockchain: new Blockchain()}
    }

    async componentDidMount(){

        //gets player data for 2017 batting title leaders
        let data = await axios.get(secrets.sportradarStats)
        const mlbBattingLeaders = data.data.leagues[0].hitting.batting_average.players

        const newArray = mlbBattingLeaders.map((player) => {
            const playerURL = secrets.playerProfile(player.id)
            return axios.get(playerURL)
        })

        const PlayerDATA = await Promise.all(newArray)

        // playerWithPhotoData = playerData.map(())
        console.log("mlbBattingLeaders", PlayerDATA)
    }

  render() {
    console.log(this.state.blockchain)
    return (
      <div className="App">
        <Createuser blockchain={this.state.blockchain} />
      </div>
    );
  }
}

export default App;
