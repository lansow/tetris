import styles from '../assets/Sidbar.module.css'
import Button from '../components/Button';

export default function Sidbar({ mini = [], score }){
  const blockColors = {
    I: styles.cellI, 
    J: styles.cellJ,
    L: styles.cellL,
    O: styles.cellO,
    S: styles.cellS,
    T: styles.cellT,
    Z: styles.cellZ,
  };


  return (
    <div className={styles.Sidbar}>
      <h1>TETRIS</h1>
      <div className={styles.score}>{score}</div>
        <h3>Next:</h3>
      <div className={styles.nextPiece}>
        <div className={styles.tetrisMiniBoard}>
          {mini.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className={styles.boardRow}>
              {row.map((cell, colIndex) => {
                const cellClass = `${styles.boardCell} ${
                  cell ? blockColors[cell] : styles.cellEmpty
                }`;
                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={cellClass}
                  >
                    {cell && <span className={styles.cellChar}></span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};