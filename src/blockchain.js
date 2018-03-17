const CryptoJs = require("crypto-js");


 export class Blockchain {
    constructor() {
        this.chain = [this.createGenesis()];
        // this.difficulty = difficulty;
    };

    createGenesis () {
        return new Block ("03/17/2018", "genesisblock")
    }

    getLastBlock () {
        return this.chain[this.chain.length -1]
    }

    addBlock (newBlock) {
        newBlock.prevHash = this.getLastBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

 export class Block {
    constructor (timeStamp, data, prevHash = "0") {
        this.timeStamp = timeStamp;
        this.data = data;
        this.prevHash = prevHash.toString();
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash () {
        return CryptoJs.SHA256(this.prevHash + this.timestamp + JSON.stringify(this.data)).toString();
    }

    // mineBlock (difficulty) {

    // }
}
