import styles from '../assets/tetrisboard.module.css'

export default function Main({ matrix = [], ghostPiece = [] }) {
  const blockColors = {
    'I': styles.cellI,
    'J': styles.cellJ,
    'L': styles.cellL,
    'O': styles.cellO,
    'S': styles.cellS,
    'T': styles.cellT,
    'Z': styles.cellZ
  };


  return (
    <div className={styles.tetrisBoard}>
      {matrix.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className={styles.boardRow}>
          {row.map((cell, colIndex) => {
            const cellValue = cell[0];
            const isGhost = ghostPiece.some(
              ([y, x]) => y === rowIndex && x === colIndex
            ) && !cellValue;
            
            return (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={`${styles.boardCell} ${
                  cellValue ? blockColors[cellValue] : styles.cellEmpty
                } ${isGhost ? styles.ghostCell : ''}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}