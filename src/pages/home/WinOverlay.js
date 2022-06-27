import React from 'react';
import { Link } from 'react-router-dom';

const WinOverlay = ({ timer, getTime, moves, navigate }) => {

  const refreshPage = () => {
    navigate(0);
  };

  return (
    <div className='overlay win'>
      <p>You win in <b>{ getTime(timer) }</b> and <b>{ moves }</b> moves !</p>
      <button onClick={() => refreshPage()}>Play again</button>
    </div>
  );
}

export default WinOverlay;
