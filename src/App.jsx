import { useEffect } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import Main from './layouts/Main'
import Navbar from './layouts/Navbar'
import Sidbar from './layouts/Sidebar'
import './assets/App.css'



function App() {
  const {
    matrix,
    mini,
    score,
    status,
    ghostPiece,
    startGame,
    endGame,
    moveLeft,
    moveRight,
    moveDown,
    rotate
  } = useGameLogic();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!status) return;
      
      switch(e.key) {
        case 'ArrowLeft': moveRight(); break;
        case 'ArrowRight': moveLeft(); break;
        case 'ArrowDown': moveDown(true); break;
        case 'ArrowUp': rotate(); break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, moveLeft, moveRight, moveDown, rotate]);

  return (
    <div className="app-container">
        <div className="tetris-diplay">
          <div className="upper">
            <div className="main">
              <Main matrix={matrix} ghostPiece={ghostPiece} key={Date.now()}/>
            </div>
            <div className="sid">
              <Sidbar Status={status} mini={mini} score={score}/>              
            </div>
          </div>
          <div className="nav">
          <Navbar 
            Status={status} 
            startGame={startGame}
            endGame={endGame}
            moveLeft={moveLeft}
            moveRight={moveRight}
            moveDown={moveDown}
            rotate={rotate}
          />
          </div>
        </div>
      </div>
    );
}

export default App
