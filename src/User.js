import React from 'react';
import Card from './Card';
import Gum from './Gum';

const User = ({ user, removeCard, addCard, checkSelected, rewardCount, getReward }) => (
  <div className="one-user">
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <h1 className="user-name">{user.name}</h1>
        <Gum rewardCount={rewardCount} />
      </div>
      <button
        style={{ margin: 5 }}
        disabled={!(rewardCount && !isNaN(rewardCount) && rewardCount >= 5)}
        onClick={() => getReward(user)}>
        {'TRADE GUM FOR CARD'}
      </button>
    </div>
    {
      user.cards.map((card, i) => {
        return <Card
          key={i}
          card={card}
          removeCard={removeCard}
          addCard={addCard}
          checkSelected={checkSelected}
          user={user}
        />
      })
    }
  </div>
)
export default User;