import React from 'react';
import gumImg from './assets/gum_bubble.jpeg';

export default ({ rewardCount }) => {
  const gum = [];
  for (let i = 0; i < rewardCount; i++) {
    gum.push(
      <img
        key={i}
        src={gumImg}
        height='40px'
        width='40px'
        style={{ margin: 3 }}
        alt='gum'
      />
    )
  }
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginLeft: 10,
    }}>
      {
        gum
      }
    </div>
  )
}