import React from 'react';
import Card from './Card.js';

const User = ({ user, removeCard, addCard, checkSelected }) => (
  <div className="one-user">
    <h1 className="user-name">{user.name}</h1>
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