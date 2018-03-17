import React, { Component } from 'react';
import Createuser from './Createuser.js';
import './App.css';

import {Block, Blockchain} from './blockchain.js'

class App extends Component {
  constructor (props) {
    super (props)
    this.state = {blockchain: new Blockchain()}
    this.addUserToChain = this.addUserToChain.bind(this);

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
