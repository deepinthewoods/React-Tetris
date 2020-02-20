import React from 'react';
import Board from './Board.js';
import PreviewBoard from './PreviewBoard.js';
const pieces = [
[
  ////// I
  [' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' '],
  ['0', '0', '0', '0'],
  [' ', ' ', ' ', ' ']
],
[
  [' ', ' ', '0', ' '],
  [' ', ' ', '0', ' '],
  [' ', ' ', '0', ' '],
  [' ', ' ', '0', ' ']
],
[
  [' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' '],
  ['0', '0', '0', '0'],
  [' ', ' ', ' ', ' ']
],
[
  [' ', '0', ' ', ' '],
  [' ', '0', ' ', ' '],
  [' ', '0', ' ', ' '],
  [' ', '0', ' ', ' ']
],
////////// T
[
[' ', ' ', ' '],
['1', '1', '1'],
[' ', '1', ' ']

],
[
  [' ', '1', ' '],
  ['1', '1', ' '],
  [' ', '1', ' ']
],
[
  [' ', ' ', ' '],
  [' ', '1', ' '],
  ['1', '1', '1']
],
[
[' ', '1', ' '],
[' ', '1', '1'],
[' ', '1', ' ']
],
/// L
[
  [' ', ' ', ' '],
  ['2', '2', '2'],
  ['2', ' ', ' ']
],
[
  ['2', '2', ' '],
  [' ', '2', ' '],
  [' ', '2', ' ']
],
[
  [' ', ' ', ' '],
  [' ', ' ', '2'],
  ['2', '2', '2']
],
[
  [' ', '2', ' '],
  [' ', '2', ' '],
  [' ', '2', '2']
],

/// LR
[
  [' ', ' ', ' '],
  ['3', '3', '3'],
  [' ', ' ', '3']
],
[
  [' ', '3', ' '],
  [' ', '3', ' '],
  ['3', '3', ' ']
],
[
  [' ', ' ', ' '],
  ['3', ' ', ' '],
  ['3', '3', '3']
],
[
  [' ', '3', '3'],
  [' ', '3', ' '],
  [' ', '3', ' ']
],

/// RZ
[
  [' ', ' ', ' '],
  [' ', '4', '4'],
  ['4', '4', ' ']
],
[
  [' ', '4', ' '],
  [' ', '4', '4'],
  [' ', ' ', '4']
],
[
  [' ', ' ', ' '],
  [' ', '4', '4'],
  ['4', '4', ' ']
],
[
  ['4', ' ', ' '],
  ['4', '4', ' '],
  [' ', '4', ' ']
],

/// Z
[
  [' ', ' ', ' '],
  ['5', '5', ' '],
  [' ', '5', '5']
],
[
  [' ', ' ', '5'],
  [' ', '5', '5'],
  [' ', '5', ' ']
],
[
  [' ', ' ', ' '],
  ['5', '5', ' '],
  [' ', '5', '5']
],
[
  [' ', '5', ' '],
  ['5', '5', ' '],
  ['5', ' ', ' ']
],

/// O
[
  ['6', '6'],
  ['6', '6']
],
[
  ['6', '6'],
  ['6', '6']
],
[
  ['6', '6'],
  ['6', '6']
],
[
  ['6', '6'],
  ['6', '6']
]
];

const TOTAL_ROWS = 24;
const TOTAL_COLUMNS = 10;
const TOTAL_PREVIEW_ROWS = 4;
const TOTAL_PREVIEW_COLUMNS = 4;

const ROTATEOFFSETSX = [0, 1, -1, 0, 1, -1];//flip for right
const ROTATEOFFSETSY = [0, 0, 0, -1, -1, -1];
const INITIALOFFSET = [2, 1, 1, 1, 1, 1, 0];
// const INITIALOFFSET = [0, 0, 0, 0, 0, 0, 0];
const INTERVAL_START = 300;
const INTERVAL_END = 50;
const TOTAL_LEVELS = 10;
const TIME_BETWEEN_LEVELS = 10000;

class Game extends React.Component{

  constructor(props){
    // console.log("constr");
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    let cellst = [];
    for (let i = 0; i < TOTAL_ROWS; i++){
      let row = Array(TOTAL_COLUMNS).fill('@');
      cellst.push(row);
    }
    let pCells = [];
    for (let i = 0; i < TOTAL_PREVIEW_ROWS; i++){
      let row = Array(TOTAL_PREVIEW_COLUMNS).fill('@');
      pCells.push(row);
    }
    let next = Math.floor(Math.random() * 7.0);
    this.state = {
      pieceX : 0,
      pieceY : 0,
      nextPieceID : 0,
      pieceID : 0,
      pieceRotation : 0,
      cells: cellst,
      baseCells: cellst.map(function(arr) {
        return arr.slice();
      }),
      gameIsOver: false,
      isFalling: false,
      previewCells: pCells,
      nextID : next,
      isNewPiece: true,
      lastLevelTime: Date.now(),
      level:0,
    };
    this.setPreviewCells(next);
    this.tick = this.tick.bind(this);

  }

  getInterval(level){
    let int = INTERVAL_START - INTERVAL_END;
    int /= TOTAL_LEVELS;
    let interval = INTERVAL_START - int * level;
  //  console.log("interval for level " + level + " : " + interval);
    return interval;
  }

  componentDidMount() {
    //this.interval =
    setTimeout(this.tick, this.getInterval(0));
    document.addEventListener("keydown", this.handleKeyPress, false);

  }
  componentWillUnmount() {
    //clearInterval(this.interval);
    document.removeEventListener("keydown", this.handleKeyPress, false);

  }
  moveValid(x, y, id, r, cells){
    let p = pieces[id*4+r];
    for (let i = 0; i < p.length; i++)
      for (let j = 0; j < p[0].length; j++){
        if (p[i][j] != ' '){
          //newCells[i+y][j+x] = p[i][j];
          if (j+x >= TOTAL_COLUMNS) return false;
          if (i + y < 0) return false;
          if (i + y >= TOTAL_ROWS) return false;
          if (cells[i+y][j+x] != '@') return false;
        }

      }
    return true;
  }
  rotateValid(x, y, id, r, cells){
    let p = pieces[id*4+r];
    for (let i = 0; i < p.length; i++)
      for (let j = 0; j < p[0].length; j++){
        if (p[i][j] != ' '){
          //newCells[i+y][j+x] = p[i][j];
          if (j+x < 0) return false;
          if (j+x >= TOTAL_COLUMNS) return false;
          if (y < 0) return false;
          if (i + y >= TOTAL_ROWS) return false;
          if (cells[i+y][j+x] != '@') return false;
        }

      }
    return true;
  }
  setPreviewCells(id){
      let cells = this.state.previewCells;
      let p = pieces[id*4];
      for (let x = 0; x < 4; x++)
        for (let y = 0; y < 4; y++){
          cells[x][y] = '@';//String.fromCharCode(160);
        }
      //if (!p) alert("null p");
        for (let x = 0; x < p[0].length; x++)
          for (let y = 0; y < p.length; y++){
            if (p[y][x] != ' ') //cells[y][x] = String.fromCharCode(160);//non breakable space
              cells[y][x] = p[y][x];
        }
  }
  tick(){
      console.log("tick" + this.state);
      if (this.state.gameIsOver) return;
      if (this.state.isNewPiece){
        this.setState({
          isFalling: false,
        });
        this.setPreviewCells(this.state.nextID);
      }
      //move current piece down
      let id = this.state.pieceID;
      let r = this.state.pieceRotation;
      let x = this.state.pieceX;
      let y = this.state.pieceY;

      let p = pieces[id*4+r];
      let newPiece = false;
      let falls = 1;
      if (this.state.isFalling){
        falls = TOTAL_ROWS;
        //alert("fall");
      }
      for (let i = 0; i < falls; i++){
        if (!this.moveValid(x, ++y, id, r, this.state.baseCells)){
            y--;
            newPiece = true;
            if (this.state.isNewPiece){
              //alert("end");
              this.setState({
                gameIsOver: true,
              })
              return;
            }
        }
      }

      let newCells = this.getNewCells(x, y, id, r);

      if (newPiece){

        let next = Math.floor(Math.random() * 7.0);
        let newID = this.state.nextID;
        //console.log("random " + newID);
        //console.log("random " + newID);

        this.setState({
          pieceY: -1-INITIALOFFSET[newID],
          cells: newCells,
          baseCells: newCells.map(function(arr) {
            return arr.slice();
          }),
          pieceID : newID,
          pieceRotation : 0,
          pieceX : Math.floor(TOTAL_COLUMNS/2) - Math.floor(pieces[newID*4].length/2),
          isNewPiece : true,
          nextID : next,
        });
        this.tick(true);
      } else {
        this.setState({
          pieceY: y,
          cells: newCells,
          isNewPiece: false,
        });
      }
      this.checkForCompletedLines();
      let date = Date.now();
      if ((date - this.state.lastLevelTime) > TIME_BETWEEN_LEVELS && this.state.level < TOTAL_LEVELS){
        this.setState({
          level: this.state.level+1,
          lastLevelTime: date,
        })
      }
      if (!newPiece)setTimeout(this.tick, this.getInterval(this.state.level));

  }


  checkForCompletedLines(){
    let found = false;
    let newCells = this.state.baseCells.map(function(arr) {
      return arr.slice();
    });
    for (let i = 0; i < TOTAL_ROWS; i++){
      let row = newCells[i];
      let rowFound = true;
      for (let x = 0; x < row.length; x++){
        if (row[x] == '@')
          rowFound = false;
      }
      if (rowFound){
        found = true;
        let rem = newCells.splice(i, 1)[0];//remove row
        rem.fill('@');
        newCells.unshift(rem);
      }
    }

    if (found){
      this.setState({
        baseCells: newCells,
      });
    }
  }

  moveX(interval){
    let x = this.state.pieceX;
    let y = this.state.pieceY;
    let id = this.state.pieceID;
    let r = this.state.pieceRotation;
    //x += interval;
    if (this.moveValid(x+interval, y, id, r, this.state.baseCells)){
      x += interval;
      let newCells = this.getNewCells(x, y, id, r);



      this.setState({
        pieceX : x,
        cells : newCells,
      });

    }
  }

  getNewCells(x, y, id, r){
    let newCells = this.state.baseCells.map(function(arr) {
      return arr.slice();
    });
    let p = pieces[id*4+r];
    for (let i = 0; i < p.length; i++)
      for (let j = 0; j < p[0].length; j++){
        if (p[i][j] != ' ')
          newCells[i+y][j+x] = p[i][j];
      }
    //preview
    let foundPreview = false;
    let foundY = 0;
    for (let h = y+p.length; h < TOTAL_ROWS; h++){
      if (this.moveValid(x, h, id, r, newCells)){
        foundPreview = true;
        foundY = h;
        //break;
      }
    }
    if (foundPreview){
      for (let i = 0; i < p.length; i++)
        for (let j = 0; j < p[0].length; j++){
          if (p[i][j] != ' ')
            newCells[i+foundY][j+x] = 7;
        }
    }

    return newCells;
  }

  rotate(rotation){//rotation=-1 for left
    let x = this.state.pieceX;
    let y = this.state.pieceY;
    let id = this.state.pieceID;
    let r = this.state.pieceRotation-rotation;
    if (r < 0) r+=4;
    r %= 4;
    //x += interval;
    for (let i = 0; i < ROTATEOFFSETSX.length; i++){
      let ox = ROTATEOFFSETSX[i] * rotation;
      let oy = ROTATEOFFSETSY[i];
      if (this.rotateValid(x+ox, y+oy, id, r, this.state.baseCells)){
        x += ox;
        y += oy;
        let newCells = this.getNewCells(x, y, id, r);
        this.setState({
          pieceX : x,
          pieceY : y,
          pieceRotation : r,
          cells : newCells,
        });
        return;
      }
    }

  }

  handleKeyPress(event){
    switch (event.keyCode){
      case 37 : this.moveX(-1); break;//L
      case 39 : this.moveX(1); break;//R
      case 38 : this.rotate(1); break;//UP
      case 40 : this.setState({
        isFalling: true,
      });

      break;//DOWN
    }

  }

  render(){
    return (
      <div>
      <PreviewBoard cells={this.state.previewCells} />
      <br/>
      <Board cells={this.state.cells} />
      </div>

    )
  }
}
export default Game;
