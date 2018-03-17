import React, { Component } from 'react';
export default class Card extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: false,
        }

        this.toggleTradeCard = this.toggleTradeCard.bind(this)
    }


    toggleTradeCard() {
        this.setState({
            selected: !this.state.selected
        }, () => {
            this.props.toggleTradeArray(this.props.card, this.state.selected)
        })

    }


    render() {
        const selectedStyle = {
            borderColor: 'green'
        }

        return (
            <div style={this.state.selected ? selectedStyle : {}} className="card-container" onClick={this.toggleTradeCard}>
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
