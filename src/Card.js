import React, { Component } from 'react';
export default class Card extends Component {
 render() {

  return (
   <div className="card-container">
        <img className="player-image" src={this.props.card.photo} />
        <h3>{this.props.card.firstName}</h3>
        <h3>{this.props.card.lastName}</h3>
        <h3>{this.props.card.team}</h3>
        <h3>{this.props.card.position}</h3>
        <h3>{this.props.card.avg}</h3>
   </div>
  )
 }
}