import React, { Component } from 'react';


export default class Createuser extends Component {
    constructor(props) {
        super(props)
        this.state = { userName: "" }
        this.handleChange = this.handleChange.bind(this);
        this.createUser = this.createUser.bind(this);
    }

    generateStarterPack() {
        const cards = [];
        for (let i = 0; i < 3; i++) {
            const randomNum = Math.floor(Math.random() * this.props.playerData.length);
            const randomCard = this.props.playerData[randomNum];
            cards.push({
                firstName: randomCard.preferred_name || randomCard.first_name,
                lastName: randomCard.last_name,
                team: randomCard.team ? randomCard.team.name : 'No Team',
                position: randomCard.primary_position,
                avg: randomCard.avg,
                photo: randomCard.photo,
                id: randomCard.id
            });
        }
        return cards;
    }

    createUser() {
        const uName = this.state.userName;
        const newPack = this.generateStarterPack();
        this.props.addUserToChain({ name: uName, cards: newPack });
        this.setState({ userName: "" });
    }

    handleChange(e) {
        this.setState({ userName: e.target.value });
    }

    render() {
        return (
            <div>
                <h1>Create a new user</h1>
                <input type="text" value={this.state.userName} onChange={this.handleChange} />
                <button onClick={this.createUser}>Create</button>
            </div>
        )
    }
}
