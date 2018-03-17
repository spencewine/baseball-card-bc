import React, { Component } from 'react';

import Card from './Card.js';


export default class User extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tradeArray: []
        }
    }



    toggleTradeArray(card, selected) {
        const nextTradeArray = this.state.tradeArray.slice()
        if (selected) {
            this.setState({
                tradeArray: [...nextTradeArray, card]
            }, () => this.props.selectCards(this.props.user.name, this.state.tradeArray))
        } else {
            this.setState({
                tradeArray: this.state.tradeArray.filter(c => c.id !== card.id)
            }, () => this.props.selectCards(this.props.user.name, this.state.tradeArray))
        }

    }

    render() {
        const { user } = this.props
        return (
            <div className="one-user">
                <h1 className="user-name">{user.name}</h1>
                {
                    user.cards.map((card, i) => {
                        return <Card
                            key={i}
                            card={card}
                            toggleTradeArray={this.toggleTradeArray.bind(this)}
                        />
                    })
                }
            </div>
        )
    }
}
