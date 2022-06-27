import React from 'react';

const DifficultyOverlay = ({ start }) => {
  return (
    <div className='overlay'>
      <div className='difficulty'>
        <h2>Difficulty</h2>
        <button onClick={() => start('casual')}>Casual</button>
        <button onClick={() => start('medium')}>Medium</button>
        <button onClick={() => start('hard')}>Hard</button>
      </div>
    </div>
  );
}

export default DifficultyOverlay;
