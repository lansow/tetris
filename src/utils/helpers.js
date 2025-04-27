// helpers.js
export const createMatrix = (visibleRows = 14, cols = 10, hiddenRows = 3) => {
  return Array.from({ length: visibleRows + hiddenRows }, () => 
    Array.from({ length: cols }, () => [])
  );
};

export const checkCollision = (matrix, shape, position) => {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newY = position.y + y;
        const newX = position.x + x;
        
        // بررسی مرزهای ماتریس
        if (newY >= matrix.length || newX < 0 || newX >= matrix[0].length) {
          return true;
        }
        
        // بررسی برخورد با قطعات دیگر (فقط اگر در محدوده ماتریس باشد)
        if (newY >= 0 && matrix[newY][newX].length > 0) {
          return true;
        }
      }
    }
  }
  return false;
};