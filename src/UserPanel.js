import React, { Component } from 'react';

import Card from './Card.js';


export default class User extends Component{

    render () {

        return (
            <div className="one-user">
                <h1 className="user-name" >{this.props.user.name}</h1>
                { this.props.user.cards.map(card => {
                    return <Card key={card.id} card={card} />
                }) 
                }
            </div>
        )
    }   
}