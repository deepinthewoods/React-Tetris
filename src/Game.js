import React from 'react';
import Board from './Board.js';

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
const ROTATEOFFSETSX = [0, 1, -1, 0, 1, -1];//flip for right
const ROTATEOFFSETSY = [0, 0, 0, -1, -1, -1];


class Game extends React.Component{
  constructor(props){
    console.log("constr");
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    let cellst = [];
    for (let i = 0; i < TOTAL_ROWS; i++){
      let row = Array(TOTAL_COLUMNS).fill('@');
      cellst.push(row);
    }
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
    }
    ;
    this.tick = this.tick.bind(this);

  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 250);
    document.addEventListener("keydown", this.handleKeyPress, false);

  }
  componentWillUnmount() {
    clearInterval(this.interval);
    document.removeEventListener("keydown", this.handleKeyPress, false);

  }
  moveValid(x, y, id, r, cells){
    let p = pieces[id*4+r];
    for (let i = 0; i < p.length; i++)
      for (let j = 0; j < p[0].length; j++){
        if (p[i][j] != ' '){
          //newCells[i+y][j+x] = p[i][j];
          if (j+x < 0) return false;
          if (j+x >= TOTAL_COLUMNS) return false;
          if (i + y >= TOTAL_ROWS) return false;
          if (cells[i+y][j+x] != '@') return false;
        }

      }
    return true;
  }
  tick(){
      console.log("tick" + this.state);
      //move current piece down
      let id = this.state.pieceID;
      let r = this.state.pieceRotation;
      let x = this.state.pieceX;
      let y = this.state.pieceY+1;
      let newCells = this.state.baseCells.map(function(arr) {
        return arr.slice();
      });
      let p = pieces[id*4+r];
      let newPiece = false;
      if (!this.moveValid(x, y, id, r, this.state.baseCells)){
          y--;
          newPiece = true;
      }
      for (let i = 0; i < p.length; i++)
        for (let j = 0; j < p[0].length; j++){
          if (p[i][j] != ' ')
            newCells[i+y][j+x] = p[i][j];
        }

      if (newPiece){
        let newID = Math.random() * 7.0;
        //console.log("random " + newID);
        newID = Math.floor(newID);
        //console.log("random " + newID);
        this.setState({
          pieceY: 0,
          cells: newCells,
          baseCells: newCells.map(function(arr) {
            return arr.slice();
          }),
          pieceID : newID,
          pieceRotation : 0,
          pieceX : Math.floor(TOTAL_COLUMNS/2) - Math.floor(pieces[newID*4].length/2),
        });
      } else {
        this.setState({
          pieceY: y,
          cells: newCells,
        });
      }
  }
  // yMoveValid(x, y, id, r){
  //   let p = pieces[id*4+r];
  //
  //   return true;
  // }

  moveX(interval){
    let x = this.state.pieceX;
    let y = this.state.pieceY;
    let id = this.state.pieceID;
    let r = this.state.pieceRotation;
    //x += interval;
    if (this.moveValid(x+interval, y, id, r, this.state.baseCells)){
      this.setState({
        pieceX : x+interval,
      })
    }
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
      if (this.moveValid(x+ox, y+oy, id, r, this.state.baseCells)){
        this.setState({
          pieceX : x+ox,
          pieceY : y+oy,
          pieceRotation : r,
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
    }

  }

  render(){
    return (
      <Board cells={this.state.cells} />

    )
  }
}
export default Game;
