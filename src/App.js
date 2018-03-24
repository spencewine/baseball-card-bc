import React, { Component } from 'react';
import Createuser from './Createuser.js';
import './App.css';

import { Block, Blockchain } from './blockchain.js'
// import PlayerData from './playerData';
import PlayerData from './playerDataFinal.json'
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
    this.tradeCards = this.tradeCards.bind(this);
    this.addCard = this.addCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.checkSelected = this.checkSelected.bind(this);
  }

  addCard(user, card) {
    const cardArr = this.state.cardsToSwap[user.name]
    const cards = cardArr ? cardArr.concat([card]) : [card];
    this.setState({
      cardsToSwap: { ...this.state.cardsToSwap, [user.name]: cards }
    }, () => console.log('CARDS TO SWAP ADDED', this.state.cardsToSwap))
  }

  removeCard(user, card) {
    const index = this.state.cardsToSwap[user.name].findIndex(c => c.uuid === card.uuid);
    const cards = this.state.cardsToSwap[user.name].slice();
    cards.splice(index, 1)
    this.setState({
      cardsToSwap: { ...this.state.cardsToSwap, [user.name]: cards }
    }, () => console.log('CARDS TO SWAP REMOVED', this.state.cardsToSwap))
  }

  checkSelected(user, card) {
    if (!this.state.cardsToSwap[user.name]) {
      return false;
    }
    return this.state.cardsToSwap[user.name].findIndex(c => c.uuid === card.uuid) > -1;
  }

  tradeCards() {
    const userName1 = Object.keys(this.state.cardsToSwap)[0];
    const userName2 = Object.keys(this.state.cardsToSwap)[1];
    const user1CardsToSwap = Object.values(this.state.cardsToSwap)[0];
    const user2CardsToSwap = Object.values(this.state.cardsToSwap)[1];
    const user1 = this.state.users.find(user => user.name === userName1)
    const user2 = this.state.users.find(user => user.name === userName2)
    const user1Cards = user1.cards.reduce((arr, card) => {
      if (!user1CardsToSwap.find(c => c.uuid === card.uuid)) {
        arr.push(card);
      }
      return arr;
    }, []).concat(user2CardsToSwap)
    const user2Cards = user2.cards.reduce((arr, card) => {
      if (!user2CardsToSwap.find(c => c.uuid === card.uuid)) {
        arr.push(card);
      }
      return arr;
    }, []).concat(user1CardsToSwap)
    this.state.blockchain.addBlock(new Block(
      new Date(),
      Object.assign({}, user1, { cards: user1Cards })
    ))
    this.state.blockchain.addBlock(new Block(
      new Date(),
      Object.assign({}, user2, { cards: user2Cards })
    ))
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
    const sortedUsers = Object.values(users).sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    })
    this.setState({ users: sortedUsers })
  }

  render() {
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
                cardsToSwap={this.state.cardsToSwap}
                addCard={this.addCard}
                removeCard={this.removeCard}
                checkSelected={this.checkSelected}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

export default App;
