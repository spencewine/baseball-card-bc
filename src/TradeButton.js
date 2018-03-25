import React from 'react';

const TradeButton = ({ tradeCards, disabled }) => {
  return (
    <button disabled={disabled} onClick={tradeCards}>TRADE</button>
  )
}

export default TradeButton;