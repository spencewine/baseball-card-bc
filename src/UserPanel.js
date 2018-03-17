import React, { Component } from 'react';

import Card from './Card.js';


export default class User extends Component{
    constructor(props){
        super(props)

        this.state = {
            tradeArray: []
        }
    }

    addToTradeArray(card){
        const nextTradeArray = this.state.tradeArray.slice()
        this.setState({
            tradeArray: [...nextTradeArray, card]
        }, () => console.log("TRADE ARRAY", this.state.tradeArray))

    }

    render () {
        const { user, selectCards } = this.props
        return (
            <div className="one-user">
                <h1>{user.name}</h1>
                { user.cards.map(card => {
                    return <Card key={card.id} card={card} user={user.name} selectCards={selectCards} addToTradeArray={this.addToTradeArray.bind(this)}/>
                })
                }
            </div>
        )
    }
}
