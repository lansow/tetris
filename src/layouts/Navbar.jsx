import Button from '../components/Button'
import styles from '../assets/Navbar.module.css'


export default function Navbar ({ Status, startGame, endGame, moveLeft, moveRight, moveDown, rotate }){
  return (
    <>
      {Status === false ? (
        <div className={styles.start}>
          <Button type={"sten"} func={() => startGame()}>start</Button>
        </div>
      ) : (
        <div className={styles.buttonList}>
          <div className={styles.move}>
            <div className="top">
              <Button type={"move"} func={rotate} shape={'rotate'}>rotate</Button>
            </div>
            <div className={styles.bott}>
              <Button type={"move"} func={moveRight} shape={'left'}>left</Button>
              <Button type={"move"} func={moveDown} shape={'down'}>down</Button>
              <Button type={"move"} func={moveLeft} shape={'right'}>right</Button>
            </div>
          </div>
          <div className={styles.end}>
            <Button type={"sten"} func={() => endGame()}>end</Button>
          </div>
        </div>
      )}
    </>
  );
};