import React from 'react';

const Card = ({ user, card, checkSelected, removeCard, addCard }) => {

  function handleClick() {
    if (checkSelected(user, card)) {
      removeCard(user, card);
    } else {
      addCard(user, card);
    }
  }

  function convertAverage(string) {
    const average = Number(string) * 1000;
    return average.toString();
  };

  const selectedStyle = {
    backgroundColor: '#b1f99d',
  };

  return (
    <div
      style={checkSelected(user, card) ? selectedStyle : {}}
      className="card-container"
      onClick={handleClick}
    >
      <div className="player-data-name">
        <span>{card.firstName} </span>
        <span>{card.lastName}</span>
      </div>
      <img className="player-image" alt={`${card.firstName} ${card.lastName}`} src={card.photo} />
      <div className="player-data-container">
        <div>{card.team}</div>
        <div>{card.position}</div>
        <div>2017 Average: {convertAverage(card.avg)}</div>
      </div>
    </div>
  )
}

export default Card;
