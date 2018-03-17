import React, { Component } from 'react';
import Createuser from './Createuser.js';
import './App.css';
import axios from 'axios';
import secrets from './secrets'

import { Block, Blockchain } from './blockchain.js'
import PlayerData from './playerData';
import User from './UserPanel.js';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      blockchain: new Blockchain(), 
      playerData: PlayerData,
      users: []
    }
    this.addUserToChain = this.addUserToChain.bind(this);
    this.getUsersFromChain = this.getUsersFromChain.bind(this);
  }

  addUserToChain(dataObj) {
    const timeStamp = new Date();
    const newBlock = new Block(timeStamp, dataObj)
    this.state.blockchain.addBlock(newBlock);
    this.getUsersFromChain();
  };

  getUsersFromChain() {
    let users = {};
    const currentChain = this.state.blockchain.chain;
    for (let i=currentChain.length-1;i>=1; i--){
          const block = currentChain[i];
          if (!users[block.data.name]) {
            users[block.data.name] = block.data;
          }
      }
      console.log(users, '!@!@!')
      this.setState({users: Object.values(users)})
  }

  render() {
    console.log(this.state.blockchain,)
    return (
      <div className="App">
        <Createuser
          addUserToChain={this.addUserToChain}
          blockchain={this.state.blockchain}
          playerData={this.state.playerData}
        />
        <div className="user-panel">
          {
            this.state.users.map(user => (
              <User key={user.name} user={user} />
            ))
          }
        </div>
      </div>
    );
  }
}

export default App;
