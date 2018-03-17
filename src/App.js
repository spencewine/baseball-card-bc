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
      this.addUserToChain = this.addUserToChain.bind(this);
    }

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

  addUserToChain (dataObj) {
    const timeStamp = new Date();
    const newBlock = new Block(timeStamp, dataObj)
    this.state.blockchain.addBlock(newBlock);
    console.log(this.state.blockchain.chain);
  };

  render() {
    console.log(this.state.blockchain)
    return (
      <div className="App">
        <Createuser addUserToChain={this.addUserToChain} blockchain={this.state.blockchain} />
      </div>
    );
  }
}

export default App;
