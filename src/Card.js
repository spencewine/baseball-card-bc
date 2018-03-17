import React, { Component } from 'react';
export default class Card extends Component {

    constructor(props){
        super(props)

        this.state = {
            selected: false,
        }

        this.toggleTradeCard = this.toggleTradeCard.bind(this)
    }

    componentWillUpdate(nextProps, nextState){
        console.log("NEXT STATE", nextState)

    }

    toggleTradeCard(){
        this.setState({
            selected: !this.state.selected
        }, () => {
            this.state.selected ?
                this.props.addToTradeArray(this.props.card) :
                null;

        })

    }

    convertAverage (string) {
        const average =  Number(string) * 1000;
        return average.toString();
    };

 render() {
     const selectedStyle = {
         backgroundColor: '#b1f99d',
    }

    return (
    <div style={this.state.selected ? selectedStyle : {}} className="card-container" onClick={this.toggleTradeCard}>
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
