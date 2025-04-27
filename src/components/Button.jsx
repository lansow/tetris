import React from 'react'
import { ArrowBigLeftDash, ArrowBigDownDash, ArrowBigRightDash, RotateCwSquare,  } from 'lucide-react';
import styles from '../assets/Button.module.css'


export default function Button({children, func, type, shape}) {

  const buttshappe = (shape) => {
    switch (shape){
      case 'rotate': return(<RotateCwSquare size={17}/>); 
      case 'right': return(<ArrowBigRightDash size={17}/>);
      case 'down': return(<ArrowBigDownDash size={17}/>);
      case 'left': return(<ArrowBigLeftDash size={17}/>);
    }
  }

  switch (type) {
    case 'move': return ( 
      <div onClick={func} className={styles.boxButton}>
        <div className={styles[type]}><span>
          {buttshappe(shape)}
        </span></div>
      </div>
    );
    case 'sten': return (
      <div onClick={func} className={styles.boxButton}>
        <div className={styles[type]}><span>{children}</span></div>
      </div>
    );
    default : return (
        <div onClick={func} className={styles.Button}>{children}</div>
    );
  }
}
