import React, { Component } from 'react';

const TradeButton = ({ tradeCards }) => {
  return (
    <button onClick={tradeCards}>TRADE</button>
  )
}

export default TradeButton;