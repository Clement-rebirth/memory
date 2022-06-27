import React from 'react';

const Card = ({ card, selectCard, firstCard, secondCard, correctCardsId }) => {  
  return (
    <div className='card-container' onClick={() => selectCard(card)}>
      <div className={`card ${card.id === firstCard.id || card.id === secondCard.id || correctCardsId.includes(card.id) ? 'flip' : ''}`}>
        <div className='front'></div>
        <div className='back'>
          <img src={card.url} />
        </div>
      </div>
    </div>
  );
}

export default Card;
