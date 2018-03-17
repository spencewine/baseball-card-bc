import React, { Component } from 'react';
export default class Card extends Component {
 
 
convertAverage (string) {
    const average =  Number(string) * 1000;
    return average.toString();
};
     
 render() {
  return (
   <div className="card-container">
        <img className="player-image" src={this.props.card.photo} />
        <div className="player-data-container">
            <div>{this.props.card.firstName}</div>
            <div>{this.props.card.lastName}</div>
            <div>{this.props.card.team}</div>
            <div>{this.props.card.position}</div>
            <div>2017 Average: {this.convertAverage(this.props.card.avg)}</div>
        </div>
   </div>
  )
 }
}