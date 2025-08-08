import { useState, useEffect } from "react";
import './othello.css'
import { isInaccessible } from "@testing-library/dom";
const BOARD_SIZE = 6; // オセロの6x6のボードサイズ

// ボードの初期化関数
const initializeBoard = () => {
  const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  // 初期配置
  board[2][2] = 'O';
  board[2][3] = 'X';
  board[3][2] = 'X';
  board[3][3] = 'O';
  return board; // 初期ボードを返す
};

const Othello = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [seconds, setSeconds] = useState(0);
  const [board, setBoard] = useState(initializeBoard);
  const [gamefinish, setGamefinish] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [statusMessage, setStatus] = useState("Let's Play");
  const [score, setScore] = useState({ white: 2, black: 2 });
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const flipDiscs = (board, row, col, player) => {
    const opponent = player === 'X' ? 'O' : 'X';
    const direction = [
      [0, 1], [1, 0], [0, -1], [-1, 0], 
      [1, 1], [1, -1], [-1, 1], [-1, -1] 
    ];

    let flipped = [];
    direction.forEach(([dx, dy]) => {
      let tempFlips = [];
      let x = row + dx;
      let y = col + dy;

      while (x >=0 && y >= 0 && x <BOARD_SIZE && y < BOARD_SIZE){
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

  const makeMove = (row, col, player) => {
    const newBoard = board.map(row => [...row]);
    const flipped = flipDiscs(newBoard,row,col,player);

    if (flipped.length){
      flipped.forEach(([x,y]) => {
        newBoard[x][y] = player;
      });
      setBoard(newBoard);
      setIsPlayerTurn(!isPlayerTurn);
    }
  };

  const aiMove = () => {
    const availableMoves = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const newBoard = board.map(row => [...row]);
        if(newBoard[i][j] === null && flipDiscs(newBoard,i ,j, 'O').length){
          availableMoves.push([i,j]);
        }
      }
    }

    if (availableMoves.length){
      const [row, col] = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      setTimeout(() => {
        makeMove(row, col, 'O');
      }, 3000);
    }
  };
  useEffect(() => {
    if (!isPlayerTurn){
      aiMove();
    }
  },[isPlayerTurn]);

  const handleClick = (row, col) => {
    if (board[row][col] === null && isPlayerTurn){
      makeMove(row,col,'X');
    }
  }

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
      <div className="Difficulty">
        <label>Difficulty: </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="very hard">Very Hard</option>
        </select>

      </div>
      <div className="Timer">
        <span>Time⏱️: {seconds}s</span>
      </div>
      <div className="Score">
        <span>白：{score.white} 黒：{score.black} </span>
      </div>
      <div className="Board">
        {renderBoard()}
      </div>
      <div className="Status Message">
        <p>message</p>
      </div>
    </div>
  );
}

export default Othello;