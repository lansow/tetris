export const TETROMINOES = {
    I: {
      shape: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 'I', 'I', 'I', 'I'],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ],
      color: '#00FFFF', // Cyan
      borderColor: '#00B7B7',
      width: 5,
      height: 5
    },
    J: {
      shape: [
        [0, 0, 0, 0, 0],
        [0, 'J', 0, 0, 0],
        [0, 'J', 'J', 'J', 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ],
      color: '#0000FF', // Blue
      borderColor: '#0000B7',
      width: 5,
      height: 5
    },
    L: {
      shape: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 'L', 0],
        [0, 'L', 'L', 'L', 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ],
      color: '#FF7F00', // Orange
      borderColor: '#D2691E',
      width: 5,
      height: 5
    },
    O: {
      shape: [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,'O', 'O',0],
        [0,0,'O', 'O',0],
        [0,0,0,0,0],
      ],
      color: '#FFFF00', // Yellow
      borderColor: '#B7B700',
      width: 5,
      height: 5
    },
    S: {
      shape: [
        [0,0,0,0,0],
        [0, 0, 'S', 'S',0],
        [0, 'S', 'S', 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      color: '#00FF00', // Green
      borderColor: '#00B700',
      width: 5,
      height: 5
    },
    T: {
      shape: [
        [0, 0, 0, 0, 0],
        [0, 0, 'T', 0, 0],
        [0, 'T', 'T', 'T', 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ],
      color: '#800080', // Purple
      borderColor: '#4B0082',
      width: 3,
      height: 3
    },
    Z: {
      shape: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 'Z', 'Z', 0, 0],
        [0, 0, 'Z', 'Z' ,0],
        [0, 0, 0, 0, 0]
      ],
      color: '#FF0000', // Red
      borderColor: '#B70000',
      width: 3,
      height: 3
    }
  };
  
  // لیست تمام قطعات برای انتخاب تصادفی
  export const TETROMINO_NAMES = Object.keys(TETROMINOES);
  
  // تابع چرخش قطعات
  export const rotateMatrix = (matrix) => {
    const N = matrix.length;
    const result = new Array(N).fill().map(() => new Array(N).fill(0));
    
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        result[j][N - 1 - i] = matrix[i][j] || 0;
      }
    }
    
    return result;
  };
  
  // تابع ایجاد قطعه جدید
  export const createRandomTetromino = () => {
    const name = TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
    const tetromino = TETROMINOES[name];
    
    return {
      name,
      shape: tetromino.shape,
      color: tetromino.color,
      borderColor: tetromino.borderColor,
      width: tetromino.width,
      height: tetromino.height,
      pos: { x: Math.floor(10 / 2) - Math.floor(tetromino.width / 2), y: 0 } // موقعیت شروع در وسط بالای صفحه
    };
  };