const crypto = require("crypto-js");

export class Blockchain {
  constructor(difficulty = 3) {
    this.chain = [this.createGenesis()];
    this.difficulty = difficulty;
  };

  createGenesis() {
    return new Block("03/17/2018", "genesisblock");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  getChainData() {
    const users = {};
    const rewardData = {};
    for (let i = this.chain.length - 1; i >= 1; i--) {
      const block = this.chain[i];
      if (!users[block.data.name]) {
        users[block.data.name] = block.data;
      }
      if (!rewardData[block.miner]) {
        rewardData[block.miner] = 1;
      } else {
        rewardData[block.miner]++;
      }
      if (block.data.type === 'reward') {
        if (rewardData[block.data.name]) {
          rewardData[block.data.name] -= 5;
        } else {
          rewardData[block.data.name] = -5;
        }
      }
    }
    const sortedUsers = Object.values(users).sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    })
    return { users: sortedUsers, rewardData };
  }

  addBlock(newBlock) {
    newBlock.prevHash = this.getLastBlock().hash;
    newBlock.mineBlock(this.difficulty, this.getChainData().users);
    this.chain.push(newBlock);
    console.log('BLOCKCHAIN', this.chain);
  }
}

export class Block {
  constructor(timeStamp, data, prevHash = "0") {
    this.timeStamp = timeStamp;
    this.data = data;
    this.prevHash = prevHash.toString();
    this.hash = this.calculateHash();
    this.nonce = 0;
    this.miner = '';
  }

  calculateHash() {
    return crypto.SHA256(this.prevHash + this.timestamp + this.nonce + JSON.stringify(this.data)).toString();
  }

  mineBlock(difficulty, users) {
    const str = '0';
    let selectedUser;
    while (!this.hash.startsWith(str.repeat(difficulty))) {
      this.hash = this.calculateHash();
      selectedUser = users[this.nonce % users.length];
      this.miner = selectedUser ? selectedUser.name : '';
      this.nonce++;
    }
    // console.log('BLOCK ADDED', this.miner, this.nonce, selectedUser)
  }
}
