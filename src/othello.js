import { useState, useEffect } from "react";
import './othello.css'

// ボードの初期化関数
const initializeBoard = (size) => {
  const board = Array(size).fill(null).map(() => Array(size).fill(null));
  // 初期配置
  const x = size / 2 //初期配置の決定の際に用いる
  
  board[x-1][x-1] = '◯';
  board[x-1][x] = '●';
  board[x][x-1] = '●';
  board[x][x] = '◯';
  return board; // 初期ボードを返す
};

// 盤面の石を数える
const calculateScore = (board,size) => {
  let white = 0;
  let black = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === '◯') white++;
      if (board[i][j] === '●') black++;
    }
  }
  return { white, black };
};

const Othello = () => {
  const [seconds, setSeconds] = useState(0);
  const [board, setBoard] = useState(() => initializeBoard(8));
  const [score, setScore] = useState({ white: 2, black: 2 });
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [square, setSquare] = useState('8×8')
  const [timerActive, setTimerActive] = useState(false);
  const [message,setMessage] = useState(" ");
  const [boardSize, setBoardSize] = useState(8);
const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setBoard(initializeBoard(boardSize));
  }, [boardSize]);
 
  const flipDiscs = (board, row, col, player) => {
    const opponent = player === '●' ? '◯' : '●';
    const direction = [
      [0, 1], [1, 0], [0, -1], [-1, 0], 
      [1, 1], [1, -1], [-1, 1], [-1, -1] 
    ];

    let flipped = [];
    direction.forEach(([dx, dy]) => {
      let tempFlips = [];
      let x = row + dx;
      let y = col + dy;

      while (x >=0 && y >= 0 && x <boardSize && y < boardSize){
        if (board[x][y] === opponent){
          tempFlips.push([x,y]);
        }else if (board[x][y] === player && tempFlips.length > 0){
          flipped = flipped.concat(tempFlips);
          break;
        }else{
          break;
        }
        x += dx;
        y += dy;
      }
    });

    flipped.forEach(([x,y]) => {
      board[x][y] = player;
    });
    return flipped.length > 0 ? [...flipped, [row,col]] : [];
    
  };

  const makeMove = (row,col,player) => {
    const newBoard = board.map(row => [...row]);
    const flipped = flipDiscs(newBoard,row,col,player);

    if (flipped.length){
      flipped.forEach(([x,y]) => {
        newBoard[x][y] = player;
      });
      setBoard(newBoard);
      setIsPlayerTurn(!isPlayerTurn);
      setSeconds(10)
    }
  };

useEffect(() => {
  setScore(calculateScore(board,boardSize));
}, [board,boardSize]);

  // そのプレイヤーに打てる手があるか判定
const hasValidMove = (board, player) => {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === null) {
        const newBoard = board.map(row => [...row]);
        if (flipDiscs(newBoard, i, j, player).length) {
          return true;
        }
      }
    }
  }
  return false;
};

  const aiMove = () => {
    const availableMoves = [];
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const newBoard = board.map(row => [...row]);
        if(newBoard[i][j] === null && flipDiscs(newBoard,i ,j, '◯').length){
          availableMoves.push([i,j]);
        }
      }
    }

    if (availableMoves.length){
      const [row, col] = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      setTimeout(() => {
        makeMove(row, col, '◯');
      }, 300);
    }
  };

  // ゲーム終了判定
const isGameOver = (board) => {
  return !hasValidMove(board, '●') && !hasValidMove(board, '◯');
};

const resetGame = () => {
  const newBoard = initializeBoard(boardSize);
  setBoard(newBoard);
  setIsPlayerTurn(true);
  setMessage("プレイヤーのターンです");
  setGameOver(false);
};

useEffect(() => {
  if (!isPlayerTurn) {
    // AIターン
    if (hasValidMove(board, '◯')) {
      aiMove();
    } else {
      // AIがパス → プレイヤーのターンに戻す
      setMessage("AIパス");
      setIsPlayerTurn(true);
    }
  } else {
    // プレイヤーターン
    if (!hasValidMove(board, '●')) {
      // プレイヤーが打てない → 強制的にAIのターンへ
      setMessage("プレイヤーパス");
      setIsPlayerTurn(false);
    }
  }

  if (isGameOver(board)) {
    const finalScore = calculateScore(board, boardSize);
    if (finalScore.white > finalScore.black) {
      setMessage(`ゲーム終了！ 白: ${finalScore.white} 黒: ${finalScore.black} → 白の勝ち 🎉`);
    } else if (finalScore.black > finalScore.white) {
      setMessage(`ゲーム終了！ 白: ${finalScore.white} 黒: ${finalScore.black} → 黒の勝ち 🎉`);
    } else {
      setMessage(`ゲーム終了！ 白: ${finalScore.white} 黒: ${finalScore.black} → 引き分け 🤝`);
    }
    setGameOver(true);
  }
}, [isPlayerTurn,board]);

  const handleClick = (row, col) => {
    if (!gameOver && board[row][col] === null && isPlayerTurn){
      makeMove(row,col,'●');
    }
  };

  const renderBoard = () => {
    return (
      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div
                key={j}
                onClick={() => handleClick(i, j)} // セルがクリックされたときの処理
                className={`cell ${cell ? cell : ''}`} // セルのクラスを設定
              >
                {cell} {/* 駒を表示 */}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
    
  return (
    <div>
      <div className="Gaming Header">
        <h1>Othello</h1>
      </div>
      <div className="Timer">
        <span>Time⏱️: {seconds}s</span>
      </div>
      <div className="Score">
        <span>◯：{score.white} ●：{score.black} </span>
      </div>
      
      {/* <SelectSquare square={square} setSquare={setSquare}/> */}
      <div className="Square">
        <label>Square: </label>
        <select
          value={square}
          onChange={(e) => {setSquare(e.target.value);
          if (e.target.value === "4×4") setBoardSize(4);
          if (e.target.value === "6×6") setBoardSize(6);
          if (e.target.value === "8×8") setBoardSize(8);
        }}
        >
          <option value="4×4">4×4</option>
          <option value="6×6">6×6</option>
          <option value="8×8">8×8</option>
        </select>

        {gameOver && (
          <button onClick={resetGame} className="reset-button">
            リセット
          </button>
        )}
      </div>
      <div className="Board">
        {renderBoard()}
      </div>
      <div className="Status Message">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Othello;