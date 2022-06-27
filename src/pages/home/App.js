import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Manager from '../../services/firebase/Manager';
import shuffle from '../../services/shuffle';

import DifficultyOverlay from './DifficultyOverlay';
import Game from './Game';
import Loading from '../../common/Loading/Loading';
import WinOverlay from './WinOverlay';

import './App.scss';

function App() {

  const [gameStart, setGameStart] = useState(false);
  const [difficulty, setDifficulty] = useState('');
  const [images, setImages] = useState(false);
  const [gameImages, setGameImages] = useState(false);
  const [win, setWin] = useState(false);
  const [timer, setTimer] = useState(0);
  const [firstCard, setFirstCard] = useState(false);
  const [secondCard, setSecondCard] = useState(false);
  const [correctCardsId, setCorrectCardsId] = useState([]);
  const [moves, setMoves] = useState(0);
  const [intervalId, setIntervalId] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    let imagesManager = new Manager('images');
    
    imagesManager.getAllOnce((snapshot => {
      let data = snapshot.val();
      let images = Object.keys(data).map(key => ({
        url: `https://firebasestorage.googleapis.com/v0/b/memory-7dc6f.appspot.com/o/memory-images%2F${data[key].imageName}?alt=media`
      }));
      setImages(shuffle(images));
    }));
  }, []);

  const start = difficulty => {
    setGameStart(true);
    setDifficulty(difficulty);
    startTimer();

    let nbOfImages;

    switch (difficulty) {
      case 'casual':
        nbOfImages = 8;
        break;
      case 'medium':
        nbOfImages = 12;
        break;
      case 'hard':
        nbOfImages = 16;
        break;
    }

    let gameImages = images.slice(0, nbOfImages);

    gameImages = [...gameImages, ...gameImages]; // to have every card twice
    gameImages = gameImages.map((image, index) => ({ id: index, url: image.url })); // to have a unique id for every image
    gameImages = shuffle(gameImages);

    setGameImages(gameImages);
  };

  const selectCard = (card) => {
    
    if (correctCardsId.includes(card.id)) return;

    // if the selected card is an already fliped one
    if (card.id === firstCard.id) return;

    if (!firstCard) {
      setFirstCard(card);
      return;
    }

    if (firstCard && !secondCard) {
      setMoves(moves => moves + 1);
      setSecondCard(card);

      const clearCards = () => {
        setFirstCard(false);
        setSecondCard(false);
      };

      // if cards match
      if (firstCard.url === card.url) {
        setCorrectCardsId([ ...correctCardsId, firstCard.id, card.id ]);
        clearCards();
      } else {
        setTimeout(() => {
          clearCards();
        }, 1500);
      }

      return;
    }

    if (firstCard && secondCard) return;
  };

  useEffect(() => {
    // if win
    if (correctCardsId.length === gameImages.length) {
      setWin(true);
      clearInterval(intervalId);
    }
  }, [correctCardsId]);

  const getTime = (time) => {
    let seconds = time % 60;
    let minutes = (timer - timer % 60) / 60;

    if (String(seconds).length < 2) seconds = '0' + seconds;
    if (String(minutes).length < 2) minutes = '0' + minutes;
    
    return `${minutes} : ${seconds}`;
  };

  const startTimer = () => {
    let intervalId = setInterval(() => {
      setTimer(seconds => seconds + 1);
    }, 1000);

    setIntervalId(intervalId);
  };

  if (!images) return <Loading />;

  return (
    <div className='app'>
      <h1>Memory card game</h1>

      { !gameStart && <DifficultyOverlay start={start} /> }

      { gameImages &&
        <Game
          timer={timer}
          difficulty={difficulty}
          gameImages={gameImages}
          selectCard={selectCard}
          firstCard={firstCard}
          secondCard={secondCard}
          correctCardsId={correctCardsId}
          getTime={getTime}
          moves={moves}
        />
      }

      { win && <WinOverlay getTime={getTime} timer={timer} moves={moves} navigate={navigate} /> }
    </div>
  );
}

export default App;
