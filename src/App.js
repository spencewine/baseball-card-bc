import React, { Component } from 'react';
import Createuser from './Createuser.js';
import './App.css';
import axios from 'axios';
import secrets from './secrets'

import { Block, Blockchain } from './blockchain.js'
import PlayerData from './playerData';
import User from './UserPanel.js';
import TradeButton from './TradeButton';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      blockchain: new Blockchain(),
      playerData: PlayerData,
      users: [],
      cardsToSwap: {}
    }

    this.addUserToChain = this.addUserToChain.bind(this);
    this.getUsersFromChain = this.getUsersFromChain.bind(this);
    this.selectCards = this.selectCards.bind(this);
    this.tradeCards = this.tradeCards.bind(this);
  }

  selectCards(user, cards) {
    if (Object.keys(this.state.cardsToSwap).length < 2) {
      this.setState({
        cardsToSwap: { ...this.state.cardsToSwap, [user]: cards }
      }, () => console.log('CARDS To SWAP', this.state.cardsToSwap))
    }
  }

  tradeCards() {
    const tradeObject = {}
    const userName1 = Object.keys(this.state.cardsToSwap)[0];
    const userName2 = Object.keys(this.state.cardsToSwap)[1];
    const user1CardsExiting = Object.values(this.state.cardsToSwap)[0];
    const user2CardsExiting = Object.values(this.state.cardsToSwap)[1];
    this.state.users.forEach(user => {
      if (user.name === userName1) {
        user1CardsExiting.forEach(card => {
          const index = user.cards.findIndex(c => c.id === card.id);
          user.cards.splice(index, 1)
        })
        user.cards = [...user.cards, ...user2CardsExiting]
        this.state.blockchain.addBlock(new Block(
          new Date(),
          user
        ))

      }
      if (user.name === userName2) {
        user2CardsExiting.forEach(card => {
          const index = user.cards.findIndex(c => c.id === card.id);
          user.cards.splice(index, 1)
        })
        user.cards = [...user.cards, ...user1CardsExiting]
        this.state.blockchain.addBlock(new Block(
          new Date(),
          user
        ))


      }
    })
    this.getUsersFromChain();

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
    for (let i = currentChain.length - 1; i >= 1; i--) {
      const block = currentChain[i];
      if (!users[block.data.name]) {
        users[block.data.name] = block.data;
      }
    }
    console.log('USERS', Object.values(users));
    const sortedUsers = Object.values(users).sort((a, b) => {
      console.log('value', a.name - b.name)
      return a.name - b.name
    })
    console.log('SORTED USERS', sortedUsers)
    this.setState({ users: sortedUsers })
  }

  render() {
    console.log(this.state.blockchain)
    return (
      <div className="App">
        <Createuser
          addUserToChain={this.addUserToChain}
          blockchain={this.state.blockchain}
          playerData={this.state.playerData}
        />
        <TradeButton tradeCards={this.tradeCards} />
        <div className="user-panel">
          {
            this.state.users.map(user => (
              <User
                key={user.name}
                user={user}
                selectCards={this.selectCards}
                cardsToSwap={this.state.cardsToSwap}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

export default App;
