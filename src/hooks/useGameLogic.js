import { useState, useEffect, useCallback } from 'react';
import { TETROMINOES, createRandomTetromino, rotateMatrix } from '../utils/shapes.js'
import { createMatrix, checkCollision } from '../utils/helpers.js';

export const useGameLogic = () => {
  const [matrix, setMatrix] = useState(createMatrix());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(createRandomTetromino());
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState(false);
  const [dropTime, setDropTime] = useState(1000); // سرعت اولیه: 1 ثانیه
  const [ghostPiece, setGhostPiece] = useState([]);

  

  useEffect(() => {
    console.log('تغییر currentPiece:', currentPiece);
    console.log('تغییر matrix:', matrix);
    console.log('تغییر ghostPiece:', ghostPiece);
  }, [currentPiece, matrix, ghostPiece]);

  // محاسبه موقعیت شبح قطعه
  const updateGhostPiece = useCallback(() => {
    if (!currentPiece) {
      setGhostPiece([]);
      return;
    }
    
    // محاسبه موقعیت واقعی Ghost در ماتریس کامل
    let ghostY = currentPiece.pos.y;
    const tempMatrix = matrix.map(row => [...row]);
    
    // حذف قطعه فعلی از ماتریس موقت
    currentPiece.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const y = currentPiece.pos.y + dy;
          const x = currentPiece.pos.x + dx;
          if (y >= 0 && y < tempMatrix.length && x >= 0 && x < tempMatrix[0].length) {
            tempMatrix[y][x] = [];
          }
        }
      });
    });
  
    // محاسبه پایین‌ترین موقعیت ممکن
    while (!checkCollision(tempMatrix, currentPiece.shape, {
      x: currentPiece.pos.x,
      y: ghostY + 1
    })) {
      ghostY++;
    }
    
    // تبدیل به مختصات نمایشی (با در نظر گرفتن ردیف‌های مخفی)
    const ghostBlocks = [];
    currentPiece.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const y = ghostY + dy - 3; // تبدیل به مختصات نمایشی
          const x = currentPiece.pos.x + dx;
          if (y >= 0 && y < 14 && x >= 0 && x < 10) {
            ghostBlocks.push([y, x]);
          }
        }
      });
    });
    
    setGhostPiece(ghostBlocks);
  }, [currentPiece, matrix]);



    // اسپان قطعه جدید با امکان اسپان بالاتر از ماتریس
    const spawnPiece = useCallback(() => {
      const newPiece = nextPiece || createRandomTetromino();
      setNextPiece(createRandomTetromino());
    
      // موقعیت اولیه با 2 ردیف بالاتر از بالای ماتریس مرئی (y = -2)
      const initialPos = {
        x: Math.floor(10 / 2) - Math.floor(newPiece.shape[0].length / 2),
        y: -2 // اصلاح شده به -2
      };

      // بررسی امکان اسپان (حتی در موقعیت بالاتر)
      const canSpawn = !checkCollision(matrix, newPiece.shape, initialPos);
      
      if (canSpawn) {
        setCurrentPiece({
          ...newPiece,
          pos: initialPos
        });
        updateGhostPiece();
      } else {
        // اگر حتی در موقعیت بالاتر هم نمی‌تواند اسپان شود
        const canMoveDown = !checkCollision(matrix, newPiece.shape, {
          ...initialPos,
          y: initialPos.y + 1
        });
        
        if (!canMoveDown) {
          setStatus(false); // پایان بازی
          console.log('Game Over! No space to spawn new piece');
        } else {
          // اگر می‌تواند یک خانه پایین‌تر اسپان شود
          setCurrentPiece({
            ...newPiece,
            pos: { ...initialPos, y: initialPos.y + 1 }
          });
          updateGhostPiece();
        }
      }
    }, [matrix, nextPiece, updateGhostPiece]);


   // ادغام قطعه با ماتریس
   const mergePiece = useCallback(() => {
    if (!currentPiece) return;
    
    setMatrix(prev => {
      const newMatrix = prev.map(row => [...row]);
      currentPiece.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell) {
            const y = currentPiece.pos.y + dy;
            const x = currentPiece.pos.x + dx;
            if (y >= 0 && y < prev.length && x >= 0 && x < prev[0].length) {
              newMatrix[y][x] = [currentPiece.name];
            }
          }
        });
      });
      return newMatrix;
    });
  }, [currentPiece]); // حذف matrix از dependencies


    // پاک کردن خطوط کامل
    const clearLines = useCallback(() => {
      setMatrix(prev => {
        const newMatrix = prev.filter(row => 
          row.some(cell => cell.length === 0)
        );
        
        const linesCleared = prev.length - newMatrix.length;
        if (linesCleared > 0) {
          setScore(s => s + linesCleared * 100);
          setDropTime(prevTime => Math.max(100, prevTime - 50));
        }
        
        return [
          ...Array(linesCleared).fill().map(() => Array(10).fill([])),
          ...newMatrix
        ];
      });
    }, []);


  // حرکت قطعه
  const movePiece = useCallback((direction) => {
    if (!currentPiece || !status) return false;
    
    const newPos = { ...currentPiece.pos };
    switch (direction) {
      case 'left': newPos.x--; break;
      case 'right': newPos.x++; break;
      case 'down': newPos.y++; break;
      default: break;
    }
    
    if (!checkCollision(matrix, currentPiece.shape, newPos)) {
      setCurrentPiece({ ...currentPiece, pos: newPos });
      updateGhostPiece(); // اضافه کردن این خط برای به روز رسانی فوری ghost
      return true;
    }
    
    if (direction === 'down') {
      mergePiece();
      spawnPiece();
      clearLines();
      return false;
    }
    
    return false;
  }, [currentPiece, matrix, status, mergePiece, spawnPiece, clearLines, updateGhostPiece]);

  // چرخش قطعه
  const rotatePiece = useCallback(() => {
    if (!currentPiece) return;
    
    const rotatedShape = rotateMatrix(currentPiece.shape);
    if (!checkCollision(matrix, rotatedShape, currentPiece.pos)) {
      setCurrentPiece({ ...currentPiece, shape: rotatedShape });
      updateGhostPiece();
    }
  }, [currentPiece, matrix, updateGhostPiece]);


  // حرکت خودکار به پایین
  const dropPiece = useCallback(() => {
    movePiece('down');
  }, [movePiece]);

  useEffect(() => {
    updateGhostPiece();
  }, [currentPiece, matrix, updateGhostPiece]);

  useEffect(() => {
    if (status) {
      const gameInterval = setInterval(dropPiece, dropTime);
      return () => clearInterval(gameInterval);
    }
  }, [status, dropPiece, dropTime]);

  const getRenderMatrix = useCallback(() => {
    const visibleMatrix = matrix.slice(3); // حذف 3 ردیف مخفی اول
    const renderMatrix = visibleMatrix.map(row => [...row]);
  
    if (currentPiece) {
      // تبدیل مختصات واقعی به نمایشی (کسر کردن 3 برای ردیف‌های مخفی)
      const displayY = currentPiece.pos.y - 3;
      
      currentPiece.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell) {
            const y = displayY + dy;
            const x = currentPiece.pos.x + dx;
            if (y >= 0 && y < 14 && x >= 0 && x < 10) {
              renderMatrix[y][x] = [currentPiece.name];
            }
          }
        });
      });
    }
    
    return renderMatrix;
  }, [matrix, currentPiece]);


  const hardDrop = useCallback(() => {
    if (!currentPiece || !status) return;
  
    // محاسبه موقعیت نهایی
    let ghostY = currentPiece.pos.y;
    while (!checkCollision(matrix, currentPiece.shape, {
      x: currentPiece.pos.x,
      y: ghostY + 1
    })) {
      ghostY++;
    }
  
    // ایجاد کپی از ماتریس و ادغام قطعه
    setMatrix(prev => {
      const newMatrix = prev.map(row => [...row]);
      currentPiece.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell) {
            const y = ghostY + dy;
            const x = currentPiece.pos.x + dx;
            if (y >= 0 && y < prev.length && x >= 0 && x < prev[0].length) {
              newMatrix[y][x] = [currentPiece.name];
            }
          }
        });
      });
      return newMatrix;
    });
  
    // اسپان قطعه جدید و پاکسازی خطوط
    spawnPiece();
    clearLines();
  }, [currentPiece, status, spawnPiece, clearLines]);


  return {
    matrix: getRenderMatrix(),
    mini: nextPiece ? nextPiece.shape.map(row => 
      row.map(cell => cell ? cell : null)
    ) : [[]],
    score,
    status,
    ghostPiece,
    startGame: () => {
      const newMatrix = createMatrix();
      console.log(newMatrix); // برای دیباگ
      setMatrix(newMatrix);
      setScore(0);
      setStatus(true);
      setDropTime(1000);
      spawnPiece();
    },
    endGame: () => setStatus(false),
    moveLeft: () => movePiece('left'),
    moveRight: () => movePiece('right'),
    moveDown: (isHardDrop = false) => {
      if (isHardDrop) {
        hardDrop(); // سقوط سریع
      } else {
        movePiece('down'); // حرکت تدریجی
      }
    },
    rotate: rotatePiece
  };
};