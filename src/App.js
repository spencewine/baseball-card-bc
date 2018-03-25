import React, { Component } from 'react';
import crypto from 'crypto-js';
import Createuser from './Createuser.js';
import './App.css';

import { Block, Blockchain } from './blockchain.js'
// import PlayerData from './playerData';
import PlayerData from './playerDataFinal.json'
import User from './User.js';
import TradeButton from './TradeButton';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      blockchain: new Blockchain(),
      playerData: PlayerData,
      users: [],
      cardsToSwap: {},
      rewardData: {}
    }

    this.addBlockToChain = this.addBlockToChain.bind(this);
    this.tradeCards = this.tradeCards.bind(this);
    this.addCard = this.addCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.checkSelected = this.checkSelected.bind(this);
    this.createCard = this.createCard.bind(this);
    this.generateStarterPack = this.generateStarterPack.bind(this);
    this.getReward = this.getReward.bind(this);
    this.validateCardsToSwap = this.validateCardsToSwap.bind(this);
  }

  createCard() {
    const randomNum = Math.floor(Math.random() * PlayerData.length);
    const randomCard = PlayerData[randomNum];
    return {
      firstName: randomCard.preferred_name || randomCard.first_name,
      lastName: randomCard.last_name,
      team: randomCard.team ? randomCard.team.name : 'No Team',
      position: randomCard.primary_position,
      avg: randomCard.avg,
      photo: randomCard.photo,
      id: randomCard.id,
      uuid: crypto.SHA256(randomCard.last_name, new Date().toString(), Math.random().toString())
    }
  }

  generateStarterPack() {
    // UNCOMMENT TO VIEW ALL CARDS
    // for (let i = 0; i < PlayerData.length; i++) {
    //   const card = PlayerData[i];
    //   cards.push({
    //     firstName: card.preferred_name || card.first_name,
    //     lastName: card.last_name,
    //     team: card.team ? card.team.name : 'No Team',
    //     position: card.primary_position,
    //     avg: card.avg,
    //     photo: card.photo,
    //     id: card.id,
    //     uuid: crypto.SHA256(card.last_name, new Date().toString(), Math.random().toString())
    //   })
    // }
    const cards = [];
    for (let i = 0; i < 3; i++) {
      cards.push(this.createCard());
    }
    return cards;
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
    const u1DataObj = Object.assign({}, user1, {
      cards: user1Cards,
      type: 'trade',
      from: userName2,
      cardsReceived: user2CardsToSwap
    });
    const u2DataObj = Object.assign({}, user2, {
      cards: user2Cards,
      type: 'trade',
      from: userName1,
      cardsReceived: user1CardsToSwap
    });
    this.addBlockToChain(u1DataObj);
    this.addBlockToChain(u2DataObj);
    this.setState({ cardsToSwap: {} })
  }

  getReward(user) {
    const card = this.createCard();
    const cards = user.cards.concat([card]);
    const data = Object.assign({}, user, {
      cards,
      type: 'reward',
      reward: card
    })
    this.addBlockToChain(data);
  }

  addBlockToChain(dataObj, callback = () => { }) {
    const timestamp = new Date();
    const newBlock = new Block(timestamp, dataObj)
    this.state.blockchain.addBlock(newBlock);
    const { users, rewardData } = this.state.blockchain.getChainData();
    this.setState({ users, rewardData });
  };

  validateCardsToSwap() {
    return !(Object.keys(this.state.cardsToSwap).length === 2)
  }

  render() {
    return (
      <div className="App">
        <Createuser
          addBlockToChain={this.addBlockToChain}
          blockchain={this.state.blockchain}
          generateStarterPack={this.generateStarterPack}
        />
        <TradeButton
          tradeCards={this.tradeCards}
          disabled={this.validateCardsToSwap()}
        />
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
                rewardCount={this.state.rewardData[user.name]}
                getReward={this.getReward}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

export default App;
