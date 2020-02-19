import React from 'react';



class BoardRow extends React.Component{
  constructor(props){
    super(props);


  }
  render(){
    let cols = [];
    for (let i = 0; i < this.props.cells.length; i++){
      cols.push((<td>{this.props.cells[i]}</td>));
    }
    return <tr>{cols}</tr>;
  }
}

export default BoardRow;
