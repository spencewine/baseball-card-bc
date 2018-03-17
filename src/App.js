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
      cardsToSwap: {},
      deselect: false
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
      })
    }
  }

  tradeCards() {
    const tradeObject = {}
    const userName1 = Object.keys(this.state.cardsToSwap)[0];
    const userName2 = Object.keys(this.state.cardsToSwap)[1];
    const user1CardsExiting = Object.values(this.state.cardsToSwap)[0];
    const user2CardsExiting = Object.values(this.state.cardsToSwap)[1];
    const user1 = this.state.users.find(user => user.name === userName1)
    const user2 = this.state.users.find(user => user.name === userName2)
    const user1CardsRemoved = user1.cards.reduce((arr, card) => {
      if (!user1CardsExiting.find(c => c.id === card.id)) {
        arr.push(card);
      }
      return arr;
    }, [])
    const user2CardsRemoved = user2.cards.reduce((arr, card) => {
      if (!user2CardsExiting.find(c => c.id === card.id)) {
        arr.push(card);
      }
      return arr;
    }, [])
    const user1CardsAdded = user1CardsRemoved.concat(user2CardsExiting);
    const user2CardsAdded = user2CardsRemoved.concat(user1CardsExiting);
    this.state.blockchain.addBlock(new Block(
      new Date(),
      Object.assign({}, user1, { cards: user1CardsAdded })
    ))
    this.state.blockchain.addBlock(new Block(
      new Date(),
      Object.assign({}, user2, { cards: user2CardsAdded })
    ))
    // this.state.users.forEach(user => {
    //   if (user.name === userName1) {
    //     let newCardArray = [];
    //     user1CardsExiting.forEach(card => {
    //       const index = user.cards.findIndex(c => c.id === card.id);
    //       newCardArray = user.cards.filter(c => !(c.id === card.id));
    //     })
    //     user.cards = [...newCardArray, ...user2CardsExiting]
    //     this.state.blockchain.addBlock(new Block(
    //       new Date(),
    //       user
    //     ))

    //   }
    //   if (user.name === userName2) {
    //     let newCardArray = [];
    //     user2CardsExiting.forEach(card => {
    //       const index = user.cards.findIndex(c => c.id === card.id);
    //       // user.cards.splice(index, 1)
    //       newCardArray = user.cards.filter(c => !(c.id === card.id));
    //     })
    //     user.cards = [...newCardArray, ...user1CardsExiting]
    //     this.state.blockchain.addBlock(new Block(
    //       new Date(),
    //       user
    //     ))


    //   }
    // })
    this.getUsersFromChain();
    this.setState({ cardsToSwap: {}, deselect: true }, () => {
      this.setState({ deselect: false })
    })

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
    const sortedUsers = Object.values(users).sort()
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
            this.state.users.sort((a, b) => {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return 1;
              return 0;
            }).map(user => (
              <User
                key={user.name}
                user={user}
                selectCards={this.selectCards}
                cardsToSwap={this.state.cardsToSwap}
                deselect={this.state.deselect}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

export default App;
