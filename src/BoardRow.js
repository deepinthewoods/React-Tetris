import React from 'react';



class BoardRow extends React.Component{
  constructor(props){
    super(props);


  }
  render(){
    let cols = [];
    for (let i = 0; i < this.props.cells.length; i++){
      let c = this.props.cells[i];
      cols.push((<td className={"tile"+c}>{c}</td>));
    }
    return <tr>{cols}</tr>;
  }
}

export default BoardRow;
