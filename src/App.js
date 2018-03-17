import React, { Component } from 'react';
import Createuser from './Createuser.js';
import './App.css';

import {Block, Blockchain} from './blockchain.js'

class App extends Component {
  constructor (props) {
    super (props)
    this.state = {blockchain: new Blockchain()}
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
