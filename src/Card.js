import React, { Component } from 'react';
export default class Card extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: false,
        }

        this.toggleTradeCard = this.toggleTradeCard.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.deselect) {
            this.setState({ selected: false })
        }
    }


    toggleTradeCard() {
        this.setState({
            selected: !this.state.selected
        }, () => {
            this.props.toggleTradeArray(this.props.card, this.state.selected)
        })

    }

    convertAverage(string) {
        const average = Number(string) * 1000;
        return average.toString();
    };

    render() {
        const selectedStyle = {
            backgroundColor: '#b1f99d',
        }

        return (
            <div style={this.state.selected ? selectedStyle : {}} className="card-container" onClick={this.toggleTradeCard}>
                <div className="player-data-name">
                    <span>{this.props.card.firstName} </span>
                    <span>{this.props.card.lastName}</span>
                </div>
                <img className="player-image" src={this.props.card.photo} />
                <div className="player-data-container">
                    <div>{this.props.card.team}</div>
                    <div>{this.props.card.position}</div>
                    <div>2017 Average: {this.convertAverage(this.props.card.avg)}</div>
                </div>
            </div>
        )
    }
}
