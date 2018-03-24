const crypto = require("crypto-js");


export class Blockchain {
  constructor(difficulty = 2) {
    this.chain = [this.createGenesis()];
    this.difficulty = difficulty;
  };

  createGenesis() {
    return new Block("03/17/2018", "genesisblock");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  getUsers() {
    let users = {};
    for (let i = this.chain.length - 1; i >= 1; i--) {
      const block = this.chain[i];
      if (!users[block.data.name]) {
        users[block.data.name] = block.data;
      }
    }
    const sortedUsers = Object.values(users).sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    })
    return sortedUsers;
  }

  addBlock(newBlock) {
    newBlock.prevHash = this.getLastBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty, this.getUsers());
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
    while (!this.hash.startsWith(str.repeat(difficulty))) {
      this.hash = this.calculateHash();
      const selectedUser = users[this.nonce % users.length];
      this.miner = selectedUser ? selectedUser.name : '';
      this.nonce++;
    }
    console.log('HASH', this.hash, this.miner)
  }
}
