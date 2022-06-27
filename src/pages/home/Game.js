import React from 'react';

import Card from './Card';

const Game = ({ timer, difficulty, cards, selectCard, firstCard, secondCard, correctCardsId, getTime, moves }) => {

  return (
    <div className='game'>
      <div className='info'>
        <span className='timer'>{ getTime(timer) }</span>
        <span>{ moves } moves</span>
      </div>
      <div className={`cards ${difficulty}`}>
        { cards.map((image) => (
          <Card
            key={image.id}
            card={image}
            selectCard={selectCard}
            firstCard={firstCard}
            secondCard={secondCard}
            correctCardsId={correctCardsId}
          />
        ))}
      </div>
    </div>
  );
}

export default Game;
