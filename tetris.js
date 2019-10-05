const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = 20;
const VACANT = "WHITE"; //empty square color

//draw 1 unit square
function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x*SQ, y*SQ, SQ, SQ);
}

//create the board
let board = [];
for(r = 0; r < ROW; r++) {
  board[r] = [];
  for(c = 0; c < COL; c++) {
    board[r][c] = VACANT;
  }
}

//draw the board
function drawBoard() {
  for(r = 0; r < ROW; r++) {
    for(c = 0; c < COL; c++) {
      drawSquare(c, r, board[r][c]);
    }
  }
}

drawBoard();

//picese and their colors
const PIECES = [
  [Z, "red"],
  [S, "green"],
  [T, "yellow"],
  [O, "blue"],
  [L, "purple"],
  [I, "cyan"],
  [J, "orange"],
];

//gnerate random pieces
function randomPiece() {
  let r = randomN = Math.floor(Math.random() * PIECES.length)
  return new PIECES( PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();

//The Object Piece
//(not sure what this is yet)
function Piece(tetromino, color) {
  this.tetromino = tetromino;
  this.color = color;

  this.tetrominoN = 0;
  this.activeTetromino = this.tetromino[this.tetrominoN];

  //control based on the co-ords?
  this.x = 3;
  this.y = -2;
} 

//fill function
Piece.prototype.fill = function(color) {
  for(r = 0; r < this.activeTetromino.length; r++) {
    for(c = 0; c < this.activeTetromino.length; c++) {
      //fill in portion of the grid if it has tetris piece
      if(this.activeTetromino[r][c]) {
        drawSquare(this.x + c, this.y + r, color);
      }
    }
  }
}

//draw a piece onto the board
Piece.prototype.draw = function() {
  this.fill(this.color);
}

//undraw piece
Piece.prototype.unDraw = function() {
  this.fill(VACANT);
}

//piece moves down
Piece.prototype.moveDown = function() {
  if(!this.collision(0, 1, this.activeTetromino)) {
    this.unDraw();
    this.y++;
    this.draw();
  }
  else {
    this.lock();
    p = randomPiece();
  }
}

//piece moves right
Piece.prototype.moveRight = function() {
  if(!this.collision(1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x++;
    this.draw();
  }
}

//piece moves left
Piece.prototype.moveLeft = function() {
  if(!this.collision(-1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x--;
    this.draw();
  }
}

//rotate the piece
Piece.prototype.rotate = function() {
  let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
  let kick = 0;

  if(this.collision(0, 0, nextPattern)) {
    if(this.x > COL/2) {
      //hits right wall, moves left 1
      kick = -1;
    }
    else {
      kick = 1;
    }
  }

  if(!this.collision(kick, 0, nextPattern)) {
    this.unDraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
}

let score = 0;

Piece.prototype.lock = function() {
  for(r = 0; r < this.activeTetromino.length; r++) {
    for(c = 0; c < this.activeTetromino.length; c++) {
      if(!this.activeTetromino[r][c]) {
        continue;
      }
      if(this.y + r < 0) {
        alert("Game Over");
        gameOver = true;
        break;
      }
      board[this.y + r][this.x + c] = this.color;
    }
  }
  //remove full rows
  for(r = 0; r < ROW; r++) {
    let isRowFull = true;
    for(c = 0; c < COL; c++) {
      isRowFull = isRowFull && (board[r][c] != VACANT);
    }
    if(isRowFull) {
      //if full row, move down all other rows
      for(y = r; y > 1; y--) {
        for(c = 0; c < COL; c++) {
          board[y][c] = board[y - 1][c];
        }
      }
      //line 192 in guide (lots of extra whitespace there)
    }
  }
}